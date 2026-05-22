"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext } from "react";
import type { Locale } from "@/i18n/config";
import { LOCALE_QUERY_PARAM, localeCookieValue } from "@/lib/locale-cookie";

type LocaleContextValue = {
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLocale = useCallback(
    (locale: Locale) => {
      document.cookie = localeCookieValue(locale);
      const params = new URLSearchParams(searchParams.toString());
      params.set(LOCALE_QUERY_PARAM, locale);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
      router.refresh();
    },
    [router, pathname, searchParams],
  );

  return (
    <LocaleContext.Provider value={{ setLocale }}>{children}</LocaleContext.Provider>
  );
}

export function useSetLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useSetLocale must be used within LocaleProvider");
  return ctx.setLocale;
}
