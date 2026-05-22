"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { WorkflowRun, WorkflowTemplate } from "@legisflow/shared";
import { useWorkflowLabels } from "@/hooks/use-workflow-labels";
import { api } from "@/lib/api";

export default function WorkflowRunPage() {
  const { id, runId } = useParams<{ id: string; runId: string }>();
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowTemplate | null>(null);
  const t = useTranslations("portal.workflows");
  const { templateStepName, runStatus } = useWorkflowLabels();

  useEffect(() => {
    if (!runId) return;
    const load = () => api.getWorkflowRun(runId).then(setRun);
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [runId]);

  useEffect(() => {
    if (id) api.getWorkflow(id).then(setWorkflow).catch(() => {});
  }, [id]);

  if (!run) return <p className="text-on-surface-variant">{t("loadingRun")}</p>;

  const slug = workflow?.slug ?? "";

  return (
    <div>
      <Link href="/workflows" className="mb-4 inline-block text-sm text-primary-container hover:underline">
        {t("backWorkflows")}
      </Link>
      <h1 className="mb-2 font-[family-name:var(--font-headline)] text-2xl text-white">
        {t("runTitle", { id: run.id.slice(0, 8) })}
      </h1>
      <p className="mb-6 uppercase text-primary-container">{runStatus(run.status)}</p>
      {run.output_summary && (
        <div className="glass-panel mb-8 p-6">
          <h2 className="mb-2 font-semibold">{t("summary")}</h2>
          <pre className="whitespace-pre-wrap text-sm text-on-surface-variant">{run.output_summary}</pre>
        </div>
      )}
      <h2 className="mb-4 font-[family-name:var(--font-headline)] text-xl">{t("steps")}</h2>
      <div className="space-y-3">
        {(run.steps ?? []).map((s) => (
          <div key={s.id} className="glass-panel p-4">
            <p className="font-medium">
              {s.step_order}. {templateStepName(slug, s.step_order, s.name)} —{" "}
              <span className="text-primary-container">{runStatus(s.status)}</span>
            </p>
            {s.log && <p className="mt-2 text-sm text-on-surface-variant">{s.log}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
