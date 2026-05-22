"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-8">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <div className="glass-panel w-full max-w-md p-10 text-center">
        <h1 className="mb-4 font-[family-name:var(--font-headline)] text-2xl text-white">{t("forgotPassword")}</h1>
        <p className="mb-6 text-on-surface-variant">{t("forgotPasswordSubtitle")}</p>
        <Link href="/login" className="text-primary-container hover:underline">
          {t("backToSignIn")}
        </Link>
        <p className="mt-4 text-xs text-on-surface-variant">{tc("brand")}</p>
      </div>
    </div>
  );
}
