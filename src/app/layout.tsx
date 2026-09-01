import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { PwaUpdateBanner } from "@/components/shared/pwa-update-banner";
import { AtlasAiWidget } from "@/components/atlas-ai/atlas-ai-widget";
import { institutionalConfig } from "@/config/institutional-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const MARKETING = institutionalConfig.domains.marketing;

export const metadata: Metadata = {
  metadataBase: new URL(MARKETING),
  title: {
    default: "AtlasWallet — Money, Crypto & Investments in One Portfolio",
    template: "%s | AtlasWallet",
  },
  description: institutionalConfig.project.positioning,
  applicationName: "AtlasWallet",
  keywords: [
    "AtlasWallet",
    "digital wallet",
    "crypto wallet",
    "multi-currency wallet",
    "BRL wallet",
    "EUR wallet",
    "USD wallet",
    "GBP wallet",
    "international wallet",
    "money and crypto portfolio",
    "private investments",
    "PIX",
    "AtlasMobility",
    "Atlas Real Estate",
  ],
  authors: [{ name: institutionalConfig.entity.legalName }],
  creator: institutionalConfig.entity.legalName,
  publisher: institutionalConfig.entity.legalName,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "AtlasWallet — Money, Crypto & Investments in One Portfolio",
    description: institutionalConfig.project.positioning,
    url: MARKETING,
    siteName: "AtlasWallet",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "AtlasWallet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AtlasWallet",
    description: institutionalConfig.project.positioning,
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: MARKETING,
    languages: {
      "en-GB": MARKETING,
      "pt-BR": MARKETING,
      "pt-PT": MARKETING,
      "x-default": MARKETING,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    "msapplication-TileColor": "#020711",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "AtlasWallet",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020711" },
    { media: "(prefers-color-scheme: light)", color: "#020711" },
  ],
  colorScheme: "dark",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: institutionalConfig.project.legalEntityName,
  alternateName: "AtlasWallet",
  url: MARKETING,
  logo: `${MARKETING}/icons/icon-512.png`,
  email: institutionalConfig.contacts.email.value,
  description: institutionalConfig.project.positioning,
  address: {
    "@type": "PostalAddress",
    streetAddress: "71-75 Shelton Street, Covent Garden",
    addressLocality: "London",
    postalCode: "WC2H 9JQ",
    addressCountry: "GB",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: institutionalConfig.contacts.email.value,
      telephone: institutionalConfig.contacts.whatsapp.e164,
      availableLanguage: ["English", "Portuguese"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AtlasWallet",
  url: MARKETING,
  inLanguage: ["en-GB", "pt-BR", "pt-PT"],
  potentialAction: {
    "@type": "SearchAction",
    target: `${MARKETING}/support?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col relative`}
      >
        <AnimatedBackground />
        <Providers>{children}</Providers>
        <PwaUpdateBanner />
        <AtlasAiWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
