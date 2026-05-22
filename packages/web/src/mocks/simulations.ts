import type { WorkflowRunStep } from "@legisflow/shared";
import { WORKFLOW_STEP_NAMES, mockId, nowIso } from "@/mocks/fixtures";
import { getStore, persistStore } from "@/mocks/store";

export function simulateDocumentReady(docId: string, delayMs = 2000) {
  setTimeout(() => {
    const store = getStore();
    const doc = store.documents.find((d) => d.id === docId);
    if (!doc || doc.status === "ready") return;
    doc.status = "ready";
    doc.chunk_count = Math.floor(Math.random() * 30) + 5;
    persistStore();
  }, delayMs);
}

export function simulateWorkflowRun(runId: string) {
  const store = getStore();
  const run = store.workflowRuns.find((r) => r.id === runId);
  if (!run) return;

  const template = store.workflowTemplates.find((t) => t.id === run.workflow_id);
  const stepNames = template
    ? WORKFLOW_STEP_NAMES[template.slug] ?? ["Execute automation"]
    : ["Execute automation"];

  run.status = "running";
  run.steps = [];
  persistStore();

  let order = 0;
  const tick = () => {
    const s = getStore();
    const r = s.workflowRuns.find((x) => x.id === runId);
    if (!r) return;

    if (order < stepNames.length) {
      const name = stepNames[order];
      const step: WorkflowRunStep = {
        id: mockId("wrs"),
        step_order: order + 1,
        name,
        status: "running",
        log: null,
      };
      r.steps = [...(r.steps ?? []), step];
      persistStore();

      setTimeout(() => {
        const s2 = getStore();
        const r2 = s2.workflowRuns.find((x) => x.id === runId);
        if (!r2?.steps) return;
        const st = r2.steps.find((x) => x.step_order === order + 1);
        if (st) {
          st.status = "completed";
          st.log = `${name}: [Mock] Completed with sample output for demo.`;
        }
        order += 1;
        if (order < stepNames.length) {
          tick();
        } else {
          r2.status = "completed";
          r2.output_summary = (r2.steps ?? [])
            .map((x) => `${x.name}: ${(x.log ?? "").slice(0, 80)}`)
            .join("\n");
          r2.completed_at = nowIso();
          persistStore();
        }
      }, 2500);
    }
  };

  setTimeout(tick, 500);
}

export function assistantReplyText(query: string): string {
  return (
    `[Mock assistant] Regarding "${query.slice(0, 80)}${query.length > 80 ? "…" : ""}": ` +
    "Based on your firm's indexed documents, the Riverside CFO matter is at revision & negotiation. " +
    "Key open items include non-compete duration (9 vs 12 months) and pro-rata bonus wording. " +
    "This response is simulated for frontend-only demo mode."
  );
}

export function assistantCitations(): NonNullable<import("@legisflow/shared").ChatMessage["citations"]> {
  const store = getStore();
  const doc = store.documents.find((d) => d.status === "ready");
  if (!doc) return [];
  return [
    {
      document_id: doc.id,
      filename: doc.filename,
      excerpt: "Relevant excerpt from indexed document (mock).",
    },
  ];
}
