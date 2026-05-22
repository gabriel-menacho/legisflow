import { LegalPage } from "@/components/marketing/legal-page";

export default function SecurityPage() {
  return (
    <LegalPage namespace="legal.security" sectionKeys={["encryption", "access", "audit"]} />
  );
}
