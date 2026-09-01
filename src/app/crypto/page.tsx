import { MarketingSubPage } from "@/components/marketing/marketing-sub-page";

export const metadata = { title: "Crypto — Digital assets on supported networks" };

export default function CryptoPage() {
  return (
    <MarketingSubPage
      eyebrow="Crypto"
      title="Manage supported digital assets on the networks that matter."
      subtitle="AtlasWallet surfaces supported digital assets and networks through AtlasWallet infrastructure and eligible providers — never fabricating balances, availability or provider reach."
      cta={{ primary: "Open your account", secondary: "See all products" }}
      sections={[
        {
          h: "Supported assets",
          body: [
            "Each wallet is asset-and-network specific. USDT can be held on Ethereum, Tron or Solana; USDC on Ethereum or Solana; BTC, ETH and SOL on their canonical networks.",
            "Deposit and withdrawal availability for each network is shown per wallet — never assumed. Provider maintenance surfaces as a neutral retryable state, not an error.",
          ],
        },
        {
          h: "Receive, send, exchange",
          list: [
            "Receive supported digital assets with a per-network address",
            "Send with a backend-authoritative fee and quote",
            "Convert fiat ↔ crypto and crypto ↔ crypto with a clear fee breakdown",
            "Quote expiry is enforced — stale quotes are never executed",
          ],
        },
        {
          h: "Provider-neutral",
          body: [
            "AtlasWallet never exposes internal provider codes. When a provider is in maintenance, the operation is shown as temporarily unavailable with a retry option — never fabricated as successful.",
          ],
        },
      ]}
    />
  );
}
