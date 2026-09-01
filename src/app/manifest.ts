import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AtlasWallet — Money, Crypto & Investments",
    short_name: "AtlasWallet",
    description:
      "A unified digital portfolio for money, crypto, exchange and eligible private investment opportunities.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#020711",
    theme_color: "#020711",
    categories: ["finance", "business", "productivity"],
    lang: "en-GB",
    dir: "ltr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Portfolio", short_name: "Portfolio", url: "/portfolio", description: "View your total portfolio" },
      { name: "Wallets", short_name: "Wallets", url: "/wallets", description: "Money and crypto wallets" },
      { name: "Exchange", short_name: "Exchange", url: "/exchange", description: "Convert assets" },
      { name: "Invest", short_name: "Invest", url: "/invest", description: "Eligible private opportunities" },
    ],
  };
}
