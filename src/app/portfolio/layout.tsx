import type { Metadata } from "next";

/**
 * Layout for authenticated app routes — NOINDEX, NOFOLLOW.
 * Includes: portfolio, wallets, exchange (operational), activity,
 * profile, settings, invest/positions, support (auth context).
 */
export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · AtlasWallet App",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
