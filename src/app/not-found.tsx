"use client";

import Link from "next/link";
import { Compass, Home, LifeBuoy } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { institutionalConfig } from "@/config/institutional-config";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" aria-hidden />
      <div className="absolute inset-0 radial-glow opacity-50" aria-hidden />
      <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand/8 blur-3xl" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl text-center">
          <p className="text-[10rem] sm:text-[12rem] font-bold leading-none tracking-tighter gradient-text">
            404
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Page not found
          </p>
          <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight">
            The page you&apos;re looking for has moved or doesn&apos;t exist.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            The link may be broken, the page may have been renamed, or you may not have
            access yet. Try returning home or contact support.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="bg-brand hover:bg-brand-bright text-white glow-brand">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border hover:bg-surface-hover">
              <Link href="/support">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact support
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <Link
              href="/money"
              className="premium-card premium-card-hover rounded-lg p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4 text-brand mb-1.5" />
              Money
            </Link>
            <Link
              href="/crypto"
              className="premium-card premium-card-hover rounded-lg p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4 text-crypto-purple mb-1.5" />
              Crypto
            </Link>
            <Link
              href="/invest"
              className="premium-card premium-card-hover rounded-lg p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4 text-investment-gold mb-1.5" />
              Invest
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
        {institutionalConfig.entity.legalName} · {institutionalConfig.entity.registeredOffice}
      </footer>
    </div>
  );
}
