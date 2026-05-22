"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      toast(t("invalidCredentials"), "error");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    setEmail("demo@legisflow.com");
    setPassword("Demo123!");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-8">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <div className="glass-panel w-full max-w-md p-10">
        <Link href="/" className="mb-6 block font-[family-name:var(--font-headline)] text-2xl text-primary">
          {tc("brand")}
        </Link>
        <h1 className="mb-2 font-[family-name:var(--font-headline)] text-2xl text-white">{t("signIn")}</h1>
        <p className="mb-8 text-sm italic text-on-surface-variant">{t("signInSubtitle")}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm text-on-surface-variant">
              {t("email")}
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 focus:border-primary-container focus:ring-0"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm text-on-surface-variant">
              {t("password")}
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="scanline-input w-full border-0 border-b border-outline-variant bg-surface-container-lowest py-3 focus:border-primary-container focus:ring-0"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </form>
        <button
          type="button"
          onClick={demoLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-outline-variant py-2 text-sm text-on-surface-variant hover:border-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="science" /> {t("demoCredentials")}
        </button>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary-container hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
