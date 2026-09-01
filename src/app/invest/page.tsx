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
    </AppShell>
  );
}
