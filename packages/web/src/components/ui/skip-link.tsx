"use client";

import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("a11y");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-primary-container focus:px-4 focus:py-2 focus:text-on-primary-container focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {t("skipToContent")}
    </a>
  );
}
