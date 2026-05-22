"""Seed demo user and firm."""

from sqlalchemy import select

from app.auth import hash_password
from app.database import SessionLocal
from app.models import Firm, FirmMembership, User, UserRole
from app.services.demo_seed import seed_demo_client_matter
from app.services.workflows import seed_workflow_templates


def main() -> None:
    db = SessionLocal()
    try:
        seed_workflow_templates(db)
        email = "demo@legisflow.com"
        user = db.scalar(select(User).where(User.email == email))
        if not user:
            user = User(
                email=email,
                hashed_password=hash_password("Demo123!"),
                full_name="Demo Attorney",
            )
            db.add(user)
            db.flush()
            firm = Firm(
                name="LegisFlow Demo Firm",
                size="11-50",
                practice_areas=["Litigation", "Corporate"],
                integrations=["Clio", "n8n"],
                onboarding_complete=True,
            )
            db.add(firm)
            db.flush()
            db.add(FirmMembership(user_id=user.id, firm_id=firm.id, role=UserRole.owner.value))
            db.commit()
            print(f"Created demo user: {email} / Demo123!")
        else:
            print(f"Demo user already exists: {email}")
        cid, mid = seed_demo_client_matter(db)
        if cid and mid:
            print(f"Demo client/matter ready: client={cid[:8]}… matter={mid[:8]}…")
    finally:
        db.close()


if __name__ == "__main__":
    main()
