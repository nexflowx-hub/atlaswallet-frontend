"use client";

import Link from "next/link";
import { AlertCircle, ArrowUpRight, ChevronRight, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoInvestmentProducts, demoInvestmentPositions } from "@/lib/mock-data";

export default function InvestPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Invest · Eligibility gated
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Private opportunities
          </h1>
        </div>
        <Button asChild variant="outline" className="border-border hover:bg-surface-hover">
          <Link href="/invest/positions">
            My positions ({demoInvestmentPositions.length})
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <Card className="mt-5 rounded-2xl border-warning/30 bg-warning/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">Eligibility & legal review required</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Investment opportunities are subject to product terms, jurisdiction and account
              eligibility. Capital is at risk and returns are not assured. Public return/rate
              wording is shown only once legally approved product configuration is in place.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        {demoInvestmentProducts.map((p) => (
          <Card key={p.code} className="premium-card premium-card-hover rounded-2xl overflow-hidden">
            <div className={`h-32 relative ${p.code === "ATLAS_MOBILITY" ? "bg-gradient-to-br from-brand/30 via-brand/10 to-transparent" : "bg-gradient-to-br from-investment-gold/30 via-investment-gold/10 to-transparent"}`}>
              <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {p.publicLegalState.replace("_", " ")}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.category}</p>
                <h3 className="mt-0.5 text-xl font-semibold">{p.name}</h3>
              </div>
            </div>
            <CardContent className="p-5">
              {p.minimumBRL && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Minimum</span>
                  <span className="text-sm font-medium">
                    R$ {p.minimumBRL.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              {p.redemptionNoticeDays && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Redemption notice: {p.redemptionNoticeDays} days
                </p>
              )}
              {p.examples && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Examples</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    {p.examples.map((ex) => (
                      <li key={ex}>· {ex}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-3 text-[10px] text-muted-foreground/70">
                {p.rule || "Public rate/return wording available only after legally approved product configuration."}
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-4 text-brand hover:text-brand-bright p-0 h-auto">
                <Link href={`/invest/${p.code}`}>
                  View details
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cross-allocation concept */}
      <Card className="mt-5 premium-card rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-investment-gold/10 p-2 text-investment-gold shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Cross-allocation concept</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Eligible AtlasMobility distributions can be allocated toward an eligible Atlas
                Real Estate payment plan. Positions and contracts are kept separate, with an
                explicit allocation instruction — never automatic.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Allocation visual */}
      <Card className="mt-5 premium-card rounded-2xl overflow-hidden">
        <div className="h-32 relative bg-gradient-to-br from-investment-gold/20 via-brand/10 to-transparent">
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div className="absolute top-4 left-5">
            <Badge variant="outline" className="border-investment-gold/40 bg-investment-gold/10 text-investment-gold text-[10px] uppercase tracking-wider">
              Smart Allocation
            </Badge>
          </div>
          <h2 className="absolute bottom-3 left-5 text-xl font-semibold">
            Allocate yields across positions.
          </h2>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conceptual visualization of how AtlasMobility distributions can flow into Atlas
            Real Estate payment plans. Each position remains a separate contract with its own
            terms, redemption rules and yield instructions.
          </p>

          {/* Allocation diagram */}
          <div className="mt-6 grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Position A */}
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/15 flex items-center justify-center text-brand">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Position A</p>
                  <p className="text-sm font-semibold">AtlasMobility</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Principal</p>
              <p className="text-lg font-semibold tnum">R$ 50.000</p>
              <p className="mt-2 text-xs text-muted-foreground">Yield instruction</p>
              <Badge variant="outline" className="mt-1 border-brand/40 bg-brand/10 text-brand-bright text-[10px] uppercase tracking-wider">
                Allocate
              </Badge>
            </div>

            {/* Arrow / flow */}
            <div className="flex flex-col items-center justify-center text-investment-gold">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Yield →</div>
              <svg viewBox="0 0 100 24" className="w-24 h-6" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="alloc-flow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1687FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#E8AA35" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M0 12 L92 12" stroke="url(#alloc-flow)" strokeWidth="2" fill="none" />
                <path d="M88 6 L96 12 L88 18" stroke="#E8AA35" strokeWidth="2" fill="none" strokeLinejoin="round" />
              </svg>
              <div className="text-xs text-investment-gold mt-1">Allocate</div>
            </div>

            {/* Position B */}
            <div className="rounded-xl border border-investment-gold/30 bg-investment-gold/5 p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-investment-gold/15 flex items-center justify-center text-investment-gold">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Position B</p>
                  <p className="text-sm font-semibold">Atlas Real Estate</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Payment plan</p>
              <p className="text-lg font-semibold tnum">R$ 25.000</p>
              <p className="mt-2 text-xs text-muted-foreground">Example</p>
              <Badge variant="outline" className="mt-1 border-investment-gold/40 bg-investment-gold/10 text-investment-gold text-[10px] uppercase tracking-wider">
                Praia do Lago
              </Badge>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Illustrative example. Each subscription is a separate position with explicit allocation
              instructions. Cross-allocation is never automatic — it requires explicit user action.
              Eligibility, jurisdiction and legal review apply. Capital is at risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
