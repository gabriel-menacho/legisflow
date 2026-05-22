"use client";

import type { MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { uploadFolderForStep } from "@/lib/matter-workflow";

export function StepToolbar({
  stepKey,
  generating,
  saving,
  editing,
  markComplete,
  onMarkCompleteChange,
  onEdit,
  onSave,
  onCancel,
  onRerun,
  onUpload,
  showUpload,
}: {
  stepKey: MatterStepKey;
  generating: boolean;
  saving?: boolean;
  editing: boolean;
  markComplete: boolean;
  onMarkCompleteChange: (v: boolean) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRerun: () => void;
  onUpload?: (file: File) => void;
  showUpload?: boolean;
}) {
  const t = useTranslations("matter.toolbar");
  const tm = useTranslations("matter");
  const folder = uploadFolderForStep(stepKey);

  if (editing) {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded bg-[var(--matter-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? t("saving") : t("save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded border border-[var(--matter-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--matter-text)] hover:bg-[#f8f9f6]"
        >
          {t("cancel")}
        </button>
        <label className="flex items-center gap-2 text-sm text-[var(--matter-muted)]">
          <input
            type="checkbox"
            checked={markComplete}
            onChange={(e) => onMarkCompleteChange(e.target.checked)}
          />
          {t("markComplete")}
        </label>
        {showUpload && onUpload && (
          <label className="cursor-pointer rounded border border-[var(--matter-border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f8f9f6]">
            {tm("upload")} ({folder})
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded border border-[var(--matter-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--matter-text)] hover:bg-[#f8f9f6]"
      >
        {t("edit")}
      </button>
      <button
        type="button"
        onClick={onRerun}
        disabled={generating}
        className="rounded border border-[var(--matter-accent)] bg-[var(--matter-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--matter-accent)] hover:opacity-90 disabled:opacity-50"
      >
        {generating ? tm("generating") : t("rerun")}
      </button>
      {showUpload && onUpload && (
        <label className="cursor-pointer rounded border border-[var(--matter-border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f8f9f6]">
          {tm("upload")} ({folder})
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
