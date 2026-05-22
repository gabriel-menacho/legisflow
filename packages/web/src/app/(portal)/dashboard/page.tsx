"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { DashboardStats } from "@legisflow/shared";
import { Icon } from "@/components/ui/icon";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const t = useTranslations("portal.dashboard");

  useEffect(() => {
    api.dashboardStats().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: t("clients"), value: stats?.clients_count ?? "—", icon: "groups", href: "/clients" },
    { label: t("activeMatters"), value: stats?.active_matters ?? "—", icon: "gavel", href: "/clients" },
    { label: t("documentsIndexed"), value: stats?.documents_indexed ?? "—", icon: "folder", href: "/documents" },
    { label: t("chatThreads"), value: stats?.chat_threads ?? "—", icon: "forum", href: "/assistant" },
  ];

  const demoHref =
    stats?.demo_client_id && stats?.demo_matter_id
      ? `/clients/${stats.demo_client_id}/matters/${stats.demo_matter_id}?step=revision_negotiation`
      : "/clients";

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">{t("title")}</h1>
      <p className="mb-8 text-on-surface-variant">{t("subtitle")}</p>
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="glass-panel block p-6 transition-colors hover:border-primary-container"
          >
            <Icon name={c.icon} className="mb-2 text-primary-container" />
            <p className="text-3xl font-bold text-on-surface">{c.value}</p>
            <p className="text-sm text-on-surface-variant">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="glass-panel p-8">
        <h2 className="mb-4 font-[family-name:var(--font-headline)] text-xl">{t("quickStart")}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-on-surface-variant">
          <li>
            <Link href={demoHref} className="text-primary-container hover:underline">
              {t("openDemoMatter")}
            </Link>{" "}
            {t("demoMatterDesc")}
          </li>
          <li>
            <Link href="/clients/new" className="text-primary-container hover:underline">
              {t("addClient")}
            </Link>{" "}
            {t("addClientDesc")}
          </li>
          <li>
            <Link href="/documents" className="text-primary-container hover:underline">
              {t("uploadDocs")}
            </Link>{" "}
            {t("uploadDocsDesc")}
          </li>
          <li>
            <Link href="/assistant" className="text-primary-container hover:underline">
              {t("askAssistant")}
            </Link>{" "}
            {t("askAssistantDesc")}
          </li>
        </ol>
      </div>
    </div>
  );
}
