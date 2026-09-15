import type { NextConfig } from "next";

const securityHeaders = [
  // X-Frame-Options: prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // X-Content-Type-Options: prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer-Policy: only origin on cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions-Policy: lock down sensitive APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  },
  // X-DNS-Prefetch-Control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content-Security-Policy — restrictive but app-friendly
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https://api.atlaswallet.org https://*.supabase.co https://*.atlaswallet.org",
      "object-src 'none'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'self' https://*.atlaswallet.org",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.atlaswallet.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Service worker: no-cache so updates roll out
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      // Manifest: short cache
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "public, max-age=300" }],
      },
    ];
  },
};

export default nextConfig;
