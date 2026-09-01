import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Acceptable Use" };

export default function AcceptableUsePage() {
  return (
    <LegalPage
      title="Acceptable Use"
      intro="This Acceptable Use policy sets out what you may and may not do with AtlasWallet. By using the service, you agree to comply with it."
      sections={[
        {
          h: "Permitted use",
          list: [
            "Use the service for personal, lawful purposes within your effective capabilities",
            "Provide truthful self-declared information",
            "Comply with applicable jurisdiction rules and tax obligations",
            "Maintain the confidentiality of your credentials",
            "Use the service in good faith and in accordance with these Terms",
          ],
        },
        {
          h: "Prohibited use",
          list: [
            "Use for illegal, fraudulent or sanctioned activity",
            "Money laundering, terrorist financing, sanctions evasion",
            "Market manipulation, layering, spoofing, wash trading",
            "Reverse engineering, scraping, automated abuse or DDoS",
            "Circumventing capability gates or backend policy",
            "Sharing account access, selling or transferring accounts",
            "Submitting false identity or source-of-funds information",
            "Using the service for or on behalf of a prohibited person or entity",
            "Uploading malware, phishing content or other harmful material",
            "Impersonating another person or entity",
          ],
        },
        {
          h: "Enforcement",
          body: [
            "We may restrict, suspend or terminate access where we suspect prohibited use. We may reverse, block or report transactions where required by law, regulation or risk policy.",
            "Where required, we cooperate with competent authorities including financial intelligence units, regulators and law enforcement.",
          ],
        },
        {
          h: "Reporting violations",
          body: [
            "If you become aware of a violation of this policy — including a security vulnerability, fraud or abuse — please report it to the support email. We will investigate and take appropriate action.",
          ],
        },
      ]}
    />
  );
}
