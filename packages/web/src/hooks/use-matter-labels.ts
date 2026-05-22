"use client";

import type { MatterStepKey } from "@legisflow/shared";
import { useTranslations } from "next-intl";
import { isMatterTypeKey } from "@/lib/matter-types";
import { MATTER_PHASES, MATTER_STEP_ORDER } from "@/lib/matter-workflow";

const ROLE_KEYS = [
  "client",
  "junior_lawyer",
  "senior_lawyer",
  "paralegal",
  "compliance",
  "client_stakeholder",
] as const;

const STEP_STATUS_KEYS = ["pending", "in_progress", "completed"] as const;

const MATTER_STATUS_KEYS = ["active", "closed", "on_hold", "draft"] as const;

export function useMatterLabels() {
  const tSteps = useTranslations("matter.steps");
  const tPhases = useTranslations("matter.phases");
  const tRoles = useTranslations("matter.roles");
  const tStepStatuses = useTranslations("matter.stepStatuses");
  const tMatterStatuses = useTranslations("matter.matterStatuses");
  const tMatterTypes = useTranslations("matter.matterTypes");

  const stepLabel = (key: MatterStepKey) => tSteps(key);
  const phaseLabel = (key: string) => tPhases(key as "intake" | "research_plan" | "draft" | "review" | "close");

  const roleLabel = (role: string) => {
    if ((ROLE_KEYS as readonly string[]).includes(role)) {
      return tRoles(role as (typeof ROLE_KEYS)[number]);
    }
    return role;
  };

  const stepStatusLabel = (status: string) => {
    if ((STEP_STATUS_KEYS as readonly string[]).includes(status)) {
      return tStepStatuses(status as (typeof STEP_STATUS_KEYS)[number]);
    }
    return status;
  };

  const matterStatusLabel = (status: string) => {
    if ((MATTER_STATUS_KEYS as readonly string[]).includes(status)) {
      return tMatterStatuses(status as (typeof MATTER_STATUS_KEYS)[number]);
    }
    return status.replace(/_/g, " ");
  };

  const matterTypeLabel = (type: string) => {
    if (isMatterTypeKey(type)) {
      return tMatterTypes(type);
    }
    return type.replace(/_/g, " ");
  };

  const phases = MATTER_PHASES.map((p) => ({
    ...p,
    label: phaseLabel(p.key),
  }));

  /** Apply translated labels to API phase objects (keys only). */
  const translatePhases = (apiPhases: { key: string; label: string; steps: MatterStepKey[] }[]) =>
    apiPhases.map((p) => ({
      ...p,
      label: phaseLabel(p.key),
    }));

  return {
    stepLabel,
    phaseLabel,
    roleLabel,
    stepStatusLabel,
    matterStatusLabel,
    matterTypeLabel,
    phases,
    translatePhases,
    stepOrder: MATTER_STEP_ORDER,
  };
}
