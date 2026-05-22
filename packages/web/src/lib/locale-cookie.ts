import type { Locale } from "@/i18n/config";

export const LOCALE_COOKIE = "legisflow_locale";
export const LOCALE_QUERY_PARAM = "locale";
export const CONSENT_COOKIE = "legisflow_cookie_consent";

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function consentCookieValue(value: "accepted" | "rejected"): string {
  return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}
