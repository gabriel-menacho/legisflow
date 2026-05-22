"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Icon } from "@/components/ui/icon";

const NAV = [
  { href: "/dashboard", icon: "dashboard", labelKey: "dashboard" as const },
  { href: "/clients", icon: "groups", labelKey: "clients" as const },
  { href: "/assistant", icon: "smart_toy", labelKey: "assistant" as const },
  { href: "/documents", icon: "folder", labelKey: "documents" as const },
  { href: "/workflows", icon: "account_tree", labelKey: "workflows" as const },
  { href: "/settings", icon: "settings", labelKey: "settings" as const },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ta = useTranslations("a11y");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && !user.firm?.onboarding_complete && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary-container">{tc("loadingPortal")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 flex-col border-r border-outline-variant bg-surface-container-low md:flex">
        <div className="border-b border-outline-variant p-6 font-[family-name:var(--font-headline)] text-xl text-primary">
          {tc("brand")}
        </div>
        <nav className="flex-1 p-4" aria-label={ta("portalNav")}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 px-3 py-2 text-sm ${
                pathname.startsWith(item.href)
                  ? "border-l-2 border-primary-container bg-surface-container text-primary-container"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="border-t border-outline-variant p-4">
          <LanguageSwitcher className="mb-4" />
          <p className="truncate text-xs text-on-surface-variant">{user.user.email}</p>
          <p className="truncate text-sm text-on-surface">{user.firm?.name}</p>
          <button
            type="button"
            onClick={() => logout().then(() => router.push("/"))}
            className="mt-2 text-xs text-primary-container hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {tc("signOut")}
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-outline-variant bg-surface/60 px-6 py-4 backdrop-blur md:hidden">
          <span className="font-[family-name:var(--font-headline)] text-primary">{tc("brand")}</span>
          <select
            className="bg-surface-container-low text-sm"
            value={pathname}
            onChange={(e) => router.push(e.target.value)}
            aria-label={ta("mobileNav")}
          >
            {NAV.map((n) => (
              <option key={n.href} value={n.href}>
                {t(n.labelKey)}
              </option>
            ))}
          </select>
        </header>
        <main id="main-content" className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
