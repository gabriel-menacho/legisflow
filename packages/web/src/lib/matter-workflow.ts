import type { MatterPhase, MatterStepKey } from "@legisflow/shared";

export const MATTER_STEP_ORDER: MatterStepKey[] = [
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
];

/** @deprecated Use useTranslations('matter.steps') instead */
export const STEP_LABELS: Record<MatterStepKey, string> = {
  client_intake: "Client Intake",
  document_collection: "Document Collection",
  evidence_collection: "Evidence Collection",
  legal_research: "Legal Research",
  strategy_structure: "Strategy & Structure",
  draft_creation: "Draft Creation",
  internal_review: "Internal Review / QC",
  client_review: "Client Review",
  revision_negotiation: "Revision & Negotiation",
  final_approval: "Final Legal Approval",
  execution_filing: "Execution / Filing",
  storage_monitoring: "Storage & Monitoring",
};

export const MATTER_PHASES: MatterPhase[] = [
  { key: "intake", label: "Intake", steps: ["client_intake", "document_collection", "evidence_collection"] },
  { key: "research_plan", label: "Research & Plan", steps: ["legal_research", "strategy_structure"] },
  { key: "draft", label: "Draft", steps: ["draft_creation"] },
  { key: "review", label: "Review", steps: ["internal_review", "client_review", "revision_negotiation"] },
  { key: "close", label: "Close", steps: ["final_approval", "execution_filing", "storage_monitoring"] },
];

export function stepIndex(key: MatterStepKey): number {
  return MATTER_STEP_ORDER.indexOf(key);
}

export function isStepUnlocked(
  stepKey: MatterStepKey,
  steps: { step_key: MatterStepKey; status: string; content: Record<string, unknown> }[],
): boolean {
  const idx = stepIndex(stepKey);
  if (idx <= 0) return true;
  const prev = MATTER_STEP_ORDER[idx - 1];
  const prevStep = steps.find((s) => s.step_key === prev);
  return Boolean(
    prevStep &&
      (prevStep.status === "completed" ||
        Object.keys(prevStep.content || {}).length > 0),
  );
}

export function uploadFolderForStep(stepKey: MatterStepKey): "intake" | "evidence" | "general" {
  if (stepKey === "document_collection") return "intake";
  if (stepKey === "evidence_collection") return "evidence";
  return "general";
}

export function prevStepKey(key: MatterStepKey): MatterStepKey | null {
  const idx = stepIndex(key);
  return idx > 0 ? MATTER_STEP_ORDER[idx - 1] : null;
}

export function nextStepKey(key: MatterStepKey): MatterStepKey | null {
  const idx = stepIndex(key);
  return idx < MATTER_STEP_ORDER.length - 1 ? MATTER_STEP_ORDER[idx + 1] : null;
}

export function stepPosition(key: MatterStepKey): { current: number; total: number } {
  const idx = stepIndex(key);
  return { current: idx + 1, total: MATTER_STEP_ORDER.length };
}
