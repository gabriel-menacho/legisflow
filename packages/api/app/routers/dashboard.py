from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import get_current_firm
from app.database import get_db
from app.models import (
    ChatThread,
    Document,
    DocumentStatus,
    Firm,
    FirmMembership,
    User,
    WorkflowRun,
)
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
    return DashboardStats(
        documents_indexed=docs_ready,
        documents_processing=docs_processing,
        chat_threads=threads,
        workflow_runs=runs,
    )


@router.get("/llm-config", response_model=LLMConfigOut)
def llm_config():
    return LLMConfigOut(**get_llm_config())
