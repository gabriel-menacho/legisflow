import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Firm, FirmMembership, RefreshToken, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode(
        {"sub": user_id, "exp": expire, "type": "access"},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token_record(db: Session, user_id: str) -> str:
    raw = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    db.add(RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires))
    db.commit()
    return raw


def verify_refresh_token(db: Session, raw: str) -> User | None:
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    row = db.scalar(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked.is_(False),
        )
    )
    if not row or row.expires_at < datetime.now(timezone.utc):
        return None
    return db.get(User, row.user_id)


def revoke_refresh_token(db: Session, raw: str) -> None:
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    row = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    if row:
        row.revoked = True
        db.commit()


def get_current_user(
    db: Session = Depends(get_db),
    creds: HTTPAuthorizationCredentials | None = Depends(security),
) -> User:
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user_id = payload.get("sub")
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_membership(db: Session, user: User) -> FirmMembership | None:
    return db.scalar(select(FirmMembership).where(FirmMembership.user_id == user.id))


def get_current_firm(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> tuple[User, Firm, FirmMembership]:
    membership = get_membership(db, user)
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No firm membership")
    firm = db.get(Firm, membership.firm_id)
    if not firm:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Firm not found")
    return user, firm, membership
