"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { useMatterLabels } from "@/hooks/use-matter-labels";
import { MATTER_TYPE_KEYS, type MatterTypeKey } from "@/lib/matter-types";
import { api } from "@/lib/api";

export default function NewMatterPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [title, setTitle] = useState("");
  const [matterType, setMatterType] = useState<MatterTypeKey>("employment_contract");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("portal.clients");
  const tw = useTranslations("portal.workflows");
  const { matterTypeLabel } = useMatterLabels();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !title.trim()) return;
    setLoading(true);
    try {
      const matter = await api.createMatter(clientId, {
        title: title.trim(),
        matter_type: matterType,
        summary: summary || undefined,
      });
      toast(t("matterCreated"));
      router.push(`/clients/${clientId}/matters/${matter.id}?step=client_intake`);
    } catch {
      toast(t("matterFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href={`/clients/${clientId}`}
        className="mb-4 inline-block text-sm text-primary-container hover:underline"
      >
        {tw("backClient")}
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-headline)] text-3xl text-primary-container">
        {t("newMatterTitle")}
      </h1>
      <form onSubmit={submit} className="glass-panel space-y-4 p-6">
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("matterTitle")} *</span>
          <input
            className="mt-1 w-full border-b border-outline-variant bg-surface-container-low px-2 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{tw("documentType")}</span>
          <select
            className="mt-1 w-full border border-outline-variant bg-surface-container-low px-2 py-2"
            value={matterType}
            onChange={(e) => setMatterType(e.target.value as MatterTypeKey)}
          >
            {MATTER_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {matterTypeLabel(key)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("summary")}</span>
          <textarea
            className="mt-1 w-full border border-outline-variant bg-surface-container-low p-2"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? t("creating") : tw("createMatterStart")}
        </Button>
      </form>
    </div>
  );
}
