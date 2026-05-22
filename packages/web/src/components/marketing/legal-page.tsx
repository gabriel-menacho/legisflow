import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function LegalPage({
  namespace,
  sectionKeys,
  cookiesSection,
}: {
  namespace: "legal.privacy" | "legal.terms" | "legal.security";
  sectionKeys: string[];
  cookiesSection?: boolean;
}) {
  const t = await getTranslations(namespace);
  const tMarketing = await getTranslations("marketing");

  const sections = sectionKeys.map((key) => ({
    heading: t(`sections.${key}.heading`),
    body: t(`sections.${key}.body`),
  }));

  if (cookiesSection) {
    const tPrivacy = await getTranslations("legal.privacy");
    sections.unshift({
      heading: tPrivacy("cookiesHeading"),
      body: tPrivacy("cookiesBody"),
    });
  }

  return (
    <div className="relative min-h-screen">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <MarketingNav />
      <main id="main-content" className="mx-auto max-w-3xl px-8 pb-16 pt-28">
        <Link href="/" className="mb-8 inline-block text-sm text-primary-container hover:underline">
          {tMarketing("backHome")}
        </Link>
        <h1 className="mb-8 font-[family-name:var(--font-headline)] text-4xl text-primary-container">{t("title")}</h1>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section
              key={s.heading}
              id={i === 0 && cookiesSection ? "cookies" : undefined}
              className="glass-panel p-8"
            >
              <h2 className="mb-3 font-[family-name:var(--font-headline)] text-xl text-on-surface">{s.heading}</h2>
              <p className="text-on-surface-variant">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
