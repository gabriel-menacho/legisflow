"use client";

import type { DocumentSummary, MatterStep, MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { StepEditPanel } from "@/components/matter/step-edit-panels";
import { useMatterLabels } from "@/hooks/use-matter-labels";

function useMatterPanelLabels() {
  const { stepLabel, roleLabel, stepStatusLabel } = useMatterLabels();
  const t = useTranslations("matter");
  const tp = useTranslations("matter.panels");
  return { stepLabel, roleLabel, stepStatusLabel, t, tp };
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function arr<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? v : [];
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function StepPanel({
  step,
  documents,
  editing,
  draftContent,
  onDraftChange,
}: {
  step: MatterStep;
  documents?: DocumentSummary[];
  editing?: boolean;
  draftContent?: Record<string, unknown>;
  onDraftChange?: (content: Record<string, unknown>) => void;
}) {
  const c = editing && draftContent !== undefined ? draftContent : step.content || {};
  const { stepLabel, roleLabel, stepStatusLabel, t } = useMatterPanelLabels();
  const label = stepLabel(step.step_key);

  return (
    <div>
      <div className="matter-card mb-4">
        <div className="matter-card-header flex flex-wrap items-center justify-between gap-2">
          <span>{label}</span>
          <span className="matter-pill matter-pill-accent">{roleLabel(step.assigned_role)}</span>
        </div>
        <div className="p-4 text-sm text-[var(--matter-muted)]">
          {t("status")}: <strong className="text-[var(--matter-text)]">{stepStatusLabel(step.status)}</strong>
          {editing && <p className="mt-1 text-xs text-[var(--matter-accent)]">{t("editingHint")}</p>}
          {step.ai_log && !editing && (
            <p className="mt-2 line-clamp-2 text-xs">{t("lastAiRun")}</p>
          )}
        </div>
      </div>
      {editing && onDraftChange ? (
        <StepEditPanel stepKey={step.step_key} content={c} onChange={onDraftChange} documents={documents} />
      ) : (
        <StepContent stepKey={step.step_key} content={c} documents={documents} />
      )}
    </div>
  );
}

function StepContent({
  stepKey,
  content,
  documents,
}: {
  stepKey: MatterStepKey;
  content: Record<string, unknown>;
  documents?: DocumentSummary[];
  editing?: boolean;
}) {
  const t = useTranslations("matter.panels");
  switch (stepKey) {
    case "client_intake":
      return <IntakePanel content={content} />;
    case "document_collection":
    case "evidence_collection":
      return <CollectionPanel content={content} documents={documents} stepKey={stepKey} />;
    case "legal_research":
      return <ResearchPanel content={content} />;
    case "strategy_structure":
      return <StrategyPanel content={content} />;
    case "draft_creation":
      return <DraftPanel content={content} />;
    case "internal_review":
      return <InternalReviewPanel content={content} />;
    case "client_review":
      return <CommentsPanel content={content} title={t("clientFeedback")} />;
    case "revision_negotiation":
      return <RevisionPanel content={content} />;
    case "final_approval":
      return <ApprovalPanel content={content} />;
    case "execution_filing":
      return <ExecutionPanel content={content} />;
    case "storage_monitoring":
      return <StoragePanel content={content} />;
    default:
      return <p className="text-[var(--matter-muted)]">{t("noPanel")}</p>;
  }
}

function IntakePanel({ content }: { content: Record<string, unknown> }) {
  const tp = useTranslations("matter.panels");
  const fields = obj(content.fields);
  const notes = arr<string>(content.notes);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="matter-card">
        <div className="matter-card-header">{tp("clientData")}</div>
        <dl className="grid grid-cols-2 gap-3 p-4 text-sm">
          {Object.entries(fields).map(([k, v]) => (
            <div key={k}>
              <dt className="text-[var(--matter-muted)]">{k}</dt>
              <dd className="font-medium">{str(v)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="matter-card">
        <div className="matter-card-header">{tp("documentsNeeded")}</div>
        <ul className="list-disc space-y-1 p-4 pl-8 text-sm">
          {arr<string>(content.documentsNeeded).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="matter-card lg:col-span-2">
        <div className="matter-card-header">{tp("problemObjectives")}</div>
        <div className="space-y-3 p-4 text-sm">
          <p>{str(content.problemStatement)}</p>
          <div>
            <p className="mb-1 font-semibold text-[var(--matter-muted)]">{tp("goals")}</p>
            <ul className="list-disc pl-5">
              {arr<string>(content.goals).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-[var(--matter-muted)]">{tp("risks")}</p>
            <div className="flex flex-wrap gap-2">
              {arr<string>(content.risks).map((r, i) => (
                <span key={i} className="rounded bg-[#fde8e8] px-2 py-1 text-xs text-[#9b2c2c]">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {notes.length > 0 && (
        <div className="matter-card lg:col-span-2">
          <div className="matter-card-header">{tp("additionalNotes")}</div>
          <div className="flex flex-wrap gap-2 p-4">
            {notes.map((n, i) => (
              <span key={i} className="matter-pill">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CollectionPanel({
  content,
  documents,
  stepKey,
}: {
  content: Record<string, unknown>;
  documents?: DocumentSummary[];
  stepKey: MatterStepKey;
}) {
  const tp = useTranslations("matter.panels");
  const tm = useTranslations("matter");
  const files = arr<Record<string, unknown>>(content.files);
  const checklist = arr<{ item?: string; done?: boolean }>(content.checklist);
  const flags = arr<{ type?: string; severity?: string; message?: string }>(content.flags);
  return (
    <div className="space-y-4">
      <div className="matter-card">
        <div className="matter-card-header">
          {stepKey === "evidence_collection" ? tp("evidenceFiles") : tp("collectedDocuments")}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--matter-border)] text-left text-[var(--matter-muted)]">
              <th className="p-3">{tp("file")}</th>
              <th className="p-3">{tm("status")}</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => (
              <tr key={i} className="border-b border-[var(--matter-border)]">
                <td className="p-3">{str(f.name)}</td>
                <td className="p-3">
                  <span className="matter-pill">{str(f.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents && documents.length > 0 && (
          <div className="border-t border-[var(--matter-border)] p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-[var(--matter-muted)]">{tp("uploadedToMatter")}</p>
            <ul className="space-y-1 text-sm">
              {documents.map((d) => (
                <li key={d.id}>
                  {d.filename}{" "}
                  <span className="text-[var(--matter-muted)]">({d.folder ?? "general"}) — {d.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="matter-card">
        <div className="matter-card-header">{tp("checklist")}</div>
        <ul className="p-4">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-center gap-2 py-1 text-sm">
              <span className={item.done ? "text-[var(--matter-success)]" : "text-[var(--matter-muted)]"} aria-hidden>
                {item.done ? "☑" : "☐"}
              </span>
              {str(item.item)}
            </li>
          ))}
        </ul>
      </div>
      {flags.length > 0 && (
        <div className="matter-card">
          <div className="matter-card-header">{tp("verificationFlags")}</div>
          <div className="space-y-2 p-4">
            {flags.map((f, i) => (
              <div
                key={i}
                className={`rounded border p-3 text-sm ${
                  f.severity === "high"
                    ? "border-[#f5c6c6] bg-[#fff5f5]"
                    : f.severity === "medium"
                      ? "border-[#fde68a] bg-[#fffbeb]"
                      : "border-[var(--matter-border)]"
                }`}
              >
                <span className="matter-pill mr-2">{str(f.type)}</span>
                {str(f.message)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchPanel({ content }: { content: Record<string, unknown> }) {
  const citations = arr<{ title?: string; source?: string; excerpt?: string }>(content.citations);
  return (
    <div className="space-y-4">
      <div className="matter-card border-l-4 border-l-[var(--matter-accent)]">
        <div className="matter-card-header">Legal research AI — Summary</div>
        <p className="p-4 text-sm leading-relaxed">{str(content.summary)}</p>
        {str(content.jurisdictionNotes) ? (
          <p className="border-t border-[var(--matter-border)] px-4 pb-4 text-sm text-[var(--matter-muted)]">
            <strong>Jurisdiction:</strong> {str(content.jurisdictionNotes)}
          </p>
        ) : null}
      </div>
      <div className="space-y-3">
        {citations.map((cit, i) => (
          <div key={i} className="matter-suggestion-card">
            <p className="font-semibold">{str(cit.title)}</p>
            <p className="text-xs text-[var(--matter-muted)]">{str(cit.source)}</p>
            <p className="mt-2 text-sm italic text-[var(--matter-muted)]">{str(cit.excerpt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrategyPanel({ content }: { content: Record<string, unknown> }) {
  const suggestions = arr<{ category?: string; title?: string; body?: string; rationale?: string }>(
    content.suggestions,
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {suggestions.map((s, i) => (
        <div key={i} className="matter-suggestion-card">
          <span className="matter-pill matter-pill-accent mb-2">{str(s.category)}</span>
          <h3 className="mb-2 text-lg font-semibold">{str(s.title)}</h3>
          <p className="mb-2 text-sm">{str(s.body)}</p>
          <p className="text-xs text-[var(--matter-muted)]">{str(s.rationale)}</p>
        </div>
      ))}
    </div>
  );
}

function DraftPanel({ content }: { content: Record<string, unknown> }) {
  const sections = arr<{ heading?: string; body?: string }>(content.sections);
  return (
    <div className="matter-card">
      <div className="matter-card-header flex justify-between">
        <span>AI-assisted draft</span>
        <span className="matter-pill">{str(content.version) || "v1"}</span>
      </div>
      <div className="space-y-6 p-6 font-serif text-[15px] leading-relaxed">
        {sections.map((sec, i) => (
          <section key={i}>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-[var(--matter-muted)]">
              {str(sec.heading)}
            </h3>
            <p className="whitespace-pre-wrap">{str(sec.body)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function InternalReviewPanel({ content }: { content: Record<string, unknown> }) {
  const checks = arr<{ rule?: string; pass?: boolean; detail?: string }>(content.complianceChecks);
  const comparisons = arr<{ left?: string; right?: string; diffSummary?: string }>(content.comparisons);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="matter-card">
        <div className="matter-card-header">Automated compliance checks</div>
        <ul className="divide-y divide-[var(--matter-border)]">
          {checks.map((c, i) => (
            <li key={i} className="flex items-start gap-3 p-4 text-sm">
              <span className={c.pass ? "text-[var(--matter-success)]" : "text-[var(--matter-warn)]"}>
                {c.pass ? "✓" : "!"}
              </span>
              <div>
                <p className="font-medium">{str(c.rule)}</p>
                <p className="text-[var(--matter-muted)]">{str(c.detail)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="matter-card">
        <div className="matter-card-header">Document comparison</div>
        {comparisons.map((cmp, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 border-b border-[var(--matter-border)] p-4 text-sm last:border-0">
            <div className="rounded bg-[#f8f9f6] p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--matter-muted)]">{str(cmp.left)}</p>
            </div>
            <div className="rounded bg-[#f8f9f6] p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--matter-muted)]">{str(cmp.right)}</p>
            </div>
            <p className="col-span-2 text-[var(--matter-muted)]">{str(cmp.diffSummary)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsPanel({ content, title }: { content: Record<string, unknown>; title: string }) {
  const comments = arr<{ author?: string; section?: string; text?: string; resolved?: boolean }>(
    content.comments,
  );
  return (
    <div className="matter-card">
      <div className="matter-card-header">{title}</div>
      <ul className="divide-y divide-[var(--matter-border)]">
        {comments.map((c, i) => (
          <li key={i} className={`p-4 text-sm ${c.resolved ? "opacity-60" : ""}`}>
            <p className="font-medium">
              {str(c.author)} — {str(c.section)}
              {c.resolved && <span className="ml-2 matter-pill">Resolved</span>}
            </p>
            <p className="mt-1">{str(c.text)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RevisionPanel({ content }: { content: Record<string, unknown> }) {
  const versions = arr<{ label?: string; date?: string; summary?: string }>(content.versions);
  return (
    <div className="space-y-4">
      <div className="matter-card">
        <div className="matter-card-header">Version history</div>
        <ul className="p-4">
          {versions.map((v, i) => (
            <li key={i} className="mb-3 border-l-2 border-[var(--matter-accent)] pl-3 text-sm">
              <strong>{str(v.label)}</strong> — {str(v.date)}
              <p className="text-[var(--matter-muted)]">{str(v.summary)}</p>
            </li>
          ))}
        </ul>
      </div>
      <CommentsPanel content={content} title="Negotiation comments" />
    </div>
  );
}

function ApprovalPanel({ content }: { content: Record<string, unknown> }) {
  const checklist = arr<{ item?: string; done?: boolean }>(content.checklist);
  return (
    <div className="matter-card">
      <div className="matter-card-header">Partner approval</div>
      <p className="border-b border-[var(--matter-border)] px-4 py-2 text-sm">
        Approver: <strong>{str(content.approver) || "Pending"}</strong>
      </p>
      <ul className="p-4">
        {checklist.map((item, i) => (
          <li key={i} className="flex gap-2 py-1 text-sm">
            <span>{item.done ? "☑" : "☐"}</span>
            {str(item.item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExecutionPanel({ content }: { content: Record<string, unknown> }) {
  const signers = arr<{ name?: string; role?: string; status?: string }>(content.signers);
  return (
    <div className="matter-card">
      <div className="matter-card-header">E-signature — {str(content.provider) || "DocuSign (mock)"}</div>
      <p className="px-4 py-2 text-sm text-[var(--matter-muted)]">
        Envelope: {str(content.envelopeId)} · {str(content.filingStatus)}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-[var(--matter-border)] text-left text-[var(--matter-muted)]">
            <th className="p-3">Signer</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {signers.map((s, i) => (
            <tr key={i} className="border-t border-[var(--matter-border)]">
              <td className="p-3">{str(s.name)}</td>
              <td className="p-3">{str(s.role)}</td>
              <td className="p-3">
                <span className={`matter-pill ${s.status === "signed" ? "matter-pill-accent" : ""}`}>
                  {str(s.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StoragePanel({ content }: { content: Record<string, unknown> }) {
  const deadlines = arr<{ label?: string; date?: string; type?: string }>(content.deadlines);
  const obligations = arr<string>(content.obligations);
  const reminders = arr<string>(content.renewalReminders);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="matter-card lg:col-span-2">
        <div className="matter-card-header">Deadlines & monitoring</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--matter-muted)]">
              <th className="p-3">Label</th>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((d, i) => (
              <tr key={i} className="border-t border-[var(--matter-border)]">
                <td className="p-3">{str(d.label)}</td>
                <td className="p-3 font-medium">{str(d.date)}</td>
                <td className="p-3">
                  <span className="matter-pill">{str(d.type)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="matter-card">
        <div className="matter-card-header">Compliance obligations</div>
        <ul className="list-disc space-y-1 p-4 pl-8 text-sm">
          {obligations.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </div>
      <div className="matter-card">
        <div className="matter-card-header">Renewal reminders</div>
        <ul className="p-4 text-sm">
          {reminders.map((r, i) => (
            <li key={i} className="py-1">
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
