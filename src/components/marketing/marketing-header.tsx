"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { LanguageSelector } from "@/components/shared/language-selector";
import { institutionalConfig } from "@/config/institutional-config";

const NAV = [
  { label: "Money", href: "/money" },
  { label: "Crypto", href: "/crypto" },
  { label: "Exchange", href: "/exchange" },
  { label: "Invest", href: "/invest" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSelector />
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="bg-brand hover:bg-brand-bright text-white glow-brand">
            <Link href="/register">Open account</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-1">
          <LanguageSelector compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background-elevated border-l border-border">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 pt-6">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-surface-hover transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                </Button>
                <Button asChild className="bg-brand hover:bg-brand-bright text-white">
                  <Link href="/register" onClick={() => setOpen(false)}>Open account</Link>
                </Button>
                <div className="mt-6 px-3 text-xs text-muted-foreground">
                  {institutionalConfig.entity.legalName}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
