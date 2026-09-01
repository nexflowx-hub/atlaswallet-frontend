import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Identity, AML & Financial Crime Controls" };

export default function AmlKycPage() {
  return (
    <LegalPage
      title="Identity, AML & Financial Crime Controls"
      intro="AtlasWallet applies risk-based identity and financial crime controls. KYC is not a universal frontend blocker; operation eligibility comes from backend policy, provider, route and risk rules."
      sections={[
        {
          h: "Self-declared entry",
          body: [
            "New accounts start with a self-declared identity (SELF_DECLARED) and KYC NOT_STARTED. You can open an account and explore the portfolio immediately — profile completion is progressive and skippable, never forced before portfolio access.",
          ],
        },
        {
          h: "Later provider / route / risk verification",
          body: [
            "As you initiate operations that require higher assurance (e.g. fiat withdrawals, large crypto transfers, investment subscriptions), additional verification may be requested via backend policy.",
            "Verification may be performed by a regulated third-party identity provider. The authorization belongs to that provider — not to AtlasWallet.",
          ],
        },
        {
          h: "Source of funds / wealth",
          body: [
            "For certain operations, jurisdictions or risk profiles, we may request evidence of source of funds or source of wealth. This is part of our AML/CTF obligations and is required to proceed with the operation.",
          ],
        },
        {
          h: "Restrictions for suspicious or prohibited activity",
          body: [
            "We may block, reverse, suspend or refuse operations where we suspect fraud, money laundering, terrorist financing, sanctions evasion, market manipulation, or other prohibited activity. We may report such activity to competent authorities where required by law.",
            "We may also restrict access where required by sanctions screening, adverse media, or other risk-based triggers.",
          ],
        },
        {
          h: "Sanctions screening",
          body: [
            "AtlasWallet screens against applicable sanctions lists. Matched or partially matched entries may result in account restriction pending review. Decisions are made on a risk-based approach.",
          ],
        },
        {
          h: "Reporting & cooperation",
          body: [
            "Where required by law, we cooperate with competent authorities including financial intelligence units, regulators and law enforcement. We may be prohibited from notifying you of certain reports.",
          ],
        },
      ]}
    />
  );
}
