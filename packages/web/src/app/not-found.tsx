import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("portal.notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <h1 className="mb-4 font-[family-name:var(--font-headline)] text-6xl text-primary-container">404</h1>
      <p className="mb-8 text-on-surface-variant">{t("title")}</p>
      <Link
        href="/"
        className="bg-primary-container px-6 py-3 text-on-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("back")}
      </Link>
    </div>
  );
}
