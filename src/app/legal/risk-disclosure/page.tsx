import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Risk Disclosure" };

export default function RiskDisclosurePage() {
  return (
    <LegalPage
      title="Risk Disclosure"
      intro="This Risk Disclosure explains the principal risks associated with using AtlasWallet services. It is not exhaustive. Capital is at risk and returns are not assured."
      sections={[
        {
          h: "Crypto risk",
          body: [
            "Digital assets are volatile. Prices can move significantly in short periods. Crypto networks may experience congestion, forks, or security incidents. You may lose some or all of your crypto balance due to network events, scams, or your own error (e.g. sending to the wrong address or wrong network).",
          ],
        },
        {
          h: "Liquidity risk",
          body: [
            "Some assets and products may have limited liquidity. You may not be able to sell, redeem or convert at the time or price you expect. Redemption notice periods apply to private opportunities.",
          ],
        },
        {
          h: "FX risk",
          body: [
            "Foreign exchange rates fluctuate. Conversions may result in a loss if the rate moves against you between quote and execution. FX spreads are shown in the quote breakdown.",
          ],
        },
        {
          h: "Provider & counterparty risk",
          body: [
            "AtlasWallet depends on third-party providers for payment rails, crypto networks and other services. A provider's failure, insolvency, regulatory action or service interruption may affect your operations. Provider maintenance is shown as a neutral retryable state.",
          ],
        },
        {
          h: "Private investments",
          body: [
            "Private opportunities — including AtlasMobility and Atlas Real Estate — are subject to product terms, jurisdiction and account eligibility. Past performance does not predict future results. Returns are not assured. Lock-up periods and redemption notice periods apply.",
            "Public rate/return wording is shown only when supplied by legally approved product configuration.",
          ],
        },
        {
          h: "Capital at risk",
          body: [
            "Your capital is at risk. The value of your portfolio can go down as well as up. You may lose some or all of the invested amount. Never invest more than you can afford to lose.",
          ],
        },
        {
          h: "Returns not assured",
          body: [
            "No rate, yield or return is guaranteed unless legally approved product configuration explicitly enables that claim. Illustrative figures are clearly labelled and never represent a real or implied guarantee.",
          ],
        },
      ]}
    />
  );
}
