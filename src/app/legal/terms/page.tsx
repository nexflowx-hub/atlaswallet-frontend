import { LegalPage } from "@/components/legal/legal-page";
import { institutionalConfig } from "@/config/institutional-config";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      effective={new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
      intro={`These Terms of Use govern your access to and use of ${institutionalConfig.project.productName} services. By creating an account or using any part of the service, you agree to these terms.`}
      sections={[
        {
          h: "Eligibility",
          body: [
            "You must be at least 18 years old and have the legal capacity to enter into these Terms in your jurisdiction of residence. By using the service, you represent that you are not prohibited from doing so under applicable sanctions, anti-money-laundering or counter-terrorism-financing rules.",
          ],
        },
        {
          h: "Account access",
          body: [
            "You are responsible for maintaining the confidentiality of your password and for all activity under your account. AtlasWallet will never request your password, seed phrase or private keys.",
            "We may suspend or restrict access where required by law, regulation, risk policy, or where we suspect unauthorized or prohibited use.",
          ],
        },
        {
          h: "Permitted use",
          list: [
            "Personal, non-commercial use of your account",
            "Operations explicitly enabled by your effective capabilities",
            "Compliance with applicable jurisdiction rules and tax obligations",
            "Truthful self-declared profile information when requested",
          ],
        },
        {
          h: "Provider dependency",
          body: [
            "AtlasWallet depends on third-party providers for payment rails, crypto networks and other services. Provider availability, network conditions and route eligibility may affect operations.",
            "Provider maintenance is shown as a neutral retryable state — never as a failure of AtlasWallet itself.",
          ],
        },
        {
          h: "Fees",
          body: [
            "Fees are operation-specific and come from the authoritative backend quote or transaction snapshot. The BLACK_30 commercial tier feePercent is not a universal operation fee.",
            "We never hide fees. Gross amount, Atlas service fee, provider/network fee, FX rate/spread and net result are shown before you confirm any operation.",
          ],
        },
        {
          h: "Transactions",
          body: [
            "Transactions are subject to backend authorization, quote validity and capability checks. Stale quotes cannot be executed. We may reverse, adjust or block transactions where required by law, regulation, or to prevent fraud.",
          ],
        },
        {
          h: "Restrictions",
          list: [
            "No use for illegal, fraudulent or sanctioned activity",
            "No market manipulation, layering or spoofing",
            "No reverse engineering, scraping or automated abuse",
            "No transfer of account access to third parties",
          ],
        },
        {
          h: "Liability",
          body: [
            "To the maximum extent permitted by law, AtlasWallet provides the service on an 'as is' and 'as available' basis. We do not guarantee uninterrupted or error-free operation, and we are not liable for indirect or consequential losses except where required by law.",
          ],
        },
        {
          h: "Availability",
          body: [
            "Product availability depends on jurisdiction, eligibility and applicable provider requirements. No authorization, license or guarantee is rendered unless verified and configured.",
          ],
        },
        {
          h: "Complaints",
          body: [
            "Complaints are handled per our Complaints Policy. See the Complaints page for the full process and escalation path.",
          ],
        },
        {
          h: "Termination",
          body: [
            "You may close your account at any time, subject to settlement of pending transactions. We may terminate or suspend access where required by law, regulation, or these Terms.",
          ],
        },
      ]}
    />
  );
}
