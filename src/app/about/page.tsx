import { MarketingSubPage } from "@/components/marketing/marketing-sub-page";
import { institutionalConfig } from "@/config/institutional-config";

export const metadata = { title: "About AtlasWallet" };

export default function AboutPage() {
  return (
    <MarketingSubPage
      eyebrow="About"
      title="One portfolio for money, crypto and eligible private investments."
      subtitle={institutionalConfig.project.positioning}
      cta={{ primary: "Open your account", secondary: "Read about security" }}
      sections={[
        {
          h: institutionalConfig.entity.legalName,
          body: [
            `Atlas Wallet Ltd is a private limited company registered in ${institutionalConfig.entity.jurisdiction}. Registered office: ${institutionalConfig.entity.registeredOffice}.`,
            "The Companies House number is pending confirmation — we never invent it. Once verified, the number is populated globally before formal public production launch.",
          ],
        },
        {
          h: "Built for the UK, EU and Brazil",
          body: [
            `United Kingdom — ${institutionalConfig.regions.UK.privacy}. ${institutionalConfig.regions.UK.regulatoryCopy}`,
            `EU/EEA — ${institutionalConfig.regions.EU_EEA.privacy}. ${institutionalConfig.regions.EU_EEA.regulatoryCopy}`,
            `Brazil — ${institutionalConfig.regions.Brazil.privacy}. ${institutionalConfig.regions.Brazil.regulatoryCopy}`,
          ],
        },
        {
          h: "Architecture principle",
          body: [
            "AtlasWallet separates authentication from financial authority. The frontend authenticates sessions with Supabase and renders state — it never writes authoritative balances, never holds provider secrets, and never fabricates success.",
            "All financial state, fees, quotes, capabilities, settlement and investment state come from the AtlasWallet Backend API at api.atlaswallet.org, called over HTTPS with the Supabase bearer token.",
          ],
        },
        {
          h: "Honest product boundaries",
          list: [
            "No fabricated metrics, testimonials or partner logos",
            "No invented company number, licenses or guarantees",
            "No public 3.33% monthly claim unless legally approved",
            "Planned operations stay disabled until backend endpoints exist",
          ],
        },
      ]}
    />
  );
}
