"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { WorkflowTemplate } from "@legisflow/shared";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { useWorkflowLabels } from "@/hooks/use-workflow-labels";
import { api } from "@/lib/api";

export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<WorkflowTemplate | null>(null);
  const { toast } = useToast();
  const t = useTranslations("portal.workflows");
  const tc = useTranslations("common");
  const { templateName, templateDescription } = useWorkflowLabels();

  useEffect(() => {
    if (id) api.getWorkflow(id).then(setWorkflow);
  }, [id]);

  const trigger = async () => {
    if (!id) return;
    try {
      const run = await api.triggerWorkflow(id, { query: "automation run", matter_id: "demo-001" });
      toast(`${t("triggered")}: ${run.id.slice(0, 8)}`);
    } catch {
      toast(t("triggerFailed"), "error");
    }
  };

  if (!workflow) return <p className="text-on-surface-variant">{tc("loading")}</p>;

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">
        {templateName(workflow.slug, workflow.name)}
      </h1>
      <p className="mb-8 max-w-2xl text-on-surface-variant">
        {templateDescription(workflow.slug, workflow.description)}
      </p>
      <div className="glass-panel mb-8 p-8">
        <p className="mb-4 text-sm text-on-surface-variant">
          {t("slugLabel")}: {workflow.slug}
        </p>
        <Button onClick={trigger}>{t("runNow")}</Button>
      </div>
      <p className="text-sm text-on-surface-variant">{t("webhookHint", { id })}</p>
    </div>
  );
}
