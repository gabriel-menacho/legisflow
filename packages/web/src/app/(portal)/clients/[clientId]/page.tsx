"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Client, Matter } from "@legisflow/shared";
import { Button } from "@/components/ui/button";
import { useMatterLabels } from "@/hooks/use-matter-labels";
import { api } from "@/lib/api";

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const t = useTranslations("portal.clients");
  const { stepLabel, matterTypeLabel, matterStatusLabel } = useMatterLabels();

  useEffect(() => {
    if (!clientId) return;
    api.getClient(clientId).then(setClient);
    api.listClientMatters(clientId).then(setMatters);
  }, [clientId]);

  if (!client) return <p className="text-on-surface-variant">{t("loadingClient")}</p>;

  return (
    <div>
      <Link href="/clients" className="mb-4 inline-block text-sm text-primary-container hover:underline">
        {t("backToClients")}
      </Link>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="glass-panel border-t-2 border-t-primary-container p-6">
          <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-primary-container">
            {client.name}
          </h1>
          {client.company && <p className="text-on-surface">{client.company}</p>}
          {client.email && <p className="text-sm text-on-surface-variant">{client.email}</p>}
          {client.phone && <p className="text-sm text-on-surface-variant">{client.phone}</p>}
          {client.notes && <p className="mt-4 text-sm text-on-surface-variant">{client.notes}</p>}
        </div>
        <Link href={`/clients/${clientId}/matters/new`}>
          <Button>{t("newMatter")}</Button>
        </Link>
      </div>
      <h2 className="mb-4 font-[family-name:var(--font-headline)] text-xl">{t("mattersTitle")}</h2>
      {matters.length === 0 ? (
        <p className="text-on-surface-variant">{t("noMattersClient")}</p>
      ) : (
        <div className="space-y-3">
          {matters.map((m) => (
            <Link
              key={m.id}
              href={`/clients/${clientId}/matters/${m.id}`}
              className="glass-panel flex flex-wrap items-center justify-between gap-4 p-4 hover:border-primary-container"
            >
              <div>
                <p className="font-semibold text-on-surface">{m.title}</p>
                <p className="text-sm text-on-surface-variant">
                  {matterTypeLabel(m.matter_type)} · {matterStatusLabel(m.status)}
                </p>
              </div>
              <span className="max-w-xs text-right text-xs uppercase leading-snug text-primary-container">
                {t("step")}: {stepLabel(m.current_step_key)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
