import type { MetadataRoute } from "next";
import { institutionalConfig } from "@/config/institutional-config";

/**
 * AtlasWallet — sitemap.xml
 *
 * ONLY public pages are listed. Private/authenticated routes are excluded
 * (they are noindex, nofollow).
 */
const PUBLIC_ROUTES = [
  "/",
  "/money",
  "/crypto",
  "/exchange",
  "/invest",
  "/about",
  "/support",
  "/security",
  "/status",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/regulatory-status",
  "/legal/risk-disclosure",
  "/legal/investment-risk",
  "/legal/aml-kyc",
  "/legal/complaints",
  "/legal/acceptable-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = institutionalConfig.domains.marketing;
  const now = new Date();
  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : path.startsWith("/legal") ? 0.4 : 0.7,
  }));
}
