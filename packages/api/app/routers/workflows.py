from fastapi import APIRouter, BackgroundTasks, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_firm
from app.config import get_settings
from app.database import get_db
from app.models import Firm, FirmMembership, User, WorkflowRun, WorkflowTemplate
from app.schemas import WorkflowRunOut, WorkflowRunStepOut, WorkflowTemplateOut, WorkflowTriggerRequest
from app.services.workflows import execute_workflow_run

router = APIRouter(prefix="/workflows", tags=["workflows"])
settings = get_settings()


async def _run_workflow(run_id: str) -> None:
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        run = db.get(WorkflowRun, run_id)
        if run:
            template = db.get(WorkflowTemplate, run.workflow_id)
            if template:
                await execute_workflow_run(db, run, template)
    finally:
        db.close()


@router.get("", response_model=list[WorkflowTemplateOut])
def list_workflows(db: Session = Depends(get_db)):
    templates = db.scalars(select(WorkflowTemplate).order_by(WorkflowTemplate.name)).all()
    return [WorkflowTemplateOut.model_validate(t) for t in templates]


@router.get("/{workflow_id}", response_model=WorkflowTemplateOut)
def get_workflow(workflow_id: str, db: Session = Depends(get_db)):
    t = db.get(WorkflowTemplate, workflow_id)
    if not t:
        raise HTTPException(404, "Workflow not found")
    return WorkflowTemplateOut.model_validate(t)


@router.post("/{workflow_id}/trigger", response_model=WorkflowRunOut, status_code=202)
async def trigger_workflow(
    workflow_id: str,
    body: WorkflowTriggerRequest,
    background_tasks: BackgroundTasks,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    template = db.get(WorkflowTemplate, workflow_id)
    if not template:
        raise HTTPException(404, "Workflow not found")
    run = WorkflowRun(firm_id=firm.id, workflow_id=template.id, input_payload=body.payload)
    db.add(run)
    db.commit()
    db.refresh(run)
    background_tasks.add_task(_run_workflow, run.id)
    return WorkflowRunOut(
        id=run.id,
        workflow_id=run.workflow_id,
        status=run.status,
        input_payload=run.input_payload,
        output_summary=run.output_summary,
        created_at=run.created_at,
        completed_at=run.completed_at,
        steps=[],
    )


@router.get("/runs/list", response_model=list[WorkflowRunOut])
def list_runs(
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    runs = (
        db.execute(
            select(WorkflowRun)
            .where(WorkflowRun.firm_id == firm.id)
            .options(joinedload(WorkflowRun.steps))
            .order_by(WorkflowRun.created_at.desc())
            .limit(50)
        )
        .unique()
        .scalars()
        .all()
    )
    return [_run_to_out(r) for r in runs]


@router.get("/runs/{run_id}", response_model=WorkflowRunOut)
def get_run(
    run_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    run = db.scalar(
        select(WorkflowRun)
        .where(WorkflowRun.id == run_id, WorkflowRun.firm_id == firm.id)
        .options(joinedload(WorkflowRun.steps))
    )
    if not run:
        raise HTTPException(404, "Run not found")
    return _run_to_out(run)


@router.post("/webhooks/n8n/{workflow_id}", status_code=202)
async def n8n_webhook(
    workflow_id: str,
    body: WorkflowTriggerRequest,
    background_tasks: BackgroundTasks,
    x_webhook_secret: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if x_webhook_secret != settings.n8n_webhook_secret:
        raise HTTPException(401, "Invalid webhook secret")
    template = db.get(WorkflowTemplate, workflow_id)
    if not template:
        raise HTTPException(404, "Workflow not found")
    firm_id = body.payload.get("firm_id")
    if not firm_id:
        raise HTTPException(400, "firm_id required in payload")
    run = WorkflowRun(firm_id=str(firm_id), workflow_id=template.id, input_payload=body.payload)
    db.add(run)
    db.commit()
    db.refresh(run)
    background_tasks.add_task(_run_workflow, run.id)
    return {"run_id": run.id, "status": "accepted"}


def _run_to_out(run: WorkflowRun) -> WorkflowRunOut:
    steps = sorted(run.steps, key=lambda s: s.step_order) if run.steps else []
    return WorkflowRunOut(
        id=run.id,
        workflow_id=run.workflow_id,
        status=run.status,
        input_payload=run.input_payload,
        output_summary=run.output_summary,
        created_at=run.created_at,
        completed_at=run.completed_at,
        steps=[WorkflowRunStepOut.model_validate(s) for s in steps],
    )
