import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
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

export const metadata: Metadata = {
  metadataBase: new URL(institutionalConfig.domains.marketing),
  title: {
    default: "AtlasWallet — Money, Crypto & Investments in One Portfolio",
    template: "%s | AtlasWallet",
  },
  description: institutionalConfig.project.positioning,
  keywords: [
    "AtlasWallet",
    "digital wallet",
    "crypto",
    "multi-currency",
    "BRL",
    "EUR",
    "USD",
    "GBP",
    "private investments",
  ],
  authors: [{ name: institutionalConfig.entity.legalName }],
  applicationName: "AtlasWallet",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AtlasWallet — Money, Crypto & Investments in One Portfolio",
    description: institutionalConfig.project.positioning,
    url: institutionalConfig.domains.marketing,
    siteName: "AtlasWallet",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "AtlasWallet",
    description: institutionalConfig.project.positioning,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020711",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: institutionalConfig.project.legalEntityName,
  url: institutionalConfig.domains.marketing,
  email: institutionalConfig.contacts.email.value,
  address: {
    "@type": "PostalAddress",
    streetAddress: "71-75 Shelton Street, Covent Garden",
    addressLocality: "London",
    postalCode: "WC2H 9JQ",
    addressCountry: "GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
