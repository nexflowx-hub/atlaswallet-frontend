import type { MetadataRoute } from "next";
import { institutionalConfig } from "@/config/institutional-config";

/**
 * AtlasWallet — robots.txt
 *
 * Public marketing/legal pages: indexable.
 * Private/app routes: disallowed AND noindex via metadata.
 */
export default function robots(): MetadataRoute.Robots {
  const marketing = institutionalConfig.domains.marketing;
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/money", "/crypto", "/exchange", "/invest", "/about", "/support", "/security", "/status", "/legal/", "/login", "/register", "/forgot-password", "/reset-password"],
        disallow: [
          "/portfolio",
          "/wallets",
          "/activity",
          "/profile",
          "/settings",
          "/invest/positions",
          "/invest/positions/",
          "/api/",
          "/_next/",
          "/offline",
        ],
      },
    ],
    sitemap: `${marketing}/sitemap.xml`,
    host: marketing,
  };
}
