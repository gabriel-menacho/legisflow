from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.agents.workflow_agent import run_workflow_step
from app.models import WorkflowRun, WorkflowRunStatus, WorkflowRunStep, WorkflowTemplate
from app.rag.ingest import search_chunks_async


WORKFLOW_STEPS: dict[str, list[str]] = {
    "client-intake-automation": ["Validate intake", "Structure client data", "Route to CMS"],
    "contract-drafting-pipeline": ["Parse requirements", "Generate draft outline", "Quality check"],
    "case-summarization": ["Ingest matter context", "Summarize discovery", "Build timeline"],
}


async def execute_workflow_run(db: Session, run: WorkflowRun, template: WorkflowTemplate) -> None:
    run.status = WorkflowRunStatus.running.value
    db.commit()

    steps = WORKFLOW_STEPS.get(template.slug, ["Execute automation"])
    context_rows = await search_chunks_async(
        db, run.firm_id, str(run.input_payload.get("query", "case summary")), limit=3
    )
    context = "\n".join(c[0].content[:400] for c in context_rows) or "No indexed documents."

    logs: list[str] = []
    try:
        for order, step_name in enumerate(steps, start=1):
            step = WorkflowRunStep(
                run_id=run.id,
                step_order=order,
                name=step_name,
                status=WorkflowRunStatus.running.value,
            )
            db.add(step)
            db.commit()

            output = await run_workflow_step(
                template.name, step_name, run.input_payload, context
            )
            step.status = WorkflowRunStatus.completed.value
            step.log = output[:2000]
            db.commit()
            logs.append(f"{step_name}: {output[:200]}")

        run.status = WorkflowRunStatus.completed.value
        run.output_summary = "\n".join(logs)
        run.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as e:
        run.status = WorkflowRunStatus.failed.value
        run.output_summary = str(e)[:500]
        run.completed_at = datetime.now(timezone.utc)
        db.commit()
        raise


def seed_workflow_templates(db: Session) -> None:
    templates = [
        ("client-intake-automation", "Client Intake Automation", "Zero-touch intake pipelines mapping to your CMS."),
        ("contract-drafting-pipeline", "Contract Drafting Pipeline", "Parametric template injection via LLMs."),
        ("case-summarization", "Case Summarization", "Discovery ingest, timelines, and entity mapping."),
    ]
    for slug, name, desc in templates:
        existing = db.scalar(select(WorkflowTemplate).where(WorkflowTemplate.slug == slug))
        if not existing:
            db.add(WorkflowTemplate(slug=slug, name=name, description=desc))
    db.commit()
