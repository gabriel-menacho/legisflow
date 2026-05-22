import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./i18n/config";
import { COOKIE_MAX_AGE, LOCALE_COOKIE, LOCALE_QUERY_PARAM } from "./lib/locale-cookie";

/**
 * Locale cookie + ?locale= handling only.
 * We do NOT use next-intl's createMiddleware here — it rewrites to /es, /en paths
 * which require app/[locale]/ and breaks routes when localePrefix is "never".
 * Locale for RSC is resolved in src/i18n/request.ts from the cookie.
 */
export default function middleware(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get(LOCALE_QUERY_PARAM);
  let locale = defaultLocale;

  if (isLocale(localeParam)) {
    locale = localeParam;
  } else {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (isLocale(cookieLocale)) {
      locale = cookieLocale;
    }
  }

  const response = NextResponse.next();

  if (isLocale(localeParam)) {
    response.cookies.set(LOCALE_COOKIE, localeParam, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  } else if (!request.cookies.get(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
