/**
 * AtlasWallet — Backend API types.
 * Mirrors https://api.atlaswallet.org core models. Authoritative.
 */

export type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export type IdentityLevel =
  | "SELF_DECLARED"
  | "BASIC"
  | "VERIFIED"
  | "ENHANCED";

export type PricingPlanCode = "BLACK_30" | "BLACK_60" | "STANDARD";

export type AccountStatus =
  | "PENDING_PROVISIONING"
  | "ACTIVE"
  | "SUSPENDED"
  | "CLOSED";

export type WalletStatus = "ACTIVE" | "FROZEN" | "PENDING" | "CLOSED";

export type AssetType = "FIAT" | "CRYPTO";

export type NetworkCode =
  | "ETHEREUM"
  | "TRON"
  | "SOLANA"
  | "POLYGON"
  | "BSC"
  | "PIX"
  | "SEPA"
  | "SWIFT"
  | "DOMESTIC";

export interface AssetInfo {
  code: string;
  symbol: string;
  name: string;
  type: AssetType;
  network: NetworkCode;
  decimals: number;
  depositEnabled: boolean;
  withdrawEnabled: boolean;
  exchangeEnabled: boolean;
}

export interface WalletBalance {
  available: string; // decimal string
  pending: string;
  reserved: string;
  blocked: string;
}

export interface Wallet {
  id: string;
  status: WalletStatus;
  asset: AssetInfo;
  balance: WalletBalance;
}

export interface ProfileCompletion {
  percent: number;
  complete: boolean;
  missingFields: string[];
}

export interface Profile {
  source: "SELF_DECLARED";
  verified: boolean;
  canSkip: boolean;
  completion: ProfileCompletion;
  profile: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationalityCountryCode?: string;
    residenceCountryCode?: string;
    phoneE164?: string;
  } | null;
}

export interface PricingPlan {
  code: PricingPlanCode;
  label: string;
  feePercent?: number; // BLACK_30 commercial tier — NOT a universal operation fee
}

export interface PolicyProfile {
  code: string;
  label: string;
}

export interface AccountInfo {
  status: AccountStatus;
  kycStatus: KycStatus;
  identityLevel: IdentityLevel;
  baseCurrency: string;
  pricingPlan: PricingPlan;
  policyProfile: PolicyProfile;
}

export interface Me {
  provisioned: boolean;
  account: AccountInfo;
}

export interface CapabilityControls {
  systemMoneyMovementEnabled: boolean;
  activeProviderCount: number;
  executionGate: "OPEN" | "PAUSED" | "MAINTENANCE";
}

export interface Capabilities {
  moneyDeposit: boolean;
  moneyWithdraw: boolean;
  cryptoDeposit: boolean;
  cryptoWithdraw: boolean;
  exchange: boolean;
  investSubscription: boolean;
  investRedemption: boolean;
}

export interface AccountAccess {
  controls: CapabilityControls;
  requestedCapabilities: Capabilities;
  effectiveCapabilities: Capabilities;
}

// Planned MVP endpoints (interfaces prepared; backend may not exist yet)
export interface PortfolioSummary {
  totalBaseCurrency: string;
  baseCurrency: string;
  history?: { ts: string; value: string }[];
}

export interface ActivityItem {
  id: string;
  type:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "EXCHANGE"
    | "INVESTMENT_SUBSCRIPTION"
    | "INVESTMENT_REDEMPTION"
    | "FEE"
    | "ADJUSTMENT";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  amount: string;
  assetCode: string;
  network?: NetworkCode;
  createdAt: string;
  description: string;
}

export interface ExchangeQuote {
  id: string;
  payAsset: string;
  payAmount: string;
  receiveAsset: string;
  receiveAmount: string;
  rate: string;
  atlasFee: string;
  providerNetworkFee: string;
  net: string;
  expiresAt: string;
}

export interface InvestmentProduct {
  code: string;
  name: string;
  category: string;
  minimumBRL?: number;
  maximum?: number | null;
  internalMonthlyRatePct?: number;
  redemptionNoticeDays?: number;
  yieldInstructions?: ("WALLET" | "REINVEST" | "ALLOCATE")[];
  publicLegalState: "REVIEW_REQUIRED" | "ENABLED" | "DISABLED";
  rule?: string;
  examples?: string[];
}

export interface InvestmentPosition {
  id: string;
  productCode: string;
  productName: string;
  principalBRL: string;
  currentValueBRL: string;
  status: "ACTIVE" | "PENDING" | "REDEEMING" | "CLOSED";
  openedAt: string;
}

// API error normalization
export interface ApiError {
  status: number;
  code: string;
  message: string;
  requestId?: string;
  retriable: boolean;
}
