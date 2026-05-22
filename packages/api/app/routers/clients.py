from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import get_current_firm
from app.database import get_db
from app.models import Client, Firm, FirmMembership, Matter, User
from app.schemas import ClientCreate, ClientOut, ClientUpdate, MatterCreate, MatterOut
from app.services.matter_steps import create_matter_steps, matter_to_out

router = APIRouter(prefix="/clients", tags=["clients"])


def _client_out(db: Session, client: Client) -> ClientOut:
    count = db.scalar(
        select(func.count()).select_from(Matter).where(Matter.client_id == client.id)
    ) or 0
    return ClientOut(
        id=client.id,
        name=client.name,
        company=client.company,
        email=client.email,
        phone=client.phone,
        notes=client.notes,
        status=client.status,
        created_at=client.created_at,
        updated_at=client.updated_at,
        matter_count=count,
    )


@router.get("", response_model=list[ClientOut])
def list_clients(
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    clients = db.scalars(
        select(Client).where(Client.firm_id == firm.id).order_by(Client.updated_at.desc())
    ).all()
    return [_client_out(db, c) for c in clients]


@router.post("", response_model=ClientOut, status_code=201)
def create_client(
    body: ClientCreate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = Client(
        firm_id=firm.id,
        name=body.name,
        company=body.company,
        email=body.email,
        phone=body.phone,
        notes=body.notes,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return _client_out(db, client)


@router.get("/{client_id}", response_model=ClientOut)
def get_client(
    client_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = db.get(Client, client_id)
    if not client or client.firm_id != firm.id:
        raise HTTPException(404, "Client not found")
    return _client_out(db, client)


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: str,
    body: ClientUpdate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = db.get(Client, client_id)
    if not client or client.firm_id != firm.id:
        raise HTTPException(404, "Client not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return _client_out(db, client)


@router.delete("/{client_id}")
def delete_client(
    client_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = db.get(Client, client_id)
    if not client or client.firm_id != firm.id:
        raise HTTPException(404, "Client not found")
    db.delete(client)
    db.commit()
    return {"ok": True}


@router.get("/{client_id}/matters", response_model=list[MatterOut])
def list_client_matters(
    client_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = db.get(Client, client_id)
    if not client or client.firm_id != firm.id:
        raise HTTPException(404, "Client not found")
    matters = db.scalars(
        select(Matter).where(Matter.client_id == client.id).order_by(Matter.updated_at.desc())
    ).all()
    return [matter_to_out(m, client) for m in matters]


@router.post("/{client_id}/matters", response_model=MatterOut, status_code=201)
def create_matter(
    client_id: str,
    body: MatterCreate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    client = db.get(Client, client_id)
    if not client or client.firm_id != firm.id:
        raise HTTPException(404, "Client not found")
    matter = Matter(
        firm_id=firm.id,
        client_id=client.id,
        title=body.title,
        matter_type=body.matter_type,
        summary=body.summary,
    )
    db.add(matter)
    db.flush()
    create_matter_steps(db, matter)
    db.refresh(matter)
    return matter_to_out(matter, client)
