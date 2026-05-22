from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import get_current_firm
from app.database import get_db
from app.models import (
    ChatThread,
    Client,
    Document,
    DocumentStatus,
    Firm,
    FirmMembership,
    Matter,
    MatterStatus,
    User,
    WorkflowRun,
)
from app.services.demo_seed import seed_demo_client_matter
from app.schemas import DashboardStats, LLMConfigOut
from app.llm import get_llm_config

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    docs_ready = db.scalar(
        select(func.count())
        .select_from(Document)
        .where(Document.firm_id == firm.id, Document.status == DocumentStatus.ready.value)
    ) or 0
    docs_processing = db.scalar(
        select(func.count())
        .select_from(Document)
        .where(Document.firm_id == firm.id, Document.status == DocumentStatus.processing.value)
    ) or 0
    threads = db.scalar(
        select(func.count()).select_from(ChatThread).where(ChatThread.firm_id == firm.id)
    ) or 0
    runs = db.scalar(
        select(func.count()).select_from(WorkflowRun).where(WorkflowRun.firm_id == firm.id)
    ) or 0
    clients_count = db.scalar(
        select(func.count()).select_from(Client).where(Client.firm_id == firm.id)
    ) or 0
    active_matters = db.scalar(
        select(func.count())
        .select_from(Matter)
        .where(Matter.firm_id == firm.id, Matter.status == MatterStatus.active.value)
    ) or 0
    demo_client_id, demo_matter_id = seed_demo_client_matter(db)
    return DashboardStats(
        documents_indexed=docs_ready,
        documents_processing=docs_processing,
        chat_threads=threads,
        workflow_runs=runs,
        clients_count=clients_count,
        active_matters=active_matters,
        demo_matter_id=demo_matter_id,
        demo_client_id=demo_client_id,
    )


@router.get("/llm-config", response_model=LLMConfigOut)
def llm_config():
    return LLMConfigOut(**get_llm_config())
