"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentSummary, MatterDetail, MatterStepKey } from "@legisflow/shared";
import { MatterWorkspaceShell } from "@/components/matter/matter-workspace-shell";
import { StepNavigation } from "@/components/matter/step-navigation";
import { StepPanel } from "@/components/matter/step-panels";
import { StepToolbar } from "@/components/matter/step-toolbar";
import { WorkflowPhaseStepper } from "@/components/matter/workflow-phase-stepper";
import { WorkflowStepSidebar } from "@/components/matter/workflow-step-sidebar";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/providers/toast-provider";
import { nextStepKey, prevStepKey, uploadFolderForStep } from "@/lib/matter-workflow";
import { api } from "@/lib/api";

export default function MatterWorkspacePage() {
  const { clientId, matterId } = useParams<{ clientId: string; matterId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("matter");

  const [matter, setMatter] = useState<MatterDetail | null>(null);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftContent, setDraftContent] = useState<Record<string, unknown>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [markComplete, setMarkComplete] = useState(false);
  const draftSnapshot = useRef<string>("");

  const activeStep = (searchParams.get("step") as MatterStepKey) || matter?.current_step_key || "client_intake";

  const loadMatter = useCallback(() => {
    if (!matterId) return;
    api.getMatter(matterId).then(setMatter).catch(() => toast(t("loadFailed"), "error"));
  }, [matterId, toast, t]);

  const loadDocs = useCallback(() => {
    if (!matterId) return;
    const step = (searchParams.get("step") as MatterStepKey) || "client_intake";
    const folder = uploadFolderForStep(step);
    api
      .listDocuments({ matter_id: matterId, folder })
      .then(setDocuments)
      .catch(() => setDocuments([]));
  }, [matterId, searchParams]);

  useEffect(() => {
    loadMatter();
  }, [loadMatter]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  useEffect(() => {
    setEditing(false);
    setIsDirty(false);
  }, [activeStep]);

  const setStep = useCallback(
    (key: MatterStepKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", key);
      router.replace(`/clients/${clientId}/matters/${matterId}?${params}`);
    },
    [clientId, matterId, router, searchParams],
  );

  const currentStep = matter?.steps.find((s) => s.step_key === activeStep) ?? matter?.steps[0];

  const startEdit = () => {
    if (!currentStep) return;
    const content = { ...(currentStep.content || {}) };
    setDraftContent(content);
    draftSnapshot.current = JSON.stringify(content);
    setMarkComplete(currentStep.status === "completed");
    setIsDirty(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraftContent({});
    setIsDirty(false);
    setMarkComplete(false);
  };

  const saveStep = useCallback(
    async (opts?: { thenGoTo?: MatterStepKey }) => {
      if (!matterId || !currentStep) return false;
      setSaving(true);
      try {
        await api.updateMatterStep(matterId, activeStep, {
          content: draftContent,
          status: markComplete ? "completed" : "in_progress",
        });
        toast(t("saved"));
        setEditing(false);
        setIsDirty(false);
        draftSnapshot.current = JSON.stringify(draftContent);
        await api.getMatter(matterId).then(setMatter);
        if (opts?.thenGoTo) setStep(opts.thenGoTo);
        return true;
      } catch {
        toast(t("saveFailed"), "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [matterId, currentStep, activeStep, draftContent, markComplete, toast, setStep, t],
  );

  const navigateStep = async (key: MatterStepKey | null) => {
    if (!key) return;
    if (editing && isDirty) {
      const ok = window.confirm(t("unsavedConfirm"));
      if (ok) {
        const saved = await saveStep();
        if (!saved) return;
      } else {
        cancelEdit();
      }
    } else if (editing) {
      cancelEdit();
    }
    setStep(key);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!editing) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveStep();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, saveStep]);

  const onDraftChange = (content: Record<string, unknown>) => {
    setDraftContent(content);
    setIsDirty(JSON.stringify(content) !== draftSnapshot.current);
  };

  const onRerun = async () => {
    if (!matterId) return;
    if (editing) cancelEdit();
    setGenerating(true);
    try {
      await api.generateMatterStep(matterId, activeStep);
      toast(t("regenerated"));
      loadMatter();
      loadDocs();
    } catch {
      toast(t("generateFailedOllama"), "error");
    } finally {
      setGenerating(false);
    }
  };

  const onUpload = async (file: File) => {
    if (!matterId) return;
    try {
      await api.uploadDocument(file, {
        matterId,
        folder: uploadFolderForStep(activeStep),
      });
      toast(t("uploaded"));
      loadDocs();
      loadMatter();
    } catch {
      toast(t("uploadFailed"), "error");
    }
  };

  if (!matter) {
    return <p className="text-on-surface-variant">{t("loadingWorkspace")}</p>;
  }

  const showUpload =
    activeStep === "document_collection" || activeStep === "evidence_collection";

  return (
    <MatterWorkspaceShell matter={matter} clientId={clientId}>
      <WorkflowPhaseStepper
        phases={matter.phases}
        activeStep={activeStep}
        steps={matter.steps}
        onPhaseClick={(key) => navigateStep(key)}
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <WorkflowStepSidebar
          steps={matter.steps}
          activeStep={activeStep}
          onSelect={(key) => navigateStep(key)}
        />
        <div className="min-w-0 flex-1">
          <StepToolbar
            stepKey={activeStep}
            generating={generating}
            saving={saving}
            editing={editing}
            markComplete={markComplete}
            onMarkCompleteChange={setMarkComplete}
            onEdit={startEdit}
            onSave={() => saveStep()}
            onCancel={cancelEdit}
            onRerun={onRerun}
            onUpload={onUpload}
            showUpload={showUpload}
          />
          {currentStep && (
            <StepPanel
              step={currentStep}
              documents={documents}
              editing={editing}
              draftContent={draftContent}
              onDraftChange={onDraftChange}
            />
          )}
          <StepNavigation
            activeStep={activeStep}
            onPrev={() => navigateStep(prevStepKey(activeStep))}
            onNext={() => navigateStep(nextStepKey(activeStep))}
            showSaveAndNext={editing && isDirty}
            saving={saving}
            onSaveAndNext={async () => {
              const next = nextStepKey(activeStep);
              if (next) await saveStep({ thenGoTo: next });
            }}
          />
        </div>
      </div>
    </MatterWorkspaceShell>
  );
}
