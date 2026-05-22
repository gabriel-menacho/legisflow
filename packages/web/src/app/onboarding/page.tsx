"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const SIZES = ["1-10", "11-50", "51-200", "200+"];
const PRACTICE_AREAS = ["Litigation", "Corporate", "Family", "IP", "Real Estate", "Criminal"];
const INTEGRATIONS = ["Clio", "DocuSign", "n8n", "Microsoft 365", "Google Workspace"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { refresh, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");

  if (user?.firm?.onboarding_complete) {
    router.replace("/dashboard");
  }

  const toggle = (list: string[], set: (v: string[]) => void, item: string) => {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const finish = async () => {
    setLoading(true);
    try {
      await api.onboarding({ name, size: size || undefined, practice_areas: areas, integrations });
      await refresh();
      router.push("/dashboard");
    } catch {
      toast(t("failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-8 py-16">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <div className="glass-panel-active w-full max-w-xl p-10">
        <p className="mb-2 font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-primary-container">
          {t("stepOf", { current: step + 1, total: 3 })}
        </p>
        {step === 0 && (
          <>
            <h1 className="mb-6 font-[family-name:var(--font-headline)] text-2xl text-white">{t("yourFirm")}</h1>
            <label htmlFor="firm-name" className="mb-1 block text-sm text-on-surface-variant">
              {t("firmName")} *
            </label>
            <input
              id="firm-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full border-b border-outline-variant bg-transparent py-3 focus:border-primary-container"
            />
            <p className="mb-2 text-sm text-on-surface-variant">{t("firmSizeLabel")}</p>
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("firmSizeLabel")}>
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`border px-3 py-1 text-sm ${
                    size === s ? "border-primary-container text-primary-container" : "border-outline-variant"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <Button onClick={() => name && setStep(1)} className="w-full">
              {tc("continue")}
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="mb-6 font-[family-name:var(--font-headline)] text-2xl text-white">{t("practiceAreasTitle")}</h1>
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("practiceAreasTitle")}>
              {PRACTICE_AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(areas, setAreas, a)}
                  aria-pressed={areas.includes(a)}
                  className={`border px-3 py-1 text-sm ${
                    areas.includes(a) ? "border-primary-container text-primary-container" : "border-outline-variant"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setStep(0)} className="flex-1">
                {tc("back")}
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1">
                {tc("continue")}
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="mb-6 font-[family-name:var(--font-headline)] text-2xl text-white">{t("integrationsTitle")}</h1>
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("integrationsTitle")}>
              {INTEGRATIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(integrations, setIntegrations, i)}
                  aria-pressed={integrations.includes(i)}
                  className={`border px-3 py-1 text-sm ${
                    integrations.includes(i) ? "border-primary-container text-primary-container" : "border-outline-variant"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                {tc("back")}
              </Button>
              <Button onClick={finish} className="flex-1" disabled={loading}>
                {loading ? t("saving") : t("launchPortal")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
