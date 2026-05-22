"use client";

import type { DocumentSummary, MatterStepKey } from "@legisflow/shared";
import {
  ChecklistEditor,
  KeyValueEditor,
  MatterField,
  MatterSelect,
  MatterTextarea,
  patchContent,
  StringListEditor,
} from "@/components/matter/editors";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function arr<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? v : [];
}

function obj(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    out[k] = str(val);
  }
  return out;
}

type EditProps = {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  documents?: DocumentSummary[];
  stepKey?: MatterStepKey;
};

export function StepEditPanel({ stepKey, content, onChange, documents }: EditProps & { stepKey: MatterStepKey }) {
  switch (stepKey) {
    case "client_intake":
      return <IntakeEdit content={content} onChange={onChange} />;
    case "document_collection":
    case "evidence_collection":
      return <CollectionEdit content={content} onChange={onChange} documents={documents} stepKey={stepKey} />;
    case "legal_research":
      return <ResearchEdit content={content} onChange={onChange} />;
    case "strategy_structure":
      return <StrategyEdit content={content} onChange={onChange} />;
    case "draft_creation":
      return <DraftEdit content={content} onChange={onChange} />;
    case "internal_review":
      return <InternalReviewEdit content={content} onChange={onChange} />;
    case "client_review":
      return <CommentsEdit content={content} onChange={onChange} title="Client feedback" />;
    case "revision_negotiation":
      return <RevisionEdit content={content} onChange={onChange} />;
    case "final_approval":
      return <ApprovalEdit content={content} onChange={onChange} />;
    case "execution_filing":
      return <ExecutionEdit content={content} onChange={onChange} />;
    case "storage_monitoring":
      return <StorageEdit content={content} onChange={onChange} />;
    default:
      return null;
  }
}

function IntakeEdit({ content, onChange }: EditProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="matter-card p-4 lg:col-span-2">
        <KeyValueEditor
          label="Client data"
          fields={obj(content.fields)}
          onChange={(fields) => onChange(patchContent(content, { fields }))}
        />
      </div>
      <div className="matter-card p-4">
        <StringListEditor
          label="Documents needed"
          items={arr<string>(content.documentsNeeded)}
          onChange={(documentsNeeded) => onChange(patchContent(content, { documentsNeeded }))}
        />
      </div>
      <div className="matter-card p-4 lg:col-span-2">
        <MatterTextarea
          label="Problem statement"
          value={str(content.problemStatement)}
          onChange={(problemStatement) => onChange(patchContent(content, { problemStatement }))}
          rows={3}
        />
      </div>
      <div className="matter-card p-4">
        <StringListEditor
          label="Goals"
          items={arr<string>(content.goals)}
          onChange={(goals) => onChange(patchContent(content, { goals }))}
        />
      </div>
      <div className="matter-card p-4">
        <StringListEditor
          label="Risks"
          items={arr<string>(content.risks)}
          onChange={(risks) => onChange(patchContent(content, { risks }))}
        />
      </div>
      <div className="matter-card p-4 lg:col-span-2">
        <StringListEditor
          label="Additional notes"
          items={arr<string>(content.notes)}
          onChange={(notes) => onChange(patchContent(content, { notes }))}
        />
      </div>
    </div>
  );
}

