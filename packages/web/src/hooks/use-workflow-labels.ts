"use client";

import { useTranslations } from "next-intl";

export const WORKFLOW_TEMPLATE_SLUGS = [
  "client-intake-automation",
  "contract-drafting-pipeline",
  "case-summarization",
] as const;

export type WorkflowTemplateSlug = (typeof WORKFLOW_TEMPLATE_SLUGS)[number];

export function isWorkflowSlug(slug: string): slug is WorkflowTemplateSlug {
  return (WORKFLOW_TEMPLATE_SLUGS as readonly string[]).includes(slug);
}

export function useWorkflowLabels() {
  const t = useTranslations("portal.workflows");

  const templateName = (slug: string, fallback: string) =>
    isWorkflowSlug(slug) ? t(`templates.${slug}.name`) : fallback;

  const templateDescription = (slug: string, fallback: string) =>
    isWorkflowSlug(slug) ? t(`templates.${slug}.description`) : fallback;

  const templateStepName = (slug: string, stepOrder: number, fallback: string) => {
    if (!isWorkflowSlug(slug)) return fallback;
    const steps = t.raw(`templateSteps.${slug}`) as string[] | undefined;
    const idx = stepOrder - 1;
    return steps?.[idx] ?? fallback;
  };

  const runStatus = (status: string) => {
    const known = ["pending", "running", "completed", "failed"] as const;
    if ((known as readonly string[]).includes(status)) {
      return t(`runStatuses.${status}` as "runStatuses.pending");
    }
    return status;
  };

  return { templateName, templateDescription, templateStepName, runStatus };
}
