"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/marketing/lead-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const INTEGRATIONS = [
  { icon: "hub", name: "n8n" },
  { icon: "code", name: "Python" },
  { icon: "memory", name: "OpenAI" },
  { icon: "folder_managed", name: "Clio" },
  { icon: "description", name: "DocuSign" },
];

export function LandingPage() {
  const t = useTranslations("marketing");

  const useCases = [
    { icon: "account_tree", title: t("useCase1Title"), desc: t("useCase1Desc"), tags: ["WEBHOOKS", "NLP"] },
    { icon: "contract", title: t("useCase2Title"), desc: t("useCase2Desc"), tags: ["LLM", "TEMPLATING"] },
    { icon: "summarize", title: t("useCase3Title"), desc: t("useCase3Desc"), tags: ["OCR", "VECTOR DB"] },
  ];

  const steps = [
    { n: 1, title: t("step1Title"), desc: t("step1Desc") },
    { n: 2, title: t("step2Title"), desc: t("step2Desc") },
    { n: 3, title: t("step3Title"), desc: t("step3Desc") },
    { n: 4, title: t("step4Title"), desc: t("step4Desc") },
    { n: 5, title: t("step5Title"), desc: t("step5Desc") },
  ];

  const problemItems = [0, 1, 2].map((i) => t(`problemItems.${i}`));
  const solutionItems = [0, 1, 2].map((i) => t(`solutionItems.${i}`));

  return (
    <>
      <div className="data-stream-bg pointer-events-none fixed inset-0 z-[-1] opacity-50" aria-hidden />
      <MarketingNav />
      <main id="main-content" className="pt-[100px]">
        <section className="mx-auto grid min-h-[600px] max-w-7xl grid-cols-1 items-center gap-4 px-8 py-12 md:grid-cols-12">
          <div className="relative min-h-[400px] md:col-span-5">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" aria-hidden />
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
              alt={t("heroImageAlt")}
              fill
              className="object-cover contrast-125 grayscale sepia hue-rotate-60"
              priority
            />
          </div>
          <div className="relative z-20 flex flex-col justify-center md:col-span-7">
            <div className="glass-panel relative p-8 md:p-12">
              <div className="absolute left-0 top-0 h-px w-full bg-primary-container shadow-[0_0_10px_#A1E56B]" aria-hidden />
              <div className="mb-6 inline-flex items-center gap-2 border border-outline-variant bg-surface px-3 py-1">
                <Icon name="terminal" className="text-[16px] text-primary-container" />
                <span className="font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-primary-container">
                  {t("heroBadge")}
                </span>
              </div>
              <h1 className="mb-4 font-[family-name:var(--font-headline)] text-4xl font-bold leading-tight tracking-tight text-primary-container md:text-5xl">
                {t("heroTitle")}
              </h1>
              <h2 className="mb-4 text-2xl font-extrabold italic text-white">{t("heroSubtitle")}</h2>
              <p className="mb-8 max-w-2xl text-base font-light italic text-on-surface-variant">{t("heroBody")}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button href="/book">
                  <Icon name="bolt" className="text-[18px]" /> {t("initiateConsultation")}
                </Button>
                <Button href="/#metrics" variant="ghost">
                  <Icon name="monitoring" className="text-[18px]" /> {t("viewMetrics")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-outline-variant bg-surface-container-low py-12">
          <div className="mx-auto max-w-7xl px-8 text-center">
            <p className="mb-4 font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-on-surface-variant">
              {t("integrationsTitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70 grayscale">
              {INTEGRATIONS.map((i) => (
                <div key={i.name} className="flex items-center gap-2 font-[family-name:var(--font-headline)] text-lg">
                  <Icon name={i.icon} /> {i.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="mx-auto max-w-7xl px-8 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="glass-panel relative overflow-hidden border-t border-error/50 p-8">
              <span className="absolute right-0 top-0 bg-error/10 px-3 py-1 font-[family-name:var(--font-headline)] text-xs uppercase text-error">
                {t("problemStatus")}
              </span>
              <h3 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-headline)] text-xl text-error">
                <Icon name="warning" /> {t("problemTitle")}
              </h3>
              <ul className="space-y-4 text-on-surface-variant">
                {problemItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="close" className="mt-1 shrink-0 text-error" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel-active relative overflow-hidden p-8">
              <span className="absolute right-0 top-0 bg-primary-container/10 px-3 py-1 font-[family-name:var(--font-headline)] text-xs uppercase text-primary-container">
                {t("solutionStatus")}
              </span>
              <h3 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-headline)] text-xl text-primary-container">
                <Icon name="verified" /> {t("solutionTitle")}
              </h3>
              <ul className="space-y-4 text-on-surface-variant">
                {solutionItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="check" className="mt-1 shrink-0 text-primary-container" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="circuit-divider mx-auto my-12 max-w-7xl px-8" aria-hidden />

        <section id="use-cases" className="mx-auto max-w-7xl px-8 py-12">
          <span className="mb-1 block font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-primary-container">
            {t("useCasesTag")}
          </span>
          <h2 className="mb-12 font-[family-name:var(--font-headline)] text-3xl text-on-surface">{t("useCasesTitle")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {useCases.map((uc) => (
              <div key={uc.title} className="glass-panel group p-8 transition-colors hover:border-primary-container">
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-outline-variant bg-surface-container-high group-hover:border-primary-container">
                  <Icon name={uc.icon} className="group-hover:text-primary-container" />
                </div>
                <h3 className="mb-2 font-semibold text-on-surface">{uc.title}</h3>
                <p className="mb-4 text-sm italic text-on-surface-variant">{uc.desc}</p>
                <div className="flex gap-2">
                  {uc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-outline-variant bg-surface px-2 py-0.5 font-[family-name:var(--font-headline)] text-[10px] text-primary-container"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="border-y border-outline-variant bg-surface-container-low py-12">
          <div className="mx-auto max-w-7xl px-8">
            <div className="mb-12 text-center">
              <span className="mb-1 block font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-primary-container">
                {t("processTag")}
              </span>
              <h2 className="font-[family-name:var(--font-headline)] text-3xl text-on-surface">{t("processTitle")}</h2>
            </div>
            <div className="relative flex flex-col justify-between gap-8 md:flex-row">
              <div className="absolute left-12 right-12 top-6 hidden h-px bg-outline-variant md:block" aria-hidden />
              {steps.map((s, i) => (
                <div key={s.n} className="relative z-10 mx-auto flex max-w-[200px] flex-col items-center text-center md:mx-0">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center font-[family-name:var(--font-headline)] bg-surface ${
                      i === 0
                        ? "border border-primary-container text-primary-container shadow-[0_0_15px_rgba(161,229,107,0.2)]"
                        : "border border-outline-variant text-on-surface-variant"
                    }`}
                  >
                    {s.n}
                  </div>
                  <h4 className="mb-1 font-semibold text-on-surface">{s.title}</h4>
                  <p className="text-sm italic text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="metrics" className="mx-auto max-w-7xl px-8 py-12">
          <span className="mb-1 block font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest text-primary-container">
            {t("metricsTag")}
          </span>
          <h2 className="mb-12 font-[family-name:var(--font-headline)] text-3xl text-on-surface">{t("metricsTitle")}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MetricCard
              title={t("metric1Title")}
              focus={t("metric1Focus")}
              before={t("metric1Before")}
              after={t("metric1After")}
              beforeDesc={t("metric1BeforeDesc")}
              afterDesc={t("metric1AfterDesc")}
              legacyLabel={t("legacy")}
            />
            <MetricCard
              title={t("metric2Title")}
              focus={t("metric2Focus")}
              before={t("metric2Before")}
              after={t("metric2After")}
              beforeDesc={t("metric2BeforeDesc")}
              afterDesc={t("metric2AfterDesc")}
              legacyLabel={t("legacy")}
            />
          </div>
        </section>

        <section className="mx-auto mb-12 max-w-4xl px-8 py-12">
          <div className="glass-panel-active relative overflow-hidden p-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(161,229,107,0.1),transparent)]" aria-hidden />
            <Icon name="power_settings_new" className="mb-4 text-5xl text-primary-container" />
            <h2 className="mb-2 font-[family-name:var(--font-headline)] text-4xl text-white">{t("ctaTitle")}</h2>
            <p className="mx-auto mb-8 max-w-lg italic text-on-surface-variant">{t("ctaBody")}</p>
            <LeadForm />
            <p className="mt-4 font-[family-name:var(--font-headline)] text-[10px] uppercase tracking-widest text-on-surface-variant">
              {t("ctaFooter")}
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

function MetricCard({
  title,
  focus,
  before,
  after,
  beforeDesc,
  afterDesc,
  legacyLabel,
}: {
  title: string;
  focus: string;
  before: string;
  after: string;
  beforeDesc: string;
  afterDesc: string;
  legacyLabel: string;
}) {
  const tc = useTranslations("common");

  return (
    <div className="glass-panel border-t-2 border-t-primary-container p-8">
      <div className="mb-6 flex justify-between border-b border-outline-variant pb-4">
        <div>
          <h3 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">{title}</h3>
          <p className="font-[family-name:var(--font-headline)] text-xs uppercase text-on-surface-variant">{focus}</p>
        </div>
        <Icon name="data_usage" className="text-primary-container" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-error/20 bg-surface/50 p-4">
          <span className="mb-1 block font-[family-name:var(--font-headline)] text-xs uppercase text-error">{legacyLabel}</span>
          <span className="font-[family-name:var(--font-headline)] text-3xl text-error line-through">{before}</span>
          <p className="mt-2 text-xs text-on-surface-variant">{beforeDesc}</p>
        </div>
        <div className="border border-primary-container/30 bg-primary-container/10 p-4">
          <span className="mb-1 block font-[family-name:var(--font-headline)] text-xs uppercase text-primary-container">
            {tc("brand")}
          </span>
          <span className="font-[family-name:var(--font-headline)] text-3xl text-primary-container">{after}</span>
          <p className="mt-2 text-xs text-on-surface-variant">{afterDesc}</p>
        </div>
      </div>
    </div>
  );
}
