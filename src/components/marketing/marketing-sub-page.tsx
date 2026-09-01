"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PageSection {
  h: string;
  body?: string[];
  list?: string[];
}

export function MarketingSubPage({
  eyebrow,
  title,
  subtitle,
  sections,
  cta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: PageSection[];
  cta?: { primary: string; secondary?: string };
}) {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Badge variant="outline" className="mb-4 border-brand/30 text-brand-bright uppercase tracking-[0.16em] text-[10px]">
            {eyebrow}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          {cta && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-brand hover:bg-brand-bright text-white glow-brand">
                <Link href="/register">
                  {cta.primary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {cta.secondary && (
                <Button asChild variant="outline" size="lg" className="border-border bg-surface/40 hover:bg-surface-hover">
                  <Link href="/about">{cta.secondary}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="premium-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
              {s.body?.map((p, j) => (
                <p key={j} className="mt-3 text-sm text-muted-foreground leading-relaxed">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
