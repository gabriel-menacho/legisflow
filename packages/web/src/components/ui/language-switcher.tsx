"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { useSetLocale } from "@/components/providers/locale-provider";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const ta = useTranslations("a11y");
  const setLocale = useSetLocale();

  return (
    <label className={`flex flex-col gap-1 text-xs ${className}`}>
      <span className="text-on-surface-variant">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={ta("languageSelect")}
        className="rounded border border-outline-variant bg-surface-container-low px-2 py-1.5 text-sm text-on-surface"
      >
        <option value="es">{t("languageEs")}</option>
        <option value="en">{t("languageEn")}</option>
      </select>
    </label>
  );
}
