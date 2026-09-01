import { MarketingSubPage } from "@/components/marketing/marketing-sub-page";

export const metadata = { title: "Money — Multi-currency wallets" };

export default function MoneyPage() {
  return (
    <MarketingSubPage
      eyebrow="Money"
      title="Multi-currency wallets, ready for BRL, EUR, USD and GBP."
      subtitle="Hold and move supported fiat currencies with one account, transparent fees and a clear view of balances, pending and reserved amounts."
      cta={{ primary: "Open your account", secondary: "Compare features" }}
      sections={[
        {
          h: "Wallets that respect your jurisdiction",
          body: [
            "AtlasWallet prepares wallets for the currencies you actually use across the UK, EU and Brazil. Each wallet shows available, pending, reserved and blocked balances, with operations gated by backend policy, provider and route eligibility.",
            "Add money via PIX for BRL, SEPA for EUR, SWIFT for USD/GBP, or via supported crypto rails. Confirmations and quotes come from the backend — never fabricated.",
          ],
        },
        {
          h: "What you can do today",
          list: [
            "View available, pending, reserved and blocked balances",
            "Receive crypto deposits on supported networks (Ethereum, Solana, Tron)",
            "Request a deposit intent once the backend MVP endpoint is live",
            "Convert between supported assets with a backend-authoritative quote",
          ],
        },
        {
          h: "What is gated",
          body: [
            "Execution of fiat withdrawals, fiat-to-crypto buys and provider-routed deposits stays disabled until the backend capability is effective. The UI is ready and visible, with neutral retryable states during provider maintenance.",
          ],
        },
      ]}
    />
  );
}
