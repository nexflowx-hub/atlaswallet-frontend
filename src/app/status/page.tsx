"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { institutionalConfig } from "@/config/institutional-config";

interface Check {
  label: string;
  status: "operational" | "degraded" | "pending";
  detail: string;
}

const CHECKS: Check[] = [
  {
    label: "Marketing site",
    status: "operational",
    detail: "Public website is live and serving.",
  },
  {
    label: "Authentication (Supabase)",
    status: "pending",
    detail: "Supabase credentials not yet configured in this environment. Authenticated app uses local demo session.",
  },
  {
    label: "Backend API",
    status: "pending",
    detail: "Connection to api.atlaswallet.org requires production credentials. Existing endpoints (health, /me, bootstrap, access, wallets, profile) are wired up and ready.",
  },
  {
    label: "Portfolio valuation",
    status: "degraded",
    detail: "Planned MVP endpoint — interface prepared, performance hidden until backend exists.",
  },
  {
    label: "Activity feed",
    status: "degraded",
    detail: "Planned MVP endpoint — empty state shown until backend exists.",
  },
  {
    label: "Quotes (exchange)",
    status: "degraded",
    detail: "Planned MVP endpoint — UI prepared; no fake quote generated.",
  },
  {
    label: "Deposit / withdrawal intents",
    status: "degraded",
    detail: "Planned MVP endpoints — UI prepared; execution disabled until backend exists.",
  },
  {
    label: "Investment products / positions",
    status: "degraded",
    detail: "Planned MVP endpoints — legal/eligibility gated.",
  },
];

const STATUS_STYLE: Record<Check["status"], { color: string; label: string; icon: typeof CheckCircle2 }> = {
  operational: { color: "success", label: "Operational", icon: CheckCircle2 },
  degraded: { color: "warning", label: "Planned / disabled", icon: AlertCircle },
  pending: { color: "warning", label: "Pending config", icon: AlertCircle },
};

export default function StatusPage() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setNow(new Date().toLocaleString("en-GB"));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const operationalCount = CHECKS.filter((c) => c.status === "operational").length;
  const overallLabel =
    operationalCount === CHECKS.length ? "All systems operational" : "Partial / planned — see details";

  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Badge variant="outline" className="mb-4 border-brand/30 text-brand-bright uppercase tracking-[0.16em] text-[10px]">
            <Activity className="h-3 w-3 mr-1" />
            System Status
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {overallLabel}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {now || "—"} · This page reflects the AtlasWallet V1 frontend boundary: existing endpoints are wired up; planned MVP endpoints stay disabled until the backend ships them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-3">
          {CHECKS.map((c) => {
            const s = STATUS_STYLE[c.status];
            return (
              <Card key={c.label} className="premium-card rounded-2xl">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`rounded-lg p-2 bg-${s.color}/10 text-${s.color} shrink-0`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{c.label}</p>
                      <Badge
                        variant="outline"
                        className={`border-${s.color}/40 bg-${s.color}/10 text-${s.color} text-[10px] uppercase tracking-wider`}
                      >
                        {s.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 premium-card rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm font-semibold">Institutional</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {institutionalConfig.entity.legalName} · {institutionalConfig.entity.jurisdiction}
              <br />
              {institutionalConfig.entity.registeredOffice}
              <br />
              Company number: <span className="text-warning">PENDING_CONFIRMATION</span>
            </p>
          </CardContent>
        </Card>
      </section>
    </MarketingShell>
  );
}
