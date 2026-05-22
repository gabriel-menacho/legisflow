"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { DocumentSummary } from "@legisflow/shared";
import { useToast } from "@/components/providers/toast-provider";
import { Icon } from "@/components/ui/icon";
import { api } from "@/lib/api";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("portal.documents");
  const tc = useTranslations("common");

  const load = useCallback(() => {
    api.listDocuments().then(setDocs).catch(() => toast(t("loadFailed"), "error"));
  }, [toast, t]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.uploadDocument(file);
      toast(t("uploaded"));
      load();
    } catch {
      toast(t("uploadFailed"), "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      toast(t("deleted"));
      load();
    } catch {
      toast(t("deleteFailed"), "error");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-3xl text-primary-container">{t("title")}</h1>
          <p className="text-on-surface-variant">{t("subtitle")}</p>
        </div>
        <label className="cursor-pointer bg-primary-container px-6 py-3 font-[family-name:var(--font-headline)] text-xs uppercase text-on-primary-container hover:bg-primary focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
          {uploading ? t("uploading") : t("upload")}
          <input type="file" accept=".pdf,.docx,.doc,.txt" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>
      {docs.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Icon name="upload_file" className="mb-4 text-5xl text-on-surface-variant" />
          <p className="text-on-surface-variant">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="glass-panel flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-on-surface">{d.filename}</p>
                <p className="text-sm text-on-surface-variant">
                  {d.status} · {d.chunk_count} {t("chunks")} · {new Date(d.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={d.status} />
                <button
                  type="button"
                  onClick={() => onDelete(d.id)}
                  className="text-error hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {tc("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === "ready"
      ? "text-primary-container border-primary-container"
      : status === "failed"
        ? "text-error border-error"
        : "text-on-surface-variant border-outline-variant";
  return (
    <span className={`border px-2 py-0.5 font-[family-name:var(--font-headline)] text-[10px] uppercase ${colors}`}>
      {status}
    </span>
  );
}
