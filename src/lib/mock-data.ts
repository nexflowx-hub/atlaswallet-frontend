/**
 * AtlasWallet — Demo data.
 *
 * PURPOSE: showcase the frontend UX only when explicit demo auth is enabled.
 * Real /api/v1 state always takes precedence and demo values never represent
 * provider, ledger or wallet state in production.
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
      network: "NONE",
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
      network: "NONE",
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
      network: "NONE",
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
      network: "NONE",
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
      code: "USDT_ETHEREUM",
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
      code: "USDC_SOLANA",
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
      code: "BTC_BITCOIN",
      symbol: "₿",
      name: "Bitcoin",
      type: "CRYPTO",
      network: "BITCOIN",
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
      code: "ETH_ETHEREUM",
      symbol: "Ξ",
      name: "Ether",
      type: "CRYPTO",
      network: "ETHEREUM",
      decimals: 18,
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
  accountId: "demo-account",
  accountStatus: "ACTIVE",
  identityLevel: "SELF_DECLARED",
  kycStatus: "NOT_STARTED",
  pricingPlan: {
    code: "BLACK_30",
    label: "Atlas Black 30",
    active: true,
  },
  policyProfile: {
    code: "BLACK_ENTRY_OPEN",
    label: "Black Entry (Open)",
    operationalMode: "OPEN",
    active: true,
  },
  controls: {
    systemMoneyMovementEnabled: false,
    activeProviderCount: 0,
    executionGate: false,
  },
  requestedCapabilities: {
    fiatDeposit: true,
    fiatWithdrawal: true,
    cryptoDeposit: true,
    cryptoWithdrawal: true,
    exchange: true,
    internalTransfer: true,
    investment: false,
  },
  effectiveCapabilities: {
    fiatDeposit: false,
    fiatWithdrawal: false,
    cryptoDeposit: false,
    cryptoWithdrawal: false,
    exchange: false,
    internalTransfer: false,
    investment: false,
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
    description: "PIX deposit (illustrative)",
  },
  {
    id: "a_002",
    type: "EXCHANGE",
    status: "COMPLETED",
    amount: "1000.00",
    assetCode: "USDT_ETHEREUM",
    network: "ETHEREUM",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    description: "USD → USDT exchange (illustrative)",
  },
  {
    id: "a_003",
    type: "DEPOSIT",
    status: "COMPLETED",
    amount: "0.02500000",
    assetCode: "BTC_BITCOIN",
    network: "BITCOIN",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    description: "Bitcoin receive (illustrative)",
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
