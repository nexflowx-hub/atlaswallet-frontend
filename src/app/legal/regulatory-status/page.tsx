import { LegalPage } from "@/components/legal/legal-page";
import { institutionalConfig } from "@/config/institutional-config";

export const metadata = { title: "Regulatory Status" };

export default function RegulatoryStatusPage() {
  return (
    <LegalPage
      title="Regulatory Status"
      intro="AtlasWallet presents its corporate and regulatory status transparently. We do not claim authorizations, licenses or guarantees that have not been verified and configured."
      sections={[
        {
          h: "Corporate identity",
          body: [
            `${institutionalConfig.entity.legalName} is a private limited company registered in ${institutionalConfig.entity.jurisdiction}.`,
            `Registered office: ${institutionalConfig.entity.registeredOffice}.`,
            `Company number: ${institutionalConfig.entity.companyNumberState.replace("_", " ")}. AtlasWallet never invents the Companies House number. The confirmed number will be populated globally before formal public production launch.`,
          ],
        },
        {
          h: "No invented licenses",
          body: [
            "AtlasWallet does not claim FCA, MiCA/CASP, BCB, CVM or any other authorization unless explicitly verified and configured.",
            "Where regulated services are provided by a third party, that provider is clearly attributed, and the authorization belongs to the provider — not to AtlasWallet.",
          ],
        },
        {
          h: "Third-party regulated service attribution",
          body: [
            "When a payment, crypto custody, exchange or investment service is provided by a regulated third party, the service description attributes the relevant authorization to that provider. We do not represent the third party's authorization as our own.",
          ],
        },
        {
          h: "Country & product availability",
          body: [
            `United Kingdom — ${institutionalConfig.regions.UK.regulatoryCopy}`,
            `EU/EEA — ${institutionalConfig.regions.EU_EEA.regulatoryCopy}`,
            `Brazil — ${institutionalConfig.regions.Brazil.regulatoryCopy}`,
            "Availability is jurisdiction, eligibility and provider-dependent. Where a product is not available in your jurisdiction, it is hidden or shown as 'Temporarily unavailable'.",
          ],
        },
        {
          h: "Investment availability",
          body: [
            "Investment opportunities are subject to product terms, jurisdiction and account eligibility. Public rate/return wording is shown only when supplied by legally approved product configuration. The internal 3.33% monthly rate is never presented publicly as guaranteed.",
          ],
        },
      ]}
    />
  );
}
