import { MarketingSubPage } from "@/components/marketing/marketing-sub-page";

export const metadata = { title: "Security — Architecture & boundaries" };

export default function SecurityPage() {
  return (
    <MarketingSubPage
      eyebrow="Security"
      title="Engineered with the boundaries of a regulated product in mind."
      subtitle="AtlasWallet separates authentication from financial authority. The frontend authenticates sessions and renders state — it never writes authoritative balances, never holds provider secrets, and never fabricates success."
      cta={{ primary: "Open your account", secondary: "Read about us" }}
      sections={[
        {
          h: "Session-only authentication",
          body: [
            "Supabase Auth handles authentication and session management. Financial state never lives in the frontend database — Supabase is for auth/session only.",
            "The AtlasWallet Backend API at api.atlaswallet.org is the single source of truth for account/wallet/fee/quote/transaction/investment operations. The frontend calls it over HTTPS with the Supabase bearer token.",
          ],
        },
        {
          h: "No secret leakage",
          list: [
            "Only browser-safe NEXT_PUBLIC Supabase values are allowed in frontend environment",
            "No DATABASE_URL, DIRECT_URL or service-role keys",
            "No provider API secrets or crypto private keys",
            "No backend policy bypass from the frontend",
          ],
        },
        {
          h: "Capability-aware operations",
          body: [
            "Every operation respects effective capabilities. Requested vs effective capabilities are distinct — requested-but-not-effective stays visible but soft-gated, never fabricated as available.",
            "Unavailable operations never fabricate success. Provider maintenance surfaces as a neutral retryable state, not as an error.",
          ],
        },
        {
          h: "Audit & error handling",
          list: [
            "Mutating operations carry an X-Request-ID",
            "Errors are normalized with retriable signals",
            "Bearer tokens and PII are never logged",
            "One refresh attempt on 401, then login redirect",
            "AbortController and timeouts on every request",
          ],
        },
        {
          h: "Accessibility & performance",
          body: [
            "AtlasWallet is built toward WCAG 2.2 AA — keyboard support, visible focus, ARIA for icon buttons, chart text alternatives, not-color-only status, mobile touch targets, and prefers-reduced-motion.",
            "Performance targets: LCP under 2.5s, CLS under 0.1, INP under 200ms. We use next/image, lazy-load below-the-fold content, code-split app areas, and avoid heavy third parties.",
          ],
        },
      ]}
    />
  );
}
