/**
 * AtlasWallet — Backend API types.
 *
 * These types mirror the currently deployed AtlasWallet API. Financial state is
 * authoritative in the backend; the browser must never invent provider, ledger,
 * wallet or capability state.
 */

export type KycStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type IdentityLevel =
  | "SELF_DECLARED"
  | "BASIC"
  | "VERIFIED"
  | "ENHANCED";

export type PricingPlanCode =
  | "BLACK_30"
  | "BLACK_25"
  | "BLACK_20"
  | "WHITE_15"
  | "WHITE_10"
  | "WHITE_05";

export type AccountStatus =
  | "PENDING"
  | "ACTIVE"
  | "RESTRICTED"
  | "SUSPENDED"
  | "CLOSED";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED";

export type WalletStatus = "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "CLOSED";

export type AssetType = "FIAT" | "CRYPTO" | "PRIVATE_ASSET" | "SECURITY";

/** Blockchain/asset network enum from the backend Prisma schema. */
export type NetworkCode = "NONE" | "BITCOIN" | "ETHEREUM" | "TRON" | "SOLANA";

export type OperationalMode = "OPEN" | "CONTROLLED" | "RESTRICTED";

export interface AssetInfo {
  id?: string;
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
  available: string;
  pending: string;
  reserved: string;
  blocked: string;
}

export interface Wallet {
  id: string;
  status: WalletStatus;
  asset: AssetInfo;
  balance: WalletBalance;
  createdAt?: string;
  updatedAt?: string;
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
  feeBasisPoints?: number;
  /** Display derivative returned by the backend. Not a universal operation fee. */
  feePercent?: number;
  active?: boolean;
}

export interface PolicyProfile {
  code: string;
  label: string;
  operationalMode?: OperationalMode;
  active?: boolean;
}

export interface AccountInfo {
  id?: string;
  type?: "INDIVIDUAL" | "BUSINESS" | "INTERNAL";
  status: AccountStatus;
  kycStatus: KycStatus;
  identityLevel: IdentityLevel;
  countryCode?: string | null;
  baseCurrency: string;
  pricingPlan: PricingPlan;
  policyProfile: PolicyProfile;
  createdAt?: string;
}

export interface Me {
  auth?: {
    id: string;
    email?: string | null;
  };
  provisioned: boolean;
  user?: {
    id: string;
    email?: string | null;
    status: UserStatus;
    createdAt?: string;
  } | null;
  account: AccountInfo | null;
}

export interface CapabilityControls {
  systemMoneyMovementEnabled: boolean;
  activeProviderCount: number;
  /** Global execution gate calculated server-side. */
  executionGate: boolean;
}

export interface Capabilities {
  fiatDeposit: boolean;
  fiatWithdrawal: boolean;
  cryptoDeposit: boolean;
  cryptoWithdrawal: boolean;
  exchange: boolean;
  internalTransfer: boolean;
  investment: boolean;
}

export interface AccountAccess {
  accountId: string;
  accountStatus: AccountStatus;
  identityLevel: IdentityLevel;
  kycStatus: KycStatus;
  pricingPlan: PricingPlan;
  policyProfile: PolicyProfile;
  controls: CapabilityControls;
  requestedCapabilities: Capabilities;
  effectiveCapabilities: Capabilities;
}

export interface BootstrapResponse {
  created: {
    user: boolean;
    account: boolean;
    wallets: number;
  };
  user: {
    id: string;
    authUserId: string;
    email?: string | null;
    status: UserStatus;
  };
  account: AccountInfo;
  wallets: Wallet[];
}

// Planned MVP endpoints (interfaces prepared; backend may not exist yet).
export interface PortfolioSummary {
  totalBaseCurrency: string;
  baseCurrency: string;
  history?: { ts: string; value: string }[];
}

/** Payment rails are not AssetNetwork values; keep them separate in planned activity UI. */
export type ActivityRail = "PIX" | "SEPA" | "SWIFT" | "DOMESTIC";

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
  network?: NetworkCode | ActivityRail;
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

export interface ApiError {
  status: number;
  code: string;
  message: string;
  requestId?: string;
  retriable: boolean;
}
