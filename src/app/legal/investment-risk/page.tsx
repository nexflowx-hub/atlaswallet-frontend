import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Investment Risk" };

export default function InvestmentRiskPage() {
  return (
    <LegalPage
      title="Investment Risk"
      intro="Investment opportunities available via AtlasWallet are private opportunities, subject to product terms, jurisdiction and account eligibility. This page summarizes the principal risks specific to investments."
      sections={[
        {
          h: "Eligibility",
          body: [
            "Each opportunity has minimum ticket requirements (e.g. AtlasMobility starts at R$ 25.000). Eligibility is evaluated per opportunity, jurisdiction and account profile. Meeting the minimum does not guarantee eligibility.",
          ],
        },
        {
          h: "Capital at risk",
          body: [
            "The full invested amount is at risk. You may lose some or all of your investment. Returns are not assured. Past performance does not predict future results.",
          ],
        },
        {
          h: "Liquidity & redemption",
          body: [
            "Private opportunities have redemption notice periods (e.g. AtlasMobility: 30 days). You may not be able to exit immediately. Redemption requests may be subject to available liquidity and may be delayed or refused under defined conditions.",
          ],
        },
        {
          h: "Product-specific risk",
          body: [
            "AtlasMobility: internal monthly rate (3.33%) is a configuration value, not a guaranteed return. Public return wording is shown only after legally approved product configuration.",
            "Atlas Real Estate: each opportunity (e.g. Praia do Lago, Encanto das Águas) has its own key terms, risk acknowledgement and documents. Read each opportunity's documents carefully before subscribing.",
          ],
        },
        {
          h: "Cross-allocation",
          body: [
            "Eligible AtlasMobility distributions can be allocated toward an eligible Atlas Real Estate payment plan. Positions and contracts are kept separate, with explicit allocation instructions — never automatic.",
          ],
        },
        {
          h: "Tax",
          body: [
            "Tax treatment depends on your jurisdiction and individual circumstances. AtlasWallet does not provide tax advice. Consult a qualified tax advisor for your situation.",
          ],
        },
        {
          h: "Documentation",
          body: [
            "Each subscription requires explicit acknowledgement of: eligibility, key terms, risk disclosure, documents and fee breakdown. Documents are provided per opportunity before confirmation.",
          ],
        },
      ]}
    />
  );
}
