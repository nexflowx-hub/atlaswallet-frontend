/**
 * AtlasWallet — Demo data.
 *
 * PURPOSE: showcase the frontend UX in sandbox/preview when the backend is
 * unreachable or not configured. Clearly marked as illustrative.
 *
 * RULES (from spec):
 * - Never fabricate balances/transactions as if they were real backend state.
 * - Real /api/v1/wallets, /api/v1/me, /api/v1/profile take precedence.
 * - Demo data MUST be clearly labelled "Illustrative".
 */

import type {
  AccountAccess,
  ActivityItem,
  InvestmentPosition,
  InvestmentProduct,
  Profile,
  Wallet,
} from "@/lib/api/types";

export const DEMO_LABEL = "Illustrative interface";

export const demoWallets: Wallet[] = [
  {
    id: "w_brl_001",
    status: "ACTIVE",
    asset: {
      code: "BRL",
      symbol: "R$",
      name: "Brazilian Real",
      type: "FIAT",
      network: "PIX",
      decimals: 2,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "125780.50", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_eur_001",
    status: "ACTIVE",
    asset: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      type: "FIAT",
      network: "SEPA",
      decimals: 2,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "8420.00", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_usd_001",
    status: "ACTIVE",
    asset: {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      type: "FIAT",
      network: "SWIFT",
      decimals: 2,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "3250.00", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_gbp_001",
    status: "ACTIVE",
    asset: {
      code: "GBP",
      symbol: "£",
      name: "Pound Sterling",
      type: "FIAT",
      network: "SWIFT",
      decimals: 2,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "1180.00", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_usdt_eth_001",
    status: "ACTIVE",
    asset: {
      code: "USDT",
      symbol: "₮",
      name: "Tether USD",
      type: "CRYPTO",
      network: "ETHEREUM",
      decimals: 6,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "4500.00", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_usdc_sol_001",
    status: "ACTIVE",
    asset: {
      code: "USDC",
      symbol: "◎",
      name: "USD Coin",
      type: "CRYPTO",
      network: "SOLANA",
      decimals: 6,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "2200.00", pending: "0.00", reserved: "0.00", blocked: "0.00" },
  },
  {
    id: "w_btc_001",
    status: "ACTIVE",
    asset: {
      code: "BTC",
      symbol: "₿",
      name: "Bitcoin",
      type: "CRYPTO",
      network: "ETHEREUM",
      decimals: 8,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "0.08250000", pending: "0.00000000", reserved: "0.00000000", blocked: "0.00000000" },
  },
  {
    id: "w_eth_001",
    status: "ACTIVE",
    asset: {
      code: "ETH",
      symbol: "Ξ",
      name: "Ether",
      type: "CRYPTO",
      network: "ETHEREUM",
      decimals: 6,
      depositEnabled: true,
      withdrawEnabled: true,
      exchangeEnabled: true,
    },
    balance: { available: "1.245000", pending: "0.000000", reserved: "0.000000", blocked: "0.000000" },
  },
];

export const demoProfile: Profile = {
  source: "SELF_DECLARED",
  verified: false,
  canSkip: true,
  completion: {
    percent: 40,
    complete: false,
    missingFields: ["dateOfBirth", "nationalityCountryCode", "residenceCountryCode"],
  },
  profile: {
    firstName: "Alex",
    lastName: "Silva",
  },
};

export const demoAccess: AccountAccess = {
  controls: {
    systemMoneyMovementEnabled: false,
    activeProviderCount: 0,
    executionGate: "PAUSED",
  },
  requestedCapabilities: {
    moneyDeposit: true,
    moneyWithdraw: true,
    cryptoDeposit: true,
    cryptoWithdraw: true,
    exchange: true,
    investSubscription: true,
    investRedemption: true,
  },
  effectiveCapabilities: {
    moneyDeposit: false,
    moneyWithdraw: false,
    cryptoDeposit: true,
    cryptoWithdraw: false,
    exchange: false,
    investSubscription: false,
    investRedemption: false,
  },
};

export const demoActivity: ActivityItem[] = [
  {
    id: "a_001",
    type: "DEPOSIT",
    status: "PENDING",
    amount: "5000.00",
    assetCode: "BRL",
    network: "PIX",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    description: "PIX deposit (in processing)",
  },
  {
    id: "a_002",
    type: "EXCHANGE",
    status: "COMPLETED",
    amount: "1000.00",
    assetCode: "USDT",
    network: "ETHEREUM",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    description: "USD → USDT exchange",
  },
  {
    id: "a_003",
    type: "CRYPTO_DEPOSIT" as ActivityItem["type"],
    status: "COMPLETED",
    amount: "0.02500000",
    assetCode: "BTC",
    network: "ETHEREUM",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    description: "Bitcoin receive",
  },
];

export const demoInvestmentProducts: InvestmentProduct[] = [
  {
    code: "ATLAS_MOBILITY",
    name: "AtlasMobility",
    category: "Mobility",
    minimumBRL: 25000,
    maximum: null,
    internalMonthlyRatePct: 3.33,
    redemptionNoticeDays: 30,
    yieldInstructions: ["WALLET", "REINVEST", "ALLOCATE"],
    publicLegalState: "REVIEW_REQUIRED",
    rule: "Show rate/return wording only when supplied by legally approved product configuration.",
  },
  {
    code: "ATLAS_REAL_ESTATE",
    name: "Atlas Real Estate",
    category: "Real Assets",
    examples: ["Praia do Lago", "Encanto das Águas", "Other available opportunities"],
    publicLegalState: "REVIEW_REQUIRED",
  },
];

export const demoInvestmentPositions: InvestmentPosition[] = [];

/** Build a synthetic portfolio history for illustrative chart only. */
export function buildIllustrativeHistory(days = 30, start = 110000, end = 142500) {
  const out: { ts: string; value: number }[] = [];
  const now = Date.now();
  const step = (end - start) / days;
  for (let i = days; i >= 0; i--) {
    const noise = Math.sin(i / 3) * 1500 + (Math.random() - 0.5) * 1200;
    const value = Math.max(start, start + (days - i) * step + noise);
    out.push({ ts: new Date(now - i * 86400000).toISOString(), value: Math.round(value * 100) / 100 });
  }
  return out;
}
