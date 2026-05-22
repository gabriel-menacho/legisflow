import { LegalPage } from "@/components/marketing/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      namespace="legal.privacy"
      sectionKeys={["collection", "use", "retention", "contact"]}
      cookiesSection
    />
  );
}
