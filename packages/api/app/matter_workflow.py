"""Ultra-Simplified legal document workflow step definitions."""

from typing import TypedDict


class StepDef(TypedDict):
    key: str
    label: str
    assigned_role: str
    phase: str


MATTER_STEP_ORDER: list[str] = [
    "client_intake",
    "document_collection",
    "evidence_collection",
    "legal_research",
    "strategy_structure",
    "draft_creation",
    "internal_review",
    "client_review",
    "revision_negotiation",
    "final_approval",
    "execution_filing",
    "storage_monitoring",
]

MATTER_STEPS: dict[str, StepDef] = {
    "client_intake": {
        "key": "client_intake",
        "label": "Client Intake",
        "assigned_role": "senior_lawyer",
        "phase": "intake",
    },
    "document_collection": {
        "key": "document_collection",
        "label": "Document Collection",
        "assigned_role": "paralegal",
        "phase": "intake",
    },
    "evidence_collection": {
        "key": "evidence_collection",
        "label": "Evidence Collection",
        "assigned_role": "paralegal",
        "phase": "intake",
    },
    "legal_research": {
        "key": "legal_research",
        "label": "Legal Research",
        "assigned_role": "junior_lawyer",
        "phase": "research_plan",
    },
    "strategy_structure": {
        "key": "strategy_structure",
        "label": "Strategy & Structure",
        "assigned_role": "senior_lawyer",
        "phase": "research_plan",
    },
    "draft_creation": {
        "key": "draft_creation",
        "label": "Draft Creation",
        "assigned_role": "junior_lawyer",
        "phase": "draft",
    },
    "internal_review": {
        "key": "internal_review",
        "label": "Internal Review / QC",
        "assigned_role": "compliance",
        "phase": "review",
    },
    "client_review": {
        "key": "client_review",
        "label": "Client Review",
        "assigned_role": "client_stakeholder",
        "phase": "review",
    },
    "revision_negotiation": {
        "key": "revision_negotiation",
        "label": "Revision & Negotiation",
        "assigned_role": "senior_lawyer",
        "phase": "review",
    },
    "final_approval": {
        "key": "final_approval",
        "label": "Final Legal Approval",
        "assigned_role": "senior_lawyer",
        "phase": "close",
    },
    "execution_filing": {
        "key": "execution_filing",
        "label": "Execution / Filing",
        "assigned_role": "paralegal",
        "phase": "close",
    },
    "storage_monitoring": {
        "key": "storage_monitoring",
        "label": "Storage & Monitoring",
        "assigned_role": "paralegal",
        "phase": "close",
    },
}

MATTER_PHASES: list[dict[str, str | list[str]]] = [
    {"key": "intake", "label": "Intake", "steps": ["client_intake", "document_collection", "evidence_collection"]},
    {"key": "research_plan", "label": "Research & Plan", "steps": ["legal_research", "strategy_structure"]},
    {"key": "draft", "label": "Draft", "steps": ["draft_creation"]},
    {"key": "review", "label": "Review", "steps": ["internal_review", "client_review", "revision_negotiation"]},
    {"key": "close", "label": "Close", "steps": ["final_approval", "execution_filing", "storage_monitoring"]},
]

ROLE_LABELS: dict[str, str] = {
    "client": "Client",
    "junior_lawyer": "Junior Lawyer",
    "senior_lawyer": "Senior Lawyer",
    "paralegal": "Paralegal",
    "compliance": "Compliance Team",
    "client_stakeholder": "Client Stakeholders",
}
