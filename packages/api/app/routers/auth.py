from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import (
    create_access_token,
    create_refresh_token_record,
    get_current_user,
    get_membership,
    hash_password,
    revoke_refresh_token,
    verify_password,
    verify_refresh_token,
)
from app.database import get_db
from app.models import Firm, FirmMembership, User, UserRole
from app.schemas import (
    AuthMeResponse,
    FirmOut,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == body.email)):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    refresh = create_refresh_token_record(db, user.id)
    return TokenResponse(access_token=create_access_token(user.id), refresh_token=refresh)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == body.email))
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    refresh = create_refresh_token_record(db, user.id)
    return TokenResponse(access_token=create_access_token(user.id), refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    user = verify_refresh_token(db, body.refresh_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    revoke_refresh_token(db, body.refresh_token)
    new_refresh = create_refresh_token_record(db, user.id)
    return TokenResponse(access_token=create_access_token(user.id), refresh_token=new_refresh)


@router.post("/logout")
def logout(body: RefreshRequest, db: Session = Depends(get_db)):
    revoke_refresh_token(db, body.refresh_token)
    return {"ok": True}


@router.get("/me", response_model=AuthMeResponse)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership = get_membership(db, user)
    firm = db.get(Firm, membership.firm_id) if membership else None
    return AuthMeResponse(
        user=UserOut.model_validate(user),
        firm=FirmOut.model_validate(firm) if firm else None,
        role=membership.role if membership else None,
    )
