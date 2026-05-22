import { LegalPage } from "@/components/marketing/legal-page";

export default function TermsPage() {
  return (
    <LegalPage namespace="legal.terms" sectionKeys={["agreement", "usage", "liability"]} />
  );
}
