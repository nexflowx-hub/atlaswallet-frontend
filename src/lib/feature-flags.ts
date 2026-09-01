/**
 * AtlasWallet — Feature flags.
 * Browser-safe values only. Toggle UI surfaces; never bypass backend policy.
 */

export const featureFlags = {
  exchange: process.env.NEXT_PUBLIC_FEATURE_EXCHANGE !== "false",
  invest: process.env.NEXT_PUBLIC_FEATURE_INVEST !== "false",
  activity: process.env.NEXT_PUBLIC_FEATURE_ACTIVITY !== "false",
  supportWidget: process.env.NEXT_PUBLIC_FEATURE_SUPPORT_WIDGET !== "false",
  pwa: process.env.NEXT_PUBLIC_FEATURE_PWA === "true",
} as const;

export type FeatureFlag = keyof typeof featureFlags;

/** Is the backend MVP endpoint live? Until verified, surfaces stay disabled. */
export const plannedEndpoints: Record<
  | "portfolio"
  | "activity"
  | "quotes"
  | "depositIntents"
  | "withdrawalIntents"
  | "investmentProducts"
  | "investmentPositions"
  | "investmentSubscriptions"
  | "investmentRedemptions",
  boolean
> = {
  portfolio: false,
  activity: false,
  quotes: false,
  depositIntents: false,
  withdrawalIntents: false,
  investmentProducts: false,
  investmentPositions: false,
  investmentSubscriptions: false,
  investmentRedemptions: false,
};
