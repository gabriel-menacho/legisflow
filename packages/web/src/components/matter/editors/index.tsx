"use client";

import { useTranslations } from "next-intl";

export function MatterField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--matter-muted)]">{label}</span>
      <input
        type="text"
        className="matter-input w-full"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function MatterTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--matter-muted)]">{label}</span>
      <textarea
        className="matter-textarea w-full"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function MatterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--matter-muted)]">{label}</span>
      <select className="matter-input w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = "Add item…",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const tc = useTranslations("common");
  const list = items.length ? items : [""];
  return (
    <div className="text-sm">
      <span className="mb-2 block text-[var(--matter-muted)]">{label}</span>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="matter-input flex-1"
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next.filter((x, j) => x.trim() || j < next.length - 1 || next.length === 1));
              }}
            />
            <button
              type="button"
              className="rounded border border-[var(--matter-border)] px-2 text-[var(--matter-muted)] hover:bg-[#f8f9f6]"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              aria-label={tc("remove")}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--matter-accent)] hover:underline"
          onClick={() => onChange([...list, ""])}
        >
          + {tc("add")}
        </button>
      </div>
    </div>
  );
}

export function KeyValueEditor({
  label,
  fields,
  onChange,
}: {
  label: string;
  fields: Record<string, string>;
  onChange: (fields: Record<string, string>) => void;
}) {
  const entries = Object.entries(fields);
  const rows = entries.length ? entries : [["", ""] as [string, string]];

  const update = (pairs: [string, string][]) => {
    const next: Record<string, string> = {};
    for (const [k, v] of pairs) {
      if (k.trim()) next[k.trim()] = v;
    }
    onChange(next);
  };

  return (
    <div className="text-sm">
      <span className="mb-2 block text-[var(--matter-muted)]">{label}</span>
      <div className="space-y-2">
        {rows.map(([k, v], i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              className="matter-input"
              placeholder="Field name"
              value={k}
              onChange={(e) => {
                const next = [...rows];
                next[i] = [e.target.value, v];
                update(next);
              }}
            />
            <div className="flex gap-2">
              <input
                className="matter-input flex-1"
                placeholder="Value"
                value={v}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = [k, e.target.value];
                  update(next);
                }}
              />
              <button
                type="button"
                className="rounded border border-[var(--matter-border)] px-2 text-[var(--matter-muted)]"
                onClick={() => update(rows.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--matter-accent)] hover:underline"
          onClick={() => update([...rows, ["", ""]])}
        >
          + Add field
        </button>
      </div>
    </div>
  );
}

export function ChecklistEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: { item: string; done: boolean }[];
  onChange: (items: { item: string; done: boolean }[]) => void;
}) {
  const list = items.length ? items : [{ item: "", done: false }];
  return (
    <div className="text-sm">
      <span className="mb-2 block text-[var(--matter-muted)]">{label}</span>
      <div className="space-y-2">
        {list.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={row.done}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...row, done: e.target.checked };
                onChange(next);
              }}
            />
            <input
              className="matter-input flex-1"
              value={row.item}
              placeholder="Checklist item"
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...row, item: e.target.value };
                onChange(next);
              }}
            />
            <button
              type="button"
              className="rounded border border-[var(--matter-border)] px-2 text-[var(--matter-muted)]"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[var(--matter-accent)] hover:underline"
          onClick={() => onChange([...list, { item: "", done: false }])}
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

export function patchContent(
  content: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  return { ...content, ...patch };
}
