"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { api, setTokens } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await api.register(email, password, fullName || undefined);
      setTokens(tokens.access_token, tokens.refresh_token);
      router.push("/onboarding");
    } catch {
      toast(t("registrationFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-8">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <div className="glass-panel w-full max-w-md p-10">
        <Link href="/" className="mb-6 block font-[family-name:var(--font-headline)] text-2xl text-primary">
          {tc("brand")}
        </Link>
        <h1 className="mb-8 font-[family-name:var(--font-headline)] text-2xl text-white">{t("createAccount")}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1 block text-sm text-on-surface-variant">
              {t("fullName")}
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 focus:border-primary-container focus:ring-0"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm text-on-surface-variant">
              {t("workEmail")}
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 focus:border-primary-container focus:ring-0"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1 block text-sm text-on-surface-variant">
              {t("passwordMin")}
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 focus:border-primary-container focus:ring-0"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("creating") : t("continueOnboarding")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-primary-container hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
