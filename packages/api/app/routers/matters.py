from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_firm
from app.database import get_db
from app.models import Client, Firm, FirmMembership, Matter, MatterStep, User
from app.matter_workflow import MATTER_STEPS
from app.schemas import MatterDetailOut, MatterOut, MatterStepOut, MatterStepUpdate, MatterUpdate
from app.services.matter_steps import (
    _step_to_out,
    advance_current_step,
    generate_step,
    matter_detail_out,
    matter_to_out,
)

router = APIRouter(prefix="/matters", tags=["matters"])


def _get_matter(db: Session, firm_id: str, matter_id: str) -> tuple[Matter, Client]:
    matter = db.get(Matter, matter_id)
    if not matter or matter.firm_id != firm_id:
        raise HTTPException(404, "Matter not found")
    client = db.get(Client, matter.client_id)
    if not client:
        raise HTTPException(404, "Client not found")
    return matter, client


@router.get("/{matter_id}", response_model=MatterDetailOut)
def get_matter(
    matter_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    matter, client = _get_matter(db, firm.id, matter_id)
    return matter_detail_out(db, matter, client)


@router.patch("/{matter_id}", response_model=MatterOut)
def update_matter(
    matter_id: str,
    body: MatterUpdate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    matter, client = _get_matter(db, firm.id, matter_id)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(matter, field, value)
    db.commit()
    db.refresh(matter)
    return matter_to_out(matter, client)


@router.get("/{matter_id}/steps", response_model=list[MatterStepOut])
def list_steps(
    matter_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    matter, _ = _get_matter(db, firm.id, matter_id)
    detail = matter_detail_out(db, matter, db.get(Client, matter.client_id))
    return detail.steps


@router.patch("/{matter_id}/steps/{step_key}", response_model=MatterStepOut)
def update_step(
    matter_id: str,
    step_key: str,
    body: MatterStepUpdate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    if step_key not in MATTER_STEPS:
        raise HTTPException(400, "Invalid step key")
    matter, _ = _get_matter(db, firm.id, matter_id)
    step = db.scalar(
        select(MatterStep).where(
            MatterStep.matter_id == matter.id,
            MatterStep.step_key == step_key,
        )
    )
    if not step:
        raise HTTPException(404, "Step not found")
    if body.status is not None:
        step.status = body.status
    if body.content is not None:
        step.content = body.content
    if body.status == "completed":
        advance_current_step(matter, step_key)
    db.commit()
    db.refresh(step)
    return _step_to_out(step)


@router.post("/{matter_id}/steps/{step_key}/generate", response_model=MatterStepOut)
async def generate_matter_step(
    matter_id: str,
    step_key: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    if step_key not in MATTER_STEPS:
        raise HTTPException(400, "Invalid step key")
    matter, client = _get_matter(db, firm.id, matter_id)
    try:
        step = await generate_step(db, matter, client, step_key)
    except Exception as e:
        raise HTTPException(502, f"Generation failed: {e}") from e
    advance_current_step(matter, step_key)
    db.commit()
    return _step_to_out(step)
