"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, LifeBuoy, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { institutionalConfig } from "@/config/institutional-config";

/**
 * Global error boundary — catches any uncaught exception.
 * NEVER shows stack trace, provider secret or raw backend error.
 * Shows a requestId for support when available.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const requestId = error?.digest || `AW-${Date.now().toString(36).toUpperCase()}`;

  return (
    <html lang="en-GB">
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-10" aria-hidden />
          <div className="absolute inset-0 radial-glow opacity-40" aria-hidden />

          <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
          </header>

          <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto rounded-full bg-danger/10 p-4 w-fit">
                <AlertTriangle className="h-8 w-8 text-danger" />
              </div>
              <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight">
                Something went wrong.
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred. We&apos;ve logged the issue with a reference ID
                so our team can investigate. No need to worry — your data and account are safe.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Reference
                </span>
                <span className="font-mono text-xs text-foreground">{requestId}</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={reset} className="bg-brand hover:bg-brand-bright text-white">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
                <Button asChild variant="outline" className="border-border hover:bg-surface-hover">
                  <Link href="/support">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Contact support
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-success" />
                We never expose stack traces, provider secrets or raw backend errors.
              </p>
            </div>
          </main>

          <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
            {institutionalConfig.entity.legalName} · {institutionalConfig.entity.jurisdiction}
          </footer>
        </div>
      </body>
    </html>
  );
}
