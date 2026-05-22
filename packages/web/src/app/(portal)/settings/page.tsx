"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [llm, setLlm] = useState<{ provider: string; chat_model: string; embed_model: string } | null>(null);
  const t = useTranslations("portal.settings");
  const tc = useTranslations("common");

  useEffect(() => {
    api.llmConfig().then(setLlm);
  }, []);

  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-headline)] text-3xl text-primary-container">{t("title")}</h1>
      <div className="glass-panel mb-6 max-w-xl p-8">
        <h2 className="mb-4 font-semibold">{t("language")}</h2>
        <p className="mb-4 text-sm text-on-surface-variant">{t("languageHelp")}</p>
        <LanguageSwitcher />
      </div>
      <div className="glass-panel mb-6 max-w-xl p-8">
        <h2 className="mb-4 font-semibold">{t("profile")}</h2>
        <p className="text-on-surface-variant">
          {t("email")}: {user?.user.email}
        </p>
        <p className="text-on-surface-variant">
          {t("name")}: {user?.user.full_name || tc("notAvailable")}
        </p>
        <p className="text-on-surface-variant">
          {t("role")}: {user?.role}
        </p>
      </div>
      <div className="glass-panel mb-6 max-w-xl p-8">
        <h2 className="mb-4 font-semibold">{t("firm")}</h2>
        <p className="text-on-surface">{user?.firm?.name}</p>
        <p className="text-sm text-on-surface-variant">
          {t("size")}: {user?.firm?.size || tc("notAvailable")}
        </p>
        <p className="text-sm text-on-surface-variant">
          {t("practiceAreas")}: {user?.firm?.practice_areas?.join(", ") || tc("notAvailable")}
        </p>
      </div>
      <MotionLlmConfig llm={llm} />
      <Link href="/settings/team" className="text-primary-container hover:underline">
        {t("teamSettings")}
      </Link>
    </div>
  );
}

function MotionLlmConfig({ llm }: { llm: { provider: string; chat_model: string; embed_model: string } | null }) {
  const t = useTranslations("portal.settings");

  return (
    <div className="glass-panel mb-6 max-w-xl p-8">
      <h2 className="mb-4 font-semibold">{t("llmConfig")}</h2>
      <p className="text-sm text-on-surface-variant">{t("llmReadOnly")}</p>
      {llm && (
        <ul className="mt-4 space-y-1 text-sm">
          <li>
            {t("provider")}: <span className="text-primary-container">{llm.provider}</span>
          </li>
          <li>
            {t("chatModel")}: {llm.chat_model}
          </li>
          <li>
            {t("embedModel")}: {llm.embed_model}
          </li>
        </ul>
      )}
    </div>
  );
}
