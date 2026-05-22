"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { WorkflowRun, WorkflowTemplate } from "@legisflow/shared";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { useWorkflowLabels } from "@/hooks/use-workflow-labels";
import { api } from "@/lib/api";

export default function WorkflowsPage() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const { toast } = useToast();
  const t = useTranslations("portal.workflows");
  const { templateName, templateDescription, runStatus } = useWorkflowLabels();

  useEffect(() => {
    api.listWorkflows().then(setTemplates);
    api.listWorkflowRuns().then(setRuns).catch(() => {});
    const interval = setInterval(() => api.listWorkflowRuns().then(setRuns).catch(() => {}), 4000);
    return () => clearInterval(interval);
  }, []);

  const trigger = async (id: string) => {
    try {
      await api.triggerWorkflow(id, { query: "firm automation summary" });
      toast(t("triggered"));
      api.listWorkflowRuns().then(setRuns);
    } catch {
      toast(t("triggerFailed"), "error");
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">{t("title")}</h1>
      <p className="mb-8 text-on-surface-variant">{t("subtitle")}</p>
      {templates.length === 0 ? (
        <p className="mb-8 text-on-surface-variant">{t("emptyTemplates")}</p>
      ) : (
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {templates.map((w) => (
            <div key={w.id} className="glass-panel p-6">
              <h3 className="mb-2 font-semibold text-on-surface">{templateName(w.slug, w.name)}</h3>
              <p className="mb-4 text-sm text-on-surface-variant">
                {templateDescription(w.slug, w.description)}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => trigger(w.id)} className="text-xs">
                  {t("trigger")}
                </Button>
                <Link
                  href={`/workflows/${w.id}`}
                  className="border border-outline-variant px-4 py-3 text-xs uppercase hover:border-primary-container"
                >
                  {t("details")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="mb-4 font-[family-name:var(--font-headline)] text-xl">{t("runs")}</h2>
      {runs.length === 0 ? (
        <p className="text-on-surface-variant">{t("emptyRuns")}</p>
      ) : (
        <div className="space-y-2">
          {runs.map((r) => (
            <Link
              key={r.id}
              href={`/workflows/${r.workflow_id}/runs/${r.id}`}
              className="glass-panel flex flex-wrap items-center justify-between gap-2 p-4 hover:border-primary-container"
            >
              <span className="text-sm">{t("runIdShort", { id: r.id.slice(0, 8) })}</span>
              <span className="text-sm uppercase text-primary-container">{runStatus(r.status)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
