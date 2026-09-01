"use client";

import Link from "next/link";
import { ChevronRight, FileText, ShieldAlert } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCompanyLine,
  getCopyright,
  institutionalConfig,
} from "@/config/institutional-config";

export interface LegalSection {
  h: string;
  body?: string[];
  list?: string[];
}

const LEGAL_PAGES = [
  { href: "/legal/terms", label: "Terms of Use" },
  { href: "/legal/privacy", label: "Privacy Notice" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/regulatory-status", label: "Regulatory Status" },
  { href: "/legal/risk-disclosure", label: "Risk Disclosure" },
  { href: "/legal/investment-risk", label: "Investment Risk" },
  { href: "/legal/aml-kyc", label: "Identity, AML & Financial Crime Controls" },
  { href: "/legal/complaints", label: "Complaints" },
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
];

export function LegalPage({
  title,
  intro,
  sections,
  effective,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
  effective?: string;
}) {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge variant="outline" className="mb-4 border-border text-muted-foreground uppercase tracking-[0.16em] text-[10px]">
            <FileText className="h-3 w-3 mr-1" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
          {intro && (
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {intro}
            </p>
          )}
          {effective && (
            <p className="mt-3 text-xs text-muted-foreground">
              Effective: {effective}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar nav */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
                Legal documents
              </p>
              <nav className="space-y-1">
                {LEGAL_PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      p.label === title
                        ? "bg-brand/10 text-brand-bright border-l-2 border-brand"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-5">
            <Card className="premium-card rounded-2xl border-warning/30 bg-warning/5">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {institutionalConfig.legal.rule} This is a template structure; jurisdiction-specific legal review is required before regulated services or investment offers go live.
                </p>
              </CardContent>
            </Card>

            {sections.map((s, i) => (
              <Card key={i} className="premium-card rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{s.h}</h2>
                  {s.body?.map((p, j) => (
                    <p key={j} className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {p}
                    </p>
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
                </CardContent>
              </Card>
            ))}

            {/* Entity footer */}
            <Card className="premium-card rounded-2xl">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
                  Entity
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getCompanyLine()}
                </p>
                <p className="mt-3 text-xs text-muted-foreground/70">
                  {getCopyright()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
