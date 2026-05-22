import { LeadForm } from "@/components/marketing/lead-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Icon } from "@/components/ui/icon";
import { getTranslations } from "next-intl/server";

export default async function BookPage() {
  const t = await getTranslations("marketing");

  return (
    <div className="relative min-h-screen">
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <MarketingNav />
      <main id="main-content" className="flex min-h-screen items-center justify-center px-8 pb-12 pt-24">
        <div className="glass-panel-active w-full max-w-lg p-12 text-center">
          <Icon name="calendar_month" className="mb-4 text-5xl text-primary-container" />
          <h1 className="mb-2 font-[family-name:var(--font-headline)] text-3xl text-white">{t("bookTitle")}</h1>
          <p className="mb-8 italic text-on-surface-variant">{t("bookSubtitle")}</p>
          <LeadForm />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
