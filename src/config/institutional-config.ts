/**
 * AtlasWallet — Centralized institutional configuration.
 * Single source of truth for entity, contacts, regions, domains.
 * Rule: never invent the Companies House number; it remains PENDING_CONFIRMATION.
 */

export const institutionalConfig = {
  project: {
    name: "AtlasWallet",
    productName: "Atlas Wallet",
    legalEntityName: "Atlas Wallet Ltd",
    tagline: "Money · Crypto · Investments · One Portfolio.",
    positioning:
      "A unified digital portfolio for money, crypto, exchange and eligible private investment opportunities.",
    repositories: {
      frontend: "nexflowx-hub/atlaswallet-frontend",
      backend: "nexflowx-hub/atlaswallet-backend",
    },
    deployment: "Vercel",
  },
  domains: {
    marketing: "https://atlaswallet.org",
    www: "https://www.atlaswallet.org",
    app: "https://app.atlaswallet.org",
    api: "https://api.atlaswallet.org",
  },
  entity: {
    legalName: "Atlas Wallet Ltd",
    entityType: "Private limited company",
    jurisdiction: "England and Wales",
    companyNumber: null,
    companyNumberState: "PENDING_CONFIRMATION" as const,
    registeredOffice:
      "71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ",
    rule: "Do not invent the company number. Insert the confirmed Companies House number globally when received.",
  },
  contacts: {
    email: {
      value: "support@atlaswallet.org",
      href: "mailto:support@atlaswallet.org",
    },
    whatsapp: {
      display: "+351 925 386 409",
      e164: "+351925386409",
      href: "https://wa.me/351925386409",
    },
    telegramManager: {
      handle: "@AtlasWallet_Manager",
      href: "https://t.me/AtlasWallet_Manager",
    },
    telegramNews: {
      handle: "@atlaswallet_news",
      href: "https://t.me/atlaswallet_news",
    },
    telegramBot: {
      handle: "@AtlasWallet_TGbot",
      href: "https://t.me/AtlasWallet_TGbot",
      status: "COMING_SOON" as const,
    },
  },
  regions: {
    UK: {
      enabled: true,
      privacy: "UK GDPR / applicable UK data protection and electronic communications rules",
      regulatoryCopy: "No FCA claim unless verified and configured.",
    },
    EU_EEA: {
      enabled: true,
      privacy: "EU GDPR and applicable local rules",
      regulatoryCopy:
        "No MiCA/CASP/payment authorization claim unless verified or clearly attributed to an authorized provider.",
    },
    Brazil: {
      enabled: true,
      privacy: "LGPD and applicable Brazilian rules",
      regulatoryCopy:
        "No BCB/CVM authorization claim unless verified; investment availability must be eligibility/legal gated.",
    },
  },
  supportWarning:
    "AtlasWallet support will never request passwords, seed phrases or private keys.",
  legal: {
    rule: "Production-ready structure/templates but jurisdiction-specific legal review is required before regulated services/investment offers go live.",
  },
  footer: {
    whilePending:
      "Atlas Wallet Ltd · Registered office: 71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ · Company number pending confirmation.",
    whenNumberKnown:
      "Atlas Wallet Ltd is a private limited company registered in England and Wales under company number {{COMPANY_NUMBER}}. Registered office: 71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ.",
    launchGate:
      "Populate the confirmed Companies House number before formal public production launch.",
    disclaimer:
      "Services and product availability depend on jurisdiction, eligibility and applicable provider requirements. No authorization/license claim is rendered unless verified and configured.",
    copyright: "© {{YEAR}} Atlas Wallet Ltd. All rights reserved.",
  },
  // Pricing/identity defaults from /api/v1/me — never invent, but reflect current entry.
  defaultEntry: {
    identityLevel: "SELF_DECLARED",
    kycStatus: "NOT_STARTED",
    pricingPlan: "BLACK_30",
    policyProfile: "BLACK_ENTRY_OPEN",
  },
  socialProof: {
    mode: "DISABLED_UNTIL_VERIFIED",
    rule: "No fabricated metrics/testimonials/partner logos.",
  },
} as const;

export type InstitutionalConfig = typeof institutionalConfig;

/** Returns the legal company line depending on companyNumber availability. */
export function getCompanyLine(): string {
  const { companyNumber } = institutionalConfig.entity;
  if (!companyNumber) {
    return institutionalConfig.footer.whilePending;
  }
  return institutionalConfig.footer.whenNumberKnown.replace(
    "{{COMPANY_NUMBER}}",
    companyNumber
  );
}

export function getCopyright(): string {
  return institutionalConfig.footer.copyright.replace(
    "{{YEAR}}",
    String(new Date().getFullYear())
  );
}
