"use client";

import { useTranslations } from "next-intl";

export default function TeamSettingsPage() {
  const t = useTranslations("portal.team");

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">{t("title")}</h1>
      <p className="mb-8 text-on-surface-variant">{t("subtitle")}</p>
      <div className="glass-panel p-8">
        <p className="text-on-surface-variant">{t("comingSoon")}</p>
      </div>
    </div>
  );
}
