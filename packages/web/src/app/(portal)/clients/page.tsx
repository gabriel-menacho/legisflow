"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Client } from "@legisflow/shared";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const t = useTranslations("portal.clients");

  useEffect(() => {
    api.listClients().then(setClients).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">
            {t("title")}
          </h1>
          <p className="text-on-surface-variant">{t("subtitle")}</p>
        </div>
        <Link href="/clients/new">
          <Button>{t("newClient")}</Button>
        </Link>
      </div>
      {clients.length === 0 ? (
        <p className="text-on-surface-variant">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="glass-panel block border-t-2 border-t-primary-container p-6 transition-colors hover:border-primary-container"
            >
              <h2 className="mb-1 font-semibold text-on-surface">{c.name}</h2>
              {c.company && <p className="text-sm text-on-surface-variant">{c.company}</p>}
              <p className="mt-4 text-xs uppercase text-primary-container">
                {t("matters", { count: c.matter_count })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
