import type { MatterStepKey } from "@legisflow/shared";

export const DEMO_USER_ID = "demo-user-001";
export const DEMO_FIRM_ID = "demo-firm-001";
export const DEMO_CLIENT_ID = "demo-client-riverside";
export const DEMO_MATTER_ID = "demo-matter-cfo";

export const WORKFLOW_IDS = {
  clientIntake: "wf-client-intake-automation",
  contractDrafting: "wf-contract-drafting-pipeline",
  caseSummarization: "wf-case-summarization",
} as const;

export const DEMO_EMAIL = "demo@legisflow.com";
export const DEMO_PASSWORD = "Demo123!";

export const MATTER_STEP_DEFS: Record<
  MatterStepKey,
  { label: string; assigned_role: string }
> = {
  client_intake: { label: "Client Intake", assigned_role: "senior_lawyer" },
  document_collection: { label: "Document Collection", assigned_role: "paralegal" },
  evidence_collection: { label: "Evidence Collection", assigned_role: "paralegal" },
  legal_research: { label: "Legal Research", assigned_role: "junior_lawyer" },
  strategy_structure: { label: "Strategy & Structure", assigned_role: "senior_lawyer" },
  draft_creation: { label: "Draft Creation", assigned_role: "junior_lawyer" },
  internal_review: { label: "Internal Review / QC", assigned_role: "compliance" },
  client_review: { label: "Client Review", assigned_role: "client_stakeholder" },
  revision_negotiation: { label: "Revision & Negotiation", assigned_role: "senior_lawyer" },
  final_approval: { label: "Final Legal Approval", assigned_role: "senior_lawyer" },
  execution_filing: { label: "Execution / Filing", assigned_role: "paralegal" },
  storage_monitoring: { label: "Storage & Monitoring", assigned_role: "paralegal" },
};

export const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  junior_lawyer: "Junior Lawyer",
  senior_lawyer: "Senior Lawyer",
  paralegal: "Paralegal",
  compliance: "Compliance Team",
  client_stakeholder: "Client Stakeholders",
};

export const WORKFLOW_STEP_NAMES: Record<string, string[]> = {
  "client-intake-automation": [
    "Validate intake",
    "Structure client data",
    "Route to CMS",
  ],
  "contract-drafting-pipeline": [
    "Parse requirements",
    "Generate draft outline",
    "Quality check",
  ],
  "case-summarization": [
    "Ingest matter context",
    "Summarize discovery",
    "Build timeline",
  ],
};

export function nowIso() {
  return new Date().toISOString();
}

export function mockId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
