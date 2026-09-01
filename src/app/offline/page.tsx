"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { institutionalConfig } from "@/config/institutional-config";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" aria-hidden />
      <div className="absolute inset-0 radial-glow opacity-40" aria-hidden />
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto rounded-full bg-warning/10 p-4 w-fit">
            <WifiOff className="h-8 w-8 text-warning" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            AtlasWallet is offline.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Reconnect to access live financial information. We never show stale balances
            as if they were current — your data is always live when you reconnect.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button onClick={() => window.location.reload()} className="bg-brand hover:bg-brand-bright text-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline" className="border-border hover:bg-surface-hover">
              <Link href="/">Back to home</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-success" />
              Public pages remain available offline.
            </p>
          </div>
        </div>
      </main>
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
        {institutionalConfig.entity.legalName} · {institutionalConfig.entity.jurisdiction}
      </footer>
    </div>
  );
}
