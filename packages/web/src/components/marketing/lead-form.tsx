"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";
import { Icon } from "@/components/ui/icon";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("marketing");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.createLead({ email });
      toast(t("leadSuccessConsult"));
      setEmail("");
    } catch {
      toast(t("leadError"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={`mx-auto flex flex-col gap-4 ${compact ? "max-w-md" : "max-w-md"}`}>
      <div className="relative">
        <label htmlFor="lead-email" className="sr-only">
          {t("leadEmail")}
        </label>
        <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant" />
        <input
          id="lead-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("leadEmailPlaceholder")}
          className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-3 text-on-surface focus:border-primary-container focus:ring-0"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 bg-primary-container py-4 font-[family-name:var(--font-headline)] font-extrabold text-on-primary-container hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
      >
        {loading ? t("leadSending") : t("leadConsult")}
        <Icon name="arrow_forward" className="text-[18px]" />
      </button>
    </form>
  );
}
