from sqlalchemy import select

from app.models import Client, Firm, Matter, MatterStep, MatterStepStatus, User
from app.matter_workflow import MATTER_STEP_ORDER, MATTER_STEPS
from app.services.demo_seed_content import DEMO_STEP_CONTENT
from app.services.matter_steps import create_matter_steps


def seed_demo_client_matter(db) -> tuple[str | None, str | None]:
    """Returns (client_id, matter_id) if seeded or existing."""
    user = db.scalar(select(User).where(User.email == "demo@legisflow.com"))
    if not user:
        return None, None
    from app.models import FirmMembership

    membership = db.scalar(
        select(FirmMembership).where(FirmMembership.user_id == user.id)
    )
    if not membership:
        return None, None
    firm = db.get(Firm, membership.firm_id)
    if not firm:
        return None, None

    client = db.scalar(
        select(Client).where(
            Client.firm_id == firm.id,
            Client.company == "Riverside Manufacturing Ltd.",
        )
    )
    if not client:
        client = Client(
            firm_id=firm.id,
            name="Riverside Manufacturing",
            company="Riverside Manufacturing Ltd.",
            email="legal@riverside-mfg.example",
            phone="+44 20 7946 0958",
            notes="Manufacturing sector client — corporate and employment work.",
            status="active",
        )
        db.add(client)
        db.flush()

    matter = db.scalar(
        select(Matter).where(
            Matter.client_id == client.id,
            Matter.title == "Senior Employment Agreement — CFO",
        )
    )
    if not matter:
        matter = Matter(
            firm_id=firm.id,
            client_id=client.id,
            title="Senior Employment Agreement — CFO",
            matter_type="employment_contract",
            status="active",
            current_step_key="revision_negotiation",
            summary="Executive employment contract for incoming CFO with restrictive covenants and KPI bonus.",
        )
        db.add(matter)
        db.flush()
        create_matter_steps(db, matter)

    for key in MATTER_STEP_ORDER:
        step = db.scalar(
            select(MatterStep).where(
                MatterStep.matter_id == matter.id,
                MatterStep.step_key == key,
            )
        )
        if not step:
            continue
        if key in DEMO_STEP_CONTENT:
            step.content = DEMO_STEP_CONTENT[key]
        if key == "revision_negotiation":
            step.status = MatterStepStatus.in_progress.value
        elif key in DEMO_STEP_CONTENT:
            step.status = MatterStepStatus.completed.value
        else:
            step.status = MatterStepStatus.pending.value
        step.assigned_role = MATTER_STEPS[key]["assigned_role"]

    db.commit()
    return client.id, matter.id
