"use client";

import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Eye, RefreshCw, KeyRound, FileCheck2 } from "lucide-react";

const PILLARS = [
  {
    icon: KeyRound,
    title: "Session-only auth",
    desc: "Supabase handles authentication and session. Financial state never lives in the frontend database.",
  },
  {
    icon: Lock,
    title: "Backend-authoritative",
    desc: "Balances, fees, quotes, capabilities and settlement come exclusively from the AtlasWallet backend API.",
  },
  {
    icon: Eye,
    title: "Transparent fees",
    desc: "Gross, Atlas fee, provider/network fee, FX and net amount are shown before you confirm any operation.",
  },
  {
    icon: RefreshCw,
    title: "Capability-aware",
    desc: "Operations are gated by effective capabilities — never fabricated as successful when they aren't.",
  },
  {
    icon: FileCheck2,
    title: "Audit-friendly",
    desc: "Mutating operations carry an X-Request-ID. Errors are normalized with retriable signals.",
  },
  {
    icon: ShieldCheck,
    title: "No secret leakage",
    desc: "Only browser-safe NEXT_PUBLIC values. No service-role keys, no provider secrets, no private crypto keys.",
  },
];

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden bg-background-elevated/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Badge variant="outline" className="mb-4 border-brand/30 text-brand-bright uppercase tracking-[0.16em] text-[10px]">
              Security-first architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              Engineered with the boundaries of a regulated product in mind.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              AtlasWallet separates authentication from financial authority. The frontend
              authenticates sessions and renders state — it never writes authoritative
              balances, never holds provider secrets, and never fabricates success.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Next.js App Router
              </span>
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                TypeScript strict
              </span>
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                WCAG 2.2 AA oriented
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-3">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="premium-card premium-card-hover rounded-xl p-5"
                >
                  <div className="inline-flex rounded-lg bg-brand/10 p-2 text-brand">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
