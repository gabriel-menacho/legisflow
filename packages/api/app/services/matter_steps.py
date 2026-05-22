from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.agents.matter_step_agent import generate_matter_step_content
from app.matter_workflow import MATTER_STEP_ORDER, MATTER_STEPS, MATTER_PHASES, ROLE_LABELS
from app.models import Client, Matter, MatterStep, MatterStepStatus
from app.rag.ingest import search_chunks_async
from app.schemas import MatterDetailOut, MatterOut, MatterStepOut


def create_matter_steps(db: Session, matter: Matter) -> None:
    for key in MATTER_STEP_ORDER:
        step_def = MATTER_STEPS[key]
        existing = db.scalar(
            select(MatterStep).where(
                MatterStep.matter_id == matter.id,
                MatterStep.step_key == key,
            )
        )
        if not existing:
            db.add(
                MatterStep(
                    matter_id=matter.id,
                    step_key=key,
                    status=MatterStepStatus.pending.value,
                    assigned_role=step_def["assigned_role"],
                    content={},
                )
            )
    db.commit()


def _step_to_out(step: MatterStep) -> MatterStepOut:
    step_def = MATTER_STEPS.get(step.step_key, {})
    return MatterStepOut(
        id=step.id,
        matter_id=step.matter_id,
        step_key=step.step_key,
        label=step_def.get("label", step.step_key),
        status=step.status,
        assigned_role=step.assigned_role,
        assigned_role_label=ROLE_LABELS.get(step.assigned_role, step.assigned_role),
        content=step.content or {},
        ai_log=step.ai_log,
        updated_at=step.updated_at,
    )


def matter_to_out(matter: Matter, client: Client | None = None) -> MatterOut:
    return MatterOut(
        id=matter.id,
        client_id=matter.client_id,
        title=matter.title,
        matter_type=matter.matter_type,
        status=matter.status,
        current_step_key=matter.current_step_key,
        summary=matter.summary,
        created_at=matter.created_at,
        updated_at=matter.updated_at,
        client_name=client.name if client else None,
    )


def matter_detail_out(db: Session, matter: Matter, client: Client) -> MatterDetailOut:
    steps = db.scalars(
        select(MatterStep)
        .where(MatterStep.matter_id == matter.id)
        .order_by(
            MatterStep.step_key,
        )
    ).all()
    order_map = {k: i for i, k in enumerate(MATTER_STEP_ORDER)}
    steps_sorted = sorted(steps, key=lambda s: order_map.get(s.step_key, 99))
    return MatterDetailOut(
        **matter_to_out(matter, client).model_dump(),
        steps=[_step_to_out(s) for s in steps_sorted],
        phases=MATTER_PHASES,
    )


async def generate_step(db: Session, matter: Matter, client: Client, step_key: str) -> MatterStep:
    if step_key not in MATTER_STEPS:
        raise ValueError(f"Unknown step: {step_key}")

    step = db.scalar(
        select(MatterStep).where(
            MatterStep.matter_id == matter.id,
            MatterStep.step_key == step_key,
        )
    )
    if not step:
        step_def = MATTER_STEPS[step_key]
        step = MatterStep(
            matter_id=matter.id,
            step_key=step_key,
            status=MatterStepStatus.in_progress.value,
            assigned_role=step_def["assigned_role"],
            content={},
        )
        db.add(step)
        db.flush()

    all_steps = db.scalars(select(MatterStep).where(MatterStep.matter_id == matter.id)).all()
    prior: dict[str, dict] = {}
    for s in all_steps:
        if s.step_key != step_key and s.content:
            prior[s.step_key] = s.content

    query = f"{matter.title} {matter.matter_type} {client.name} {step_key}"
    rag_rows = await search_chunks_async(db, matter.firm_id, query, limit=5)
    if matter.id:
        matter_rows = [r for r in rag_rows if r[1].matter_id == matter.id]
        if matter_rows:
            rag_rows = matter_rows
    rag_context = "\n".join(
        f"[{doc.filename}] {chunk.content[:400]}" for chunk, doc, _ in rag_rows
    ) or "No indexed documents for this matter yet."

    step.status = MatterStepStatus.in_progress.value
    db.commit()

    content, ai_log = await generate_matter_step_content(
        step_key=step_key,
        matter_title=matter.title,
        matter_type=matter.matter_type,
        client_name=client.name,
        prior_steps=prior,
        rag_context=rag_context,
    )

    step.content = content
    step.ai_log = ai_log
    step.status = MatterStepStatus.completed.value
    step.updated_at = datetime.now(timezone.utc)
    matter.current_step_key = step_key
    db.commit()
    db.refresh(step)
    return step


def advance_current_step(matter: Matter, completed_key: str) -> None:
    try:
        idx = MATTER_STEP_ORDER.index(completed_key)
        if idx + 1 < len(MATTER_STEP_ORDER):
            matter.current_step_key = MATTER_STEP_ORDER[idx + 1]
        else:
            matter.current_step_key = completed_key
    except ValueError:
        pass
