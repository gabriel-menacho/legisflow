from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead
from app.schemas import LeadCreate, LeadOut

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadOut, status_code=201)
def create_lead(body: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(email=body.email, name=body.name, message=body.message)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return LeadOut.model_validate(lead)
