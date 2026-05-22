"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";

export default function NewClientPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("portal.clients");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const client = await api.createClient({
        name: name.trim(),
        company: company || undefined,
        email: email || undefined,
        phone: phone || undefined,
        notes: notes || undefined,
      });
      toast(t("created"));
      router.push(`/clients/${client.id}`);
    } catch {
      toast(t("createFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-[family-name:var(--font-headline)] text-3xl text-primary-container">
        {t("newClientTitle")}
      </h1>
      <form onSubmit={submit} className="glass-panel space-y-4 p-6">
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("name")} *</span>
          <input
            className="scanline-input mt-1 w-full border-b border-outline-variant bg-surface-container-low px-2 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("company")}</span>
          <input
            className="mt-1 w-full border-b border-outline-variant bg-surface-container-low px-2 py-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("email")}</span>
          <input
            type="email"
            className="mt-1 w-full border-b border-outline-variant bg-surface-container-low px-2 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("phone")}</span>
          <input
            className="mt-1 w-full border-b border-outline-variant bg-surface-container-low px-2 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-on-surface-variant">{t("notes")}</span>
          <textarea
            className="mt-1 w-full border border-outline-variant bg-surface-container-low p-2"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? t("creating") : t("create")}
        </Button>
      </form>
    </div>
  );
}