function CollectionEdit({ content, onChange, documents, stepKey }: EditProps & { stepKey: MatterStepKey }) {
  const files = arr<{ name?: string; status?: string }>(content.files);
  const fileRows = files.length ? files : [{ name: "", status: "pending" }];
  const flags = arr<{ type?: string; severity?: string; message?: string }>(content.flags);
  const flagRows = flags.length ? flags : [{ type: "gap", severity: "low", message: "" }];

  const setFiles = (next: { name: string; status: string; folder?: string }[]) =>
    onChange(patchContent(content, { files: next }));

  const setFlags = (next: { type: string; severity: string; message: string }[]) =>
    onChange(patchContent(content, { flags: next }));

  return (
    <div className="space-y-4">
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm text-[var(--matter-muted)]">File register</span>
        <div className="space-y-2">
          {fileRows.map((f, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input
                className="matter-input"
                placeholder="File name"
                value={str(f.name)}
                onChange={(e) => {
                  const next = fileRows.map((r, j) =>
                    j === i ? { name: e.target.value, status: str(r.status) || "pending" } : { name: str(r.name), status: str(r.status) || "pending" },
                  );
                  setFiles(next);
                }}
              />
              <div className="flex gap-2">
                <select
                  className="matter-input flex-1"
                  value={str(f.status) || "pending"}
                  onChange={(e) => {
                    const next = fileRows.map((r, j) =>
                      j === i ? { name: str(r.name), status: e.target.value } : { name: str(r.name), status: str(r.status) || "pending" },
                    );
                    setFiles(next);
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="received">received</option>
                  <option value="verified">verified</option>
                  <option value="review">review</option>
                </select>
                <button type="button" className="rounded border px-2" onClick={() => setFiles(fileRows.filter((_, j) => j !== i).map((r) => ({ name: str(r.name), status: str(r.status) || "pending" })))}>
                  ×
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setFiles([...fileRows.map((r) => ({ name: str(r.name), status: str(r.status) || "pending" })), { name: "", status: "pending" }])}>
            + Add file row
          </button>
        </div>
      </div>
      {documents && documents.length > 0 && (
        <div className="matter-card p-4">
          <p className="mb-2 text-sm font-medium text-[var(--matter-muted)]">Uploaded to matter (read-only)</p>
          <ul className="text-sm">
            {documents.map((d) => (
              <li key={d.id}>{d.filename} — {d.status}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="matter-card p-4">
        <ChecklistEditor
          label="Checklist"
          items={arr<{ item?: string; done?: boolean }>(content.checklist).map((c) => ({
            item: str(c.item),
            done: Boolean(c.done),
          }))}
          onChange={(checklist) => onChange(patchContent(content, { checklist }))}
        />
      </div>
      {stepKey === "evidence_collection" && (
        <div className="matter-card p-4">
          <span className="mb-2 block text-sm text-[var(--matter-muted)]">Verification flags</span>
          <div className="space-y-3">
            {flagRows.map((f, i) => (
              <div key={i} className="grid gap-2 rounded border border-[var(--matter-border)] p-3">
                <div className="grid grid-cols-2 gap-2">
                  <MatterSelect
                    label="Type"
                    value={str(f.type) || "gap"}
                    onChange={(type) => {
                      const next = flagRows.map((r, j) => (j === i ? { ...r, type } : r));
                      setFlags(next.map((r) => ({ type: str(r.type), severity: str(r.severity), message: str(r.message) })));
                    }}
                    options={[
                      { value: "gap", label: "gap" },
                      { value: "authenticity", label: "authenticity" },
                      { value: "consistency", label: "consistency" },
                    ]}
                  />
                  <MatterSelect
                    label="Severity"
                    value={str(f.severity) || "low"}
                    onChange={(severity) => {
                      const next = flagRows.map((r, j) => (j === i ? { ...r, severity } : r));
                      setFlags(next.map((r) => ({ type: str(r.type), severity: str(r.severity), message: str(r.message) })));
                    }}
                    options={[
                      { value: "low", label: "low" },
                      { value: "medium", label: "medium" },
                      { value: "high", label: "high" },
                    ]}
                  />
                </div>
                <MatterTextarea
                  label="Message"
                  value={str(f.message)}
                  onChange={(message) => {
                    const next = flagRows.map((r, j) => (j === i ? { ...r, message } : r));
                    setFlags(next.map((r) => ({ type: str(r.type), severity: str(r.severity), message: str(r.message) })));
                  }}
                  rows={2}
                />
                <button type="button" className="text-sm text-[var(--matter-muted)] hover:underline" onClick={() => setFlags(flagRows.filter((_, j) => j !== i).map((r) => ({ type: str(r.type), severity: str(r.severity), message: str(r.message) })))}>
                  Remove flag
                </button>
              </div>
            ))}
            <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setFlags([...flagRows.map((r) => ({ type: str(r.type), severity: str(r.severity), message: str(r.message) })), { type: "gap", severity: "low", message: "" }])}>
              + Add flag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchEdit({ content, onChange }: EditProps) {
  const citations = arr<{ title?: string; source?: string; excerpt?: string }>(content.citations);
  const rows = citations.length ? citations : [{ title: "", source: "", excerpt: "" }];

  const setCitations = (next: { title: string; source: string; excerpt: string }[]) =>
    onChange(patchContent(content, { citations: next }));

  return (
    <div className="space-y-4">
      <div className="matter-card p-4">
        <MatterTextarea label="Research summary" value={str(content.summary)} onChange={(summary) => onChange(patchContent(content, { summary }))} rows={4} />
        <div className="mt-4">
          <MatterTextarea label="Jurisdiction notes" value={str(content.jurisdictionNotes)} onChange={(jurisdictionNotes) => onChange(patchContent(content, { jurisdictionNotes }))} rows={2} />
        </div>
      </div>
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm text-[var(--matter-muted)]">Citations</span>
        {rows.map((c, i) => (
          <div key={i} className="mb-4 space-y-2 rounded border border-[var(--matter-border)] p-3">
            <MatterField label="Title" value={str(c.title)} onChange={(title) => setCitations(rows.map((r, j) => (j === i ? { title, source: str(r.source), excerpt: str(r.excerpt) } : { title: str(r.title), source: str(r.source), excerpt: str(r.excerpt) })))} />
            <MatterField label="Source" value={str(c.source)} onChange={(source) => setCitations(rows.map((r, j) => (j === i ? { title: str(r.title), source, excerpt: str(r.excerpt) } : { title: str(r.title), source: str(r.source), excerpt: str(r.excerpt) })))} />
            <MatterTextarea label="Excerpt" value={str(c.excerpt)} onChange={(excerpt) => setCitations(rows.map((r, j) => (j === i ? { title: str(r.title), source: str(r.source), excerpt } : { title: str(r.title), source: str(r.source), excerpt: str(r.excerpt) })))} rows={2} />
            <button type="button" className="text-sm text-[var(--matter-muted)]" onClick={() => setCitations(rows.filter((_, j) => j !== i).map((r) => ({ title: str(r.title), source: str(r.source), excerpt: str(r.excerpt) })))}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setCitations([...rows.map((r) => ({ title: str(r.title), source: str(r.source), excerpt: str(r.excerpt) })), { title: "", source: "", excerpt: "" }])}>+ Add citation</button>
      </div>
    </div>
  );
}

function StrategyEdit({ content, onChange }: EditProps) {
  const suggestions = arr<{ category?: string; title?: string; body?: string; rationale?: string }>(content.suggestions);
  const rows = suggestions.length ? suggestions : [{ category: "clauses", title: "", body: "", rationale: "" }];

  const setSuggestions = (next: { category: string; title: string; body: string; rationale: string }[]) =>
    onChange(patchContent(content, { suggestions: next }));

  return (
    <div className="space-y-4">
      {rows.map((s, i) => (
        <div key={i} className="matter-card space-y-3 p-4">
          <MatterSelect
            label="Category"
            value={str(s.category) || "clauses"}
            onChange={(category) => setSuggestions(rows.map((r, j) => (j === i ? { category, title: str(r.title), body: str(r.body), rationale: str(r.rationale) } : { category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })))}
            options={[
              { value: "protections", label: "protections" },
              { value: "clauses", label: "clauses" },
              { value: "risks", label: "risks" },
              { value: "negotiation", label: "negotiation" },
              { value: "structure", label: "structure" },
            ]}
          />
          <MatterField label="Title" value={str(s.title)} onChange={(title) => setSuggestions(rows.map((r, j) => (j === i ? { category: str(r.category), title, body: str(r.body), rationale: str(r.rationale) } : { category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })))} />
          <MatterTextarea label="Body" value={str(s.body)} onChange={(body) => setSuggestions(rows.map((r, j) => (j === i ? { category: str(r.category), title: str(r.title), body, rationale: str(r.rationale) } : { category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })))} />
          <MatterTextarea label="Rationale" value={str(s.rationale)} onChange={(rationale) => setSuggestions(rows.map((r, j) => (j === i ? { category: str(r.category), title: str(r.title), body: str(r.body), rationale } : { category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })))} rows={2} />
          <button type="button" className="text-sm text-[var(--matter-muted)]" onClick={() => setSuggestions(rows.filter((_, j) => j !== i).map((r) => ({ category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })))}>Remove</button>
        </div>
      ))}
      <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setSuggestions([...rows.map((r) => ({ category: str(r.category), title: str(r.title), body: str(r.body), rationale: str(r.rationale) })), { category: "clauses", title: "", body: "", rationale: "" }])}>+ Add suggestion</button>
    </div>
  );
}

function DraftEdit({ content, onChange }: EditProps) {
  const sections = arr<{ heading?: string; body?: string }>(content.sections);
  const rows = sections.length ? sections : [{ heading: "", body: "" }];

  const setSections = (next: { heading: string; body: string }[]) =>
    onChange(patchContent(content, { sections: next }));

  return (
    <div className="matter-card p-4">
      <MatterField label="Version" value={str(content.version) || "v1"} onChange={(version) => onChange(patchContent(content, { version }))} />
      <div className="mt-4 space-y-4">
        {rows.map((sec, i) => (
          <div key={i} className="rounded border border-[var(--matter-border)] p-4">
            <MatterField label="Section heading" value={str(sec.heading)} onChange={(heading) => setSections(rows.map((r, j) => (j === i ? { heading, body: str(r.body) } : { heading: str(r.heading), body: str(r.body) })))} />
            <div className="mt-2">
              <MatterTextarea label="Section body" value={str(sec.body)} onChange={(body) => setSections(rows.map((r, j) => (j === i ? { heading: str(r.heading), body } : { heading: str(r.heading), body: str(r.body) })))} rows={6} />
            </div>
            <button type="button" className="mt-2 text-sm text-[var(--matter-muted)]" onClick={() => setSections(rows.filter((_, j) => j !== i).map((r) => ({ heading: str(r.heading), body: str(r.body) })))}>Remove section</button>
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setSections([...rows.map((r) => ({ heading: str(r.heading), body: str(r.body) })), { heading: "", body: "" }])}>+ Add section</button>
      </div>
    </div>
  );
}

function InternalReviewEdit({ content, onChange }: EditProps) {
  const checks = arr<{ rule?: string; pass?: boolean; detail?: string }>(content.complianceChecks);
  const checkRows = checks.length ? checks : [{ rule: "", pass: true, detail: "" }];
  const comparisons = arr<{ left?: string; right?: string; diffSummary?: string }>(content.comparisons);
  const cmpRows = comparisons.length ? comparisons : [{ left: "", right: "", diffSummary: "" }];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm text-[var(--matter-muted)]">Compliance checks</span>
        {checkRows.map((c, i) => (
          <div key={i} className="mb-3 space-y-2 border-b border-[var(--matter-border)] pb-3">
            <MatterField label="Rule" value={str(c.rule)} onChange={(rule) => onChange(patchContent(content, { complianceChecks: checkRows.map((r, j) => (j === i ? { rule, pass: Boolean(r.pass), detail: str(r.detail) } : { rule: str(r.rule), pass: Boolean(r.pass), detail: str(r.detail) })) }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(c.pass)} onChange={(e) => onChange(patchContent(content, { complianceChecks: checkRows.map((r, j) => (j === i ? { rule: str(r.rule), pass: e.target.checked, detail: str(r.detail) } : { rule: str(r.rule), pass: Boolean(r.pass), detail: str(r.detail) })) }))} />
              Pass
            </label>
            <MatterField label="Detail" value={str(c.detail)} onChange={(detail) => onChange(patchContent(content, { complianceChecks: checkRows.map((r, j) => (j === i ? { rule: str(r.rule), pass: Boolean(r.pass), detail } : { rule: str(r.rule), pass: Boolean(r.pass), detail: str(r.detail) })) }))} />
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => onChange(patchContent(content, { complianceChecks: [...checkRows.map((r) => ({ rule: str(r.rule), pass: Boolean(r.pass), detail: str(r.detail) })), { rule: "", pass: false, detail: "" }] }))}>+ Add check</button>
      </div>
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm text-[var(--matter-muted)]">Comparisons</span>
        {cmpRows.map((cmp, i) => (
          <div key={i} className="mb-3 space-y-2 border-b pb-3">
            <MatterField label="Left" value={str(cmp.left)} onChange={(left) => onChange(patchContent(content, { comparisons: cmpRows.map((r, j) => (j === i ? { left, right: str(r.right), diffSummary: str(r.diffSummary) } : { left: str(r.left), right: str(r.right), diffSummary: str(r.diffSummary) })) }))} />
            <MatterField label="Right" value={str(cmp.right)} onChange={(right) => onChange(patchContent(content, { comparisons: cmpRows.map((r, j) => (j === i ? { left: str(r.left), right, diffSummary: str(r.diffSummary) } : { left: str(r.left), right: str(r.right), diffSummary: str(r.diffSummary) })) }))} />
            <MatterTextarea label="Diff summary" value={str(cmp.diffSummary)} onChange={(diffSummary) => onChange(patchContent(content, { comparisons: cmpRows.map((r, j) => (j === i ? { left: str(r.left), right: str(r.right), diffSummary } : { left: str(r.left), right: str(r.right), diffSummary: str(r.diffSummary) })) }))} rows={2} />
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => onChange(patchContent(content, { comparisons: [...cmpRows.map((r) => ({ left: str(r.left), right: str(r.right), diffSummary: str(r.diffSummary) })), { left: "", right: "", diffSummary: "" }] }))}>+ Add comparison</button>
      </div>
    </div>
  );
}

function CommentsEdit({ content, onChange, title }: EditProps & { title: string }) {
  const comments = arr<{ author?: string; section?: string; text?: string; resolved?: boolean }>(content.comments);
  const rows = comments.length ? comments : [{ author: "", section: "", text: "", resolved: false }];

  const setComments = (next: { author: string; section: string; text: string; resolved: boolean }[]) =>
    onChange(patchContent(content, { comments: next }));

  return (
    <div className="matter-card p-4">
      <p className="mb-3 font-medium">{title}</p>
      {rows.map((c, i) => (
        <div key={i} className="mb-4 space-y-2 border-b pb-4">
          <MatterField label="Author" value={str(c.author)} onChange={(author) => setComments(rows.map((r, j) => (j === i ? { author, section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) } : { author: str(r.author), section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) })))} />
          <MatterField label="Section" value={str(c.section)} onChange={(section) => setComments(rows.map((r, j) => (j === i ? { author: str(r.author), section, text: str(r.text), resolved: Boolean(r.resolved) } : { author: str(r.author), section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) })))} />
          <MatterTextarea label="Comment" value={str(c.text)} onChange={(text) => setComments(rows.map((r, j) => (j === i ? { author: str(r.author), section: str(r.section), text, resolved: Boolean(r.resolved) } : { author: str(r.author), section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) })))} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(c.resolved)} onChange={(e) => setComments(rows.map((r, j) => (j === i ? { author: str(r.author), section: str(r.section), text: str(r.text), resolved: e.target.checked } : { author: str(r.author), section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) })))} />
            Resolved
          </label>
        </div>
      ))}
      <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setComments([...rows.map((r) => ({ author: str(r.author), section: str(r.section), text: str(r.text), resolved: Boolean(r.resolved) })), { author: "", section: "", text: "", resolved: false }])}>+ Add comment</button>
    </div>
  );
}

function RevisionEdit({ content, onChange }: EditProps) {
  const versions = arr<{ label?: string; date?: string; summary?: string }>(content.versions);
  const vRows = versions.length ? versions : [{ label: "v1", date: "", summary: "" }];

  const setVersions = (next: { label: string; date: string; summary: string }[]) =>
    onChange(patchContent(content, { versions: next }));

  return (
    <div className="space-y-4">
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm font-medium">Version history</span>
        {vRows.map((v, i) => (
          <div key={i} className="mb-3 grid gap-2 border-b pb-3 sm:grid-cols-3">
            <MatterField label="Label" value={str(v.label)} onChange={(label) => setVersions(vRows.map((r, j) => (j === i ? { label, date: str(r.date), summary: str(r.summary) } : { label: str(r.label), date: str(r.date), summary: str(r.summary) })))} />
            <MatterField label="Date" value={str(v.date)} onChange={(date) => setVersions(vRows.map((r, j) => (j === i ? { label: str(r.label), date, summary: str(r.summary) } : { label: str(r.label), date: str(r.date), summary: str(r.summary) })))} />
            <MatterField label="Summary" value={str(v.summary)} onChange={(summary) => setVersions(vRows.map((r, j) => (j === i ? { label: str(r.label), date: str(r.date), summary } : { label: str(r.label), date: str(r.date), summary: str(r.summary) })))} />
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setVersions([...vRows.map((r) => ({ label: str(r.label), date: str(r.date), summary: str(r.summary) })), { label: "", date: "", summary: "" }])}>+ Add version</button>
      </div>
      <CommentsEdit content={content} onChange={onChange} title="Negotiation comments" />
    </div>
  );
}

function ApprovalEdit({ content, onChange }: EditProps) {
  return (
    <div className="matter-card p-4">
      <MatterField label="Approver" value={str(content.approver)} onChange={(approver) => onChange(patchContent(content, { approver }))} />
      <div className="mt-4">
        <ChecklistEditor
          label="Approval checklist"
          items={arr<{ item?: string; done?: boolean }>(content.checklist).map((c) => ({ item: str(c.item), done: Boolean(c.done) }))}
          onChange={(checklist) => onChange(patchContent(content, { checklist }))}
        />
      </div>
    </div>
  );
}

function ExecutionEdit({ content, onChange }: EditProps) {
  const signers = arr<{ name?: string; role?: string; status?: string }>(content.signers);
  const rows = signers.length ? signers : [{ name: "", role: "", status: "pending" }];

  const setSigners = (next: { name: string; role: string; status: string }[]) =>
    onChange(patchContent(content, { signers: next }));

  return (
    <div className="matter-card space-y-4 p-4">
      <MatterField label="Provider" value={str(content.provider) || "DocuSign (mock)"} onChange={(provider) => onChange(patchContent(content, { provider }))} />
      <MatterField label="Envelope ID" value={str(content.envelopeId)} onChange={(envelopeId) => onChange(patchContent(content, { envelopeId }))} />
      <MatterField label="Filing status" value={str(content.filingStatus)} onChange={(filingStatus) => onChange(patchContent(content, { filingStatus }))} />
      <span className="block text-sm text-[var(--matter-muted)]">Signers</span>
      {rows.map((s, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-3">
          <MatterField label="Name" value={str(s.name)} onChange={(name) => setSigners(rows.map((r, j) => (j === i ? { name, role: str(r.role), status: str(r.status) } : { name: str(r.name), role: str(r.role), status: str(r.status) })))} />
          <MatterField label="Role" value={str(s.role)} onChange={(role) => setSigners(rows.map((r, j) => (j === i ? { name: str(r.name), role, status: str(r.status) } : { name: str(r.name), role: str(r.role), status: str(r.status) })))} />
          <MatterSelect label="Status" value={str(s.status) || "pending"} onChange={(status) => setSigners(rows.map((r, j) => (j === i ? { name: str(r.name), role: str(r.role), status } : { name: str(r.name), role: str(r.role), status: str(r.status) })))} options={[{ value: "pending", label: "pending" }, { value: "signed", label: "signed" }]} />
        </div>
      ))}
      <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setSigners([...rows.map((r) => ({ name: str(r.name), role: str(r.role), status: str(r.status) })), { name: "", role: "", status: "pending" }])}>+ Add signer</button>
    </div>
  );
}

function StorageEdit({ content, onChange }: EditProps) {
  const deadlines = arr<{ label?: string; date?: string; type?: string }>(content.deadlines);
  const dRows = deadlines.length ? deadlines : [{ label: "", date: "", type: "compliance" }];

  const setDeadlines = (next: { label: string; date: string; type: string }[]) =>
    onChange(patchContent(content, { deadlines: next }));

  return (
    <div className="space-y-4">
      <div className="matter-card p-4">
        <span className="mb-2 block text-sm text-[var(--matter-muted)]">Deadlines</span>
        {dRows.map((d, i) => (
          <div key={i} className="mb-3 grid gap-2 sm:grid-cols-3">
            <MatterField label="Label" value={str(d.label)} onChange={(label) => setDeadlines(dRows.map((r, j) => (j === i ? { label, date: str(r.date), type: str(r.type) } : { label: str(r.label), date: str(r.date), type: str(r.type) })))} />
            <MatterField label="Date" value={str(d.date)} onChange={(date) => setDeadlines(dRows.map((r, j) => (j === i ? { label: str(r.label), date, type: str(r.type) } : { label: str(r.label), date: str(r.date), type: str(r.type) })))} />
            <MatterSelect label="Type" value={str(d.type) || "compliance"} onChange={(type) => setDeadlines(dRows.map((r, j) => (j === i ? { label: str(r.label), date: str(r.date), type } : { label: str(r.label), date: str(r.date), type: str(r.type) })))} options={[{ value: "renewal", label: "renewal" }, { value: "hearing", label: "hearing" }, { value: "compliance", label: "compliance" }]} />
          </div>
        ))}
        <button type="button" className="text-sm text-[var(--matter-accent)] hover:underline" onClick={() => setDeadlines([...dRows.map((r) => ({ label: str(r.label), date: str(r.date), type: str(r.type) })), { label: "", date: "", type: "compliance" }])}>+ Add deadline</button>
      </div>
      <div className="matter-card p-4">
        <StringListEditor label="Compliance obligations" items={arr<string>(content.obligations)} onChange={(obligations) => onChange(patchContent(content, { obligations }))} />
      </div>
      <div className="matter-card p-4">
        <StringListEditor label="Renewal reminders" items={arr<string>(content.renewalReminders)} onChange={(renewalReminders) => onChange(patchContent(content, { renewalReminders }))} />
      </div>
    </div>
  );
}
