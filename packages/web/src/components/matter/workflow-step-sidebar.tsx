"use client";

import type { MatterStep, MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { useMatterLabels } from "@/hooks/use-matter-labels";

export function WorkflowStepSidebar({
  steps,
  activeStep,
  onSelect,
}: {
  steps: MatterStep[];
  activeStep: MatterStepKey;
  onSelect: (key: MatterStepKey) => void;
}) {
  const t = useTranslations("matter");
  const ta = useTranslations("a11y");
  const { stepLabel } = useMatterLabels();

  return (
    <nav
      className="matter-card w-full shrink-0 md:w-[min(100%,18rem)] md:min-w-[12rem] lg:min-w-[14rem]"
      aria-label={ta("workflowSteps")}
    >
      <div className="matter-card-header text-sm">{t("workflow")}</div>
      <ul className="p-2">
        {steps.map((s) => {
          const isActive = s.step_key === activeStep;
          const done = s.status === "completed";
          return (
            <li key={s.step_key}>
              <button
                type="button"
                onClick={() => onSelect(s.step_key)}
                aria-current={isActive ? "step" : undefined}
                className={`mb-0.5 flex w-full items-start gap-2 rounded px-3 py-2.5 text-left text-sm leading-snug ${
                  isActive
                    ? "bg-[var(--matter-accent-soft)] font-medium text-[var(--matter-accent)]"
                    : "text-[var(--matter-text)] hover:bg-[#f0f2ed]"
                }`}
              >
                <span
                  className={`matter-step-dot mt-1.5 shrink-0 ${
                    done ? "matter-step-dot-done" : isActive ? "matter-step-dot-current" : "matter-step-dot-pending"
                  }`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 break-words whitespace-normal">{stepLabel(s.step_key)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
