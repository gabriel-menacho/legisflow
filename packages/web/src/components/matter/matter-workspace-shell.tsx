"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { MatterDetail } from "@legisflow/shared";
import { useMatterLabels } from "@/hooks/use-matter-labels";

export function MatterWorkspaceShell({
  matter,
  clientId,
  children,
}: {
  matter: MatterDetail;
  clientId: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("matter");
  const { matterTypeLabel, matterStatusLabel } = useMatterLabels();

  return (
    <div className="matter-workspace">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href={`/clients/${clientId}`}
            className="text-sm text-[var(--matter-muted)] hover:text-[var(--matter-accent)]"
          >
            {t("backClient")} {matter.client_name ?? ""}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--matter-text)]">{matter.title}</h1>
          <p className="text-sm text-[var(--matter-muted)]">
            {matterTypeLabel(matter.matter_type)} · {matterStatusLabel(matter.status)}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
