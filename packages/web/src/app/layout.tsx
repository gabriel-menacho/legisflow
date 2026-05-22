import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { SkipLink } from "@/components/ui/skip-link";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
            <AuthProvider>
              <ToastProvider>
                <SkipLink />
                {children}
                <CookieBanner />
              </ToastProvider>
            </AuthProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
