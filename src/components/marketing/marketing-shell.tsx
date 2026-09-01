"use client";

import Link from "next/link";
import { MarketingHeader } from "./marketing-header";
import { MarketingFooter } from "./marketing-footer";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { institutionalConfig } from "@/config/institutional-config";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <CookieConsent />
      {/* Support widget — appears once enabled */}
      <SupportWidgetStub />
    </div>
  );
}

function SupportWidgetStub() {
  // The full widget is enabled by feature flag NEXT_PUBLIC_FEATURE_SUPPORT_WIDGET.
  // Always renders a single CTA at bottom-left of viewport on marketing pages.
  return (
    <Link
      href="/support"
      className="fixed bottom-4 left-4 z-40 hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur hover:text-foreground hover:border-brand/40 transition-colors"
    >
      <span className="status-dot bg-success" aria-hidden />
      {institutionalConfig.contacts.email.value}
    </Link>
  );
}
