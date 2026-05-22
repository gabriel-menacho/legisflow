"use client";

import type { MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { useMatterLabels } from "@/hooks/use-matter-labels";
import { nextStepKey, prevStepKey, stepPosition } from "@/lib/matter-workflow";

export function StepNavigation({
  activeStep,
  onPrev,
  onNext,
  onSaveAndNext,
  showSaveAndNext,
  saving,
}: {
  activeStep: MatterStepKey;
  onPrev: () => void;
  onNext: () => void;
  onSaveAndNext?: () => void;
  showSaveAndNext?: boolean;
  saving?: boolean;
}) {
  const t = useTranslations("matter");
  const tc = useTranslations("common");
  const { stepLabel } = useMatterLabels();
  const prev = prevStepKey(activeStep);
  const next = nextStepKey(activeStep);
  const { current, total } = stepPosition(activeStep);
  const label = stepLabel(activeStep);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--matter-border)] pt-4">
      <button
        type="button"
        disabled={!prev}
        onClick={onPrev}
        className="rounded border border-[var(--matter-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--matter-text)] hover:bg-[#f8f9f6] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← {t("prev")}
      </button>
      <p className="text-center text-sm text-[var(--matter-muted)]">
        {t("stepOf", { current, total })} — <span className="font-medium text-[var(--matter-text)]">{label}</span>
      </p>
      <div className="flex gap-2">
        {showSaveAndNext && onSaveAndNext && next && (
          <button
            type="button"
            disabled={saving}
            onClick={onSaveAndNext}
            className="rounded border border-[var(--matter-accent)] bg-[var(--matter-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--matter-accent)] hover:opacity-90 disabled:opacity-50"
          >
            {saving ? tc("saving") : t("saveAndNext")}
          </button>
        )}
        <button
          type="button"
          disabled={!next}
          onClick={onNext}
          className="rounded bg-[var(--matter-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("next")} →
        </button>
      </div>
    </div>
  );
}
