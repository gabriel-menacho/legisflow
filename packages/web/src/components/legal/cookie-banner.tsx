"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CONSENT_COOKIE, consentCookieValue } from "@/lib/locale-cookie";

function getConsent(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function CookieBanner() {
  const t = useTranslations("cookies");
  const ta = useTranslations("a11y");
  const [visible, setVisible] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
      acceptRef.current?.focus();
    }
  }, []);

  const setConsent = (value: "accepted" | "rejected") => {
    document.cookie = consentCookieValue(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-[150] border-t border-outline-variant bg-surface-container-low p-4 shadow-lg md:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="cookie-banner-title" className="mb-1 font-semibold text-on-surface">
            {t("title")}
          </h2>
          <p id="cookie-banner-desc" className="text-sm text-on-surface-variant">
            {t("description")}{" "}
            <Link href="/privacy#cookies" className="text-primary-container underline">
              {t("privacyLink")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            ref={acceptRef}
            type="button"
            onClick={() => setConsent("accepted")}
            className="bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("accept")}
          </button>
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="border border-outline-variant px-4 py-2 text-sm text-on-surface hover:border-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("reject")}
          </button>
        </div>
      </div>
      <span className="sr-only">{ta("cookieDialog")}</span>
    </div>
  );
}
