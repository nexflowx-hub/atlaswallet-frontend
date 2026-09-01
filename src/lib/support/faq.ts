/**
 * AtlasWallet — FAQ knowledge base.
 *
 * Used by:
 * - /support page (search interface)
 * - Atlas AI assistant (knowledge source for general queries)
 * - Site search
 *
 * Categories: Money, Crypto, Exchange, Investments, Security, Account, Profile.
 * NEVER include user-specific financial data here — this is public knowledge.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "Money" | "Crypto" | "Exchange" | "Investments" | "Security" | "Account" | "Profile";
  tags: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "money-pix",
    question: "How do I add money with PIX?",
    answer:
      "PIX is the Brazilian instant payment rail. To add money via PIX, open your BRL wallet, tap Receive or Add Money, and use the displayed PIX key (CPF, email, phone or random key). PIX eligibility is governed by backend policy and your effective capabilities — never assumed by country alone.",
    category: "Money",
    tags: ["pix", "deposit", "brl", "brazil"],
  },
  {
    id: "money-sepa",
    question: "How do I add money via SEPA bank transfer?",
    answer:
      "For EUR deposits, SEPA transfers are supported. Open your EUR wallet, tap Receive or Add Money, and use the displayed IBAN, BIC/SWIFT and reference. SEPA Instant is supported when both your bank and the route allow it; standard SEPA settles within 1 business day.",
    category: "Money",
    tags: ["sepa", "iban", "eur", "bank transfer", "deposit"],
  },
  {
    id: "money-multi-currency",
    question: "Which currencies does AtlasWallet support?",
    answer:
      "AtlasWallet prepares wallets for BRL (Brazilian Real), EUR (Euro), USD (US Dollar) and GBP (Pound Sterling). Each wallet is asset-and-network specific, with availability gated by backend policy, provider and route eligibility.",
    category: "Money",
    tags: ["currencies", "brl", "eur", "usd", "gbp"],
  },
  {
    id: "crypto-receive",
    question: "How do I receive crypto?",
    answer:
      "Open the wallet for the asset you want to receive (e.g. USDT, USDC, BTC, ETH, SOL). Tap Receive. The displayed address is asset-and-network specific — only send that asset on that network. Sending other assets or networks may result in permanent loss.",
    category: "Crypto",
    tags: ["receive", "deposit", "address", "network"],
  },
  {
    id: "crypto-networks",
    question: "Which networks are supported for USDT and USDC?",
    answer:
      "USDT supports Ethereum, Tron and Solana networks. USDC supports Ethereum and Solana. Each network wallet is separate — balances and addresses are network-specific.",
    category: "Crypto",
    tags: ["usdt", "usdc", "network", "ethereum", "tron", "solana"],
  },
  {
    id: "crypto-buy",
    question: "Can I buy crypto directly on AtlasWallet?",
    answer:
      "Yes, eligible accounts can use Buy Crypto to convert fiat (BRL, EUR, USD, GBP) into supported digital assets. Each conversion requires an authoritative backend quote before confirmation: gross, Atlas fee, provider/network fee, FX rate and net amount are shown up-front.",
    category: "Crypto",
    tags: ["buy", "fiat", "convert", "onramp"],
  },
  {
    id: "exchange-quote",
    question: "How does the exchange quote work?",
    answer:
      "Every conversion starts with an authoritative backend quote. You see: gross amount, Atlas service fee, provider/network fee, FX rate/spread when applicable, net receive amount and quote expiry. No final fee calculation is performed solely in the browser. Stale quotes cannot be executed.",
    category: "Exchange",
    tags: ["quote", "fee", "rate", "convert"],
  },
  {
    id: "exchange-black30-fee",
    question: "Is BLACK_30 my exchange fee?",
    answer:
      "No. BLACK_30 is a commercial pricing tier, not a universal operation fee. Operation-specific fees come from the backend quote/transaction snapshot. Fees are never hidden — gross, Atlas service fee, provider/network fee and net are all shown before confirmation.",
    category: "Exchange",
    tags: ["black_30", "fee", "tier"],
  },
  {
    id: "invest-atlasmobility",
    question: "What is AtlasMobility?",
    answer:
      "AtlasMobility is a private mobility opportunity with a minimum ticket of R$ 25.000 and a 30-day redemption notice. Yield instructions support wallet distribution, reinvestment and cross-allocation. Public rate/return wording is shown only when supplied by legally approved product configuration. Capital is at risk and returns are not assured.",
    category: "Investments",
    tags: ["atlasmobility", "mobility", "investment", "redemption"],
  },
  {
    id: "invest-real-estate",
    question: "What is Atlas Real Estate?",
    answer:
      "Atlas Real Estate surfaces eligible Brazilian private real estate opportunities, including Praia do Lago and Encanto das Águas. Each opportunity is subject to product terms, jurisdiction and account eligibility, with its own key terms, risk acknowledgement and documents.",
    category: "Investments",
    tags: ["real estate", "praia do lago", "encanto das aguas", "investment"],
  },
  {
    id: "invest-cross-allocation",
    question: "What is cross-allocation?",
    answer:
      "Eligible AtlasMobility distributions can be allocated toward an eligible Atlas Real Estate payment plan. Positions and contracts are kept separate, with explicit allocation instructions — never automatic. Each subscription remains a distinct position.",
    category: "Investments",
    tags: ["cross allocation", "yield", "distribute", "allocate"],
  },
  {
    id: "security-architecture",
    question: "How does AtlasWallet protect my data?",
    answer:
      "AtlasWallet separates authentication from financial authority. Supabase handles authentication and session. Financial state never lives in the frontend database — all balances, fees, quotes and capabilities come from the AtlasWallet Backend API at api.atlaswallet.org over HTTPS with the Supabase bearer token.",
    category: "Security",
    tags: ["security", "supabase", "backend", "auth"],
  },
  {
    id: "security-no-secrets",
    question: "Will AtlasWallet ever ask for my password or seed phrase?",
    answer:
      "Never. AtlasWallet support will never request passwords, seed phrases, private keys, 2FA codes or one-time passcodes. If anyone asks, do not respond — report it to support@atlaswallet.org immediately.",
    category: "Security",
    tags: ["security", "password", "seed phrase", "scam"],
  },
  {
    id: "security-2fa",
    question: "Does AtlasWallet support two-factor authentication?",
    answer:
      "Two-factor authentication is coming soon. When available, you can enable it from Settings → Security. We recommend enabling 2FA as soon as it's available to add an extra layer of protection to your account.",
    category: "Security",
    tags: ["2fa", "two-factor", "mfa", "security"],
  },
  {
    id: "account-black-tier",
    question: "What is the Atlas Black tier?",
    answer:
      "Atlas Black (currently Black 30) is a commercial pricing tier — it's not a verification status and not a fee. It reflects the fee schedule applied to your operations (visible in the quote breakdown, never as a universal flat fee). It's separate from Identity Level (currently Self-declared) and KYC status (currently Not started).",
    category: "Account",
    tags: ["black", "tier", "pricing", "plan"],
  },
  {
    id: "account-kyc-not-started",
    question: "Why does my profile say KYC: NOT_STARTED?",
    answer:
      "KYC NOT_STARTED simply means additional verification hasn't been requested yet for any operation. It is NOT a universal blocker — you can open an account and explore the portfolio immediately. As you initiate operations that require higher assurance, additional verification may be requested via backend policy.",
    category: "Account",
    tags: ["kyc", "verification", "identity"],
  },
  {
    id: "account-logout",
    question: "How do I log out?",
    answer:
      "Open the avatar menu in the top-right of the app header and select 'Log out'. On mobile, tap your avatar in the bottom navigation to access the menu.",
    category: "Account",
    tags: ["logout", "session", "sign out"],
  },
  {
    id: "profile-skip",
    question: "Can I skip profile completion?",
    answer:
      "Yes. Your profile is progressive and skippable — you don't need to complete it to use the portfolio. Missing fields are surfaced quietly on the Portfolio page. You can complete them at any time from the Profile section.",
    category: "Profile",
    tags: ["profile", "skip", "self-declared", "progressive"],
  },
  {
    id: "profile-self-declared",
    question: "What does 'self-declared' mean?",
    answer:
      "Self-declared means your profile information hasn't been independently verified by AtlasWallet or a third party. As you initiate operations that require higher assurance (e.g. fiat withdrawals, large transfers), additional verification may be requested via backend policy.",
    category: "Profile",
    tags: ["self-declared", "verified", "identity"],
  },
];

export function searchFaq(query: string): FaqItem[] {
  if (!query.trim()) return FAQ_ITEMS;
  const q = query.toLowerCase().trim();
  return FAQ_ITEMS.filter((item) => {
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export const FAQ_CATEGORIES = [
  "Money",
  "Crypto",
  "Exchange",
  "Investments",
  "Security",
  "Account",
  "Profile",
] as const;
