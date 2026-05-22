"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function MarketingFooter() {
  const t = useTranslations("marketing");
  const tc = useTranslations("common");

  return (
    <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-lowest px-8 py-12 md:flex-row">
      <div className="font-[family-name:var(--font-headline)] text-xl text-primary">{tc("brand")}</div>
      <div className="flex gap-6">
        <Link href="/privacy" className="text-on-surface-variant hover:text-primary">
          {t("footerPrivacy")}
        </Link>
        <Link href="/terms" className="text-on-surface-variant hover:text-primary">
          {t("footerTerms")}
        </Link>
        <Link href="/security" className="text-on-surface-variant hover:text-primary">
          {t("footerSecurity")}
        </Link>
      </div>
      <p className="font-[family-name:var(--font-headline)] text-[10px] uppercase tracking-widest text-on-surface-variant">
        {t("footerRights", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
