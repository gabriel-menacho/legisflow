from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_firm, get_current_user, get_membership
from app.database import get_db
from app.models import Firm, FirmMembership, User, UserRole
from app.schemas import FirmOut, FirmUpdateRequest, OnboardingRequest

router = APIRouter(prefix="/firms", tags=["firms"])


@router.post("/onboarding", response_model=FirmOut)
def onboarding(
    body: OnboardingRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = get_membership(db, user)
    if existing:
        firm = db.get(Firm, existing.firm_id)
        assert firm
        firm.name = body.name
        firm.size = body.size
        firm.practice_areas = body.practice_areas
        firm.integrations = body.integrations
        firm.onboarding_complete = True
        db.commit()
        db.refresh(firm)
        return FirmOut.model_validate(firm)

    firm = Firm(
        name=body.name,
        size=body.size,
        practice_areas=body.practice_areas,
        integrations=body.integrations,
        onboarding_complete=True,
    )
    db.add(firm)
    db.flush()
    db.add(FirmMembership(user_id=user.id, firm_id=firm.id, role=UserRole.owner.value))
    db.commit()
    db.refresh(firm)
    return FirmOut.model_validate(firm)


@router.get("/current", response_model=FirmOut)
def current_firm(
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
):
    _, firm, _ = ctx
    return FirmOut.model_validate(firm)


@router.patch("/current", response_model=FirmOut)
def update_firm(
    body: FirmUpdateRequest,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    if body.name is not None:
        firm.name = body.name
    if body.size is not None:
        firm.size = body.size
    if body.practice_areas is not None:
        firm.practice_areas = body.practice_areas
    if body.integrations is not None:
        firm.integrations = body.integrations
    db.commit()
    db.refresh(firm)
    return FirmOut.model_validate(firm)
