"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ta = useTranslations("a11y");

  const links = [
    { href: "/#solutions", label: t("solutions") },
    { href: "/#use-cases", label: t("useCases"), active: true },
    { href: "/#process", label: t("process") },
    { href: "/#metrics", label: t("metrics") },
    { href: "/login", label: t("signIn") },
  ];

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-primary/20 bg-surface/60 px-8 py-4 backdrop-blur-md" aria-label={ta("mainNav")}>
      <Link
        href="/"
        className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-tighter text-primary"
      >
        {tc("brand")}
      </Link>
      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              l.active
                ? "border-b-2 border-primary pb-1 font-semibold text-primary"
                : "text-on-surface-variant hover:text-primary"
            }
          >
            {l.label}
          </Link>
        ))}
        <LanguageSwitcher />
      </div>
      <Button href="/book" className="hidden md:inline-flex">
        {t("consultNow")}
      </Button>
      <button
        type="button"
        className="text-primary md:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? ta("closeMenu") : ta("openMenu")}
      >
        <Icon name="menu" />
      </button>
      {open && (
        <div className="absolute left-0 top-full w-full border-b border-outline-variant bg-surface-container-low p-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Button href="/book">{t("consultNow")}</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
