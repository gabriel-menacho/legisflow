"use client";

import type { MatterPhase, MatterStep, MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { useMatterLabels } from "@/hooks/use-matter-labels";

export function WorkflowPhaseStepper({
  phases: phasesProp,
  activeStep,
  steps,
  onPhaseClick,
}: {
  phases?: MatterPhase[];
  activeStep: MatterStepKey;
  steps: MatterStep[];
  onPhaseClick: (stepKey: MatterStepKey) => void;
}) {
  const { phases: defaultPhases, translatePhases } = useMatterLabels();
  const ta = useTranslations("a11y");
  const phases = phasesProp ? translatePhases(phasesProp) : defaultPhases;

  return (
    <div className="matter-card mb-4 p-3">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ta("workflowSteps")}>
        {phases.map((phase) => {
          const phaseSteps = phase.steps;
          const completed = phaseSteps.every(
            (k) => steps.find((s) => s.step_key === k)?.status === "completed",
          );
          const active = phaseSteps.includes(activeStep);
          const firstStep = phaseSteps[0];
          return (
            <button
              key={phase.key}
              type="button"
              onClick={() => onPhaseClick(firstStep)}
              aria-current={active ? "step" : undefined}
              className={`flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-medium leading-snug transition-colors ${
                active
                  ? "bg-[var(--matter-accent)] text-white"
                  : completed
                    ? "bg-[var(--matter-accent-soft)] text-[var(--matter-accent)]"
                    : "bg-[#eef1ea] text-[var(--matter-muted)] hover:bg-[#e2e8dc]"
              }`}
            >
              {completed && !active && (
                <span className="shrink-0 text-xs" aria-hidden>
                  ✓
                </span>
              )}
              <span className="break-words text-left">{phase.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
