"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Lock,
  TrendingUp,
  Calendar,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoInvestmentProducts, demoAccess } from "@/lib/mock-data";
import { plannedEndpoints } from "@/lib/feature-flags";

export default function InvestProductPage({
  params,
}: {
  params: Promise<{ productCode: string }>;
}) {
  const { productCode } = use(params);
  const product = demoInvestmentProducts.find((p) => p.code === productCode);

  if (!product) {
    return (
      <AppShell>
        <Card className="premium-card rounded-2xl">
          <CardContent className="py-16 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-warning" />
            <p className="mt-3 text-base font-medium">Product not found</p>
            <Button asChild className="mt-6 bg-brand hover:bg-brand-bright text-white">
              <Link href="/invest">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to opportunities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const steps = [
    "Eligibility",
    "Key terms",
    "Risk acknowledgement",
    "Documents",
    "Fee breakdown",
    "Confirmation",
    "Position detail",
  ];

  const canSubscribe =
    demoAccess.effectiveCapabilities.investSubscription &&
    plannedEndpoints.investmentSubscriptions;

  return (
    <AppShell>
      <Link
        href="/invest"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>

      <div className="mt-3 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="premium-card rounded-2xl overflow-hidden">
            <div className={`h-40 relative ${product.code === "ATLAS_MOBILITY" ? "bg-gradient-to-br from-brand/30 via-brand/10 to-transparent" : "bg-gradient-to-br from-investment-gold/30 via-investment-gold/10 to-transparent"}`}>
              <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
              <div className="absolute top-4 left-5 flex items-center gap-2">
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {product.publicLegalState.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="border-border bg-surface/70 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {product.category}
                </Badge>
              </div>
              <h1 className="absolute bottom-4 left-5 text-2xl sm:text-3xl font-semibold tracking-tight">
                {product.name}
              </h1>
            </div>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a private opportunity. Public rate/return wording is shown only when
                supplied by legally approved product configuration. Eligibility, jurisdiction
                and account policy are evaluated before any subscription is allowed.
              </p>

              {/* Key terms */}
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {product.minimumBRL && (
                  <KeyTerm
                    icon={Wallet}
                    label="Minimum ticket"
                    value={`R$ ${product.minimumBRL.toLocaleString("pt-BR")}`}
                  />
                )}
                {product.redemptionNoticeDays && (
                  <KeyTerm
                    icon={Calendar}
                    label="Redemption notice"
                    value={`${product.redemptionNoticeDays} days`}
                  />
                )}
                {product.internalMonthlyRatePct && (
                  <KeyTerm
                    icon={TrendingUp}
                    label="Internal monthly rate (config)"
                    value={`${product.internalMonthlyRatePct.toFixed(2)}%`}
                    muted
                  />
                )}
              </div>
              {product.internalMonthlyRatePct && (
                <p className="mt-3 text-[10px] text-muted-foreground/70">
                  Internal config value — not a guaranteed return. Never presented publicly
                  as guaranteed unless legally approved product configuration explicitly enables it.
                </p>
              )}

              {/* Yield instructions */}
              {product.yieldInstructions && (
                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Distribution instructions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.yieldInstructions.map((y) => (
                      <span key={y} className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-xs text-muted-foreground">
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk acknowledgement */}
          <Card className="premium-card rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                Risk acknowledgement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>· Capital is at risk — you may lose some or all of the invested amount.</p>
              <p>· Returns are not assured and depend on product performance.</p>
              <p>· Private opportunities may have limited liquidity and long lock-up periods.</p>
              <p>· Past performance does not predict future results.</p>
              <p>· Tax treatment depends on your jurisdiction and individual circumstances.</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription panel */}
        <div className="space-y-4">
          <Card className="premium-card rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {!canSubscribe && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <Lock className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Subscription is disabled until backend and legal gates are open.
                  </p>
                </div>
              )}
              <ol className="space-y-2">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2 text-xs">
                    <span className="h-5 w-5 rounded-full bg-surface border border-border text-[10px] text-muted-foreground flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
              <Button
                className="w-full mt-4 bg-brand hover:bg-brand-bright text-white"
                disabled={!canSubscribe}
                onClick={() => {
                  if (!plannedEndpoints.investmentSubscriptions) {
                    // no-op — backend pending
                  }
                }}
              >
                {!canSubscribe ? "Eligibility/legal gate pending" : "Start subscription"}
              </Button>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                Subscription/redemption enabled only after backend + legal gates.
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Product terms", "Risk disclosure", "Subscription agreement"].map((d) => (
                <div key={d} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {d}
                  </span>
                  <Badge variant="outline" className="border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pending
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-border bg-surface/40 p-3">
            <p className="text-[10px] text-muted-foreground flex items-start gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
              Capital at risk · Returns not assured · Past performance ≠ future results.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function KeyTerm({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-medium ${muted ? "text-muted-foreground" : ""}`}>{value}</p>
    </div>
  );
}
