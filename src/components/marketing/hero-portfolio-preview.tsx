"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Plus, Send, Repeat2, TrendingUp } from "lucide-react";
import { DEMO_LABEL } from "@/lib/mock-data";

/**
 * HeroPortfolioPreview — illustrative dashboard preview card.
 * Visible balances are clearly labelled "Illustrative" per spec rule:
 * "Never fabricate balances, successful payments, transactions..."
 */
export function HeroPortfolioPreview() {
  return (
    <div className="relative">
      {/* Main portfolio card */}
      <Card className="premium-card rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Total Portfolio
            </p>
            <p className="mt-2 text-3xl sm:text-4xl font-semibold tnum">
              R$ 142.580,12
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-success">
                <ArrowUpRight className="h-3 w-3" />
                +2,64%
              </span>
              <span className="text-muted-foreground">last 30 days · {DEMO_LABEL}</span>
            </div>
          </div>
          <Badge variant="outline" className="border-brand/40 bg-brand/5 text-brand-bright uppercase tracking-wider text-[10px]">
            BLACK 30
          </Badge>
        </div>

        {/* Mini chart */}
        <div className="mt-6">
          <MiniChart />
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { icon: Plus, label: "Add" },
            { icon: Send, label: "Send" },
            { icon: Repeat2, label: "Exchange" },
            { icon: TrendingUp, label: "Invest" },
          ].map((a) => (
            <div
              key={a.label}
              className="rounded-xl bg-surface/60 border border-border/60 p-3 flex flex-col items-center gap-1.5 hover:border-brand/40 hover:bg-surface-hover transition-colors cursor-default"
            >
              <div className="rounded-lg bg-brand/10 p-1.5 text-brand">
                <a.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] text-muted-foreground">{a.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Floating allocation ring card */}
      <div className="absolute -bottom-6 -right-2 sm:-right-6 hidden sm:block">
        <Card className="premium-card rounded-xl p-4 w-44 shadow-xl">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Allocation
          </p>
          <div className="mt-2 flex items-center gap-3">
            <AllocationRing />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="status-dot bg-brand" /> Money
              </div>
              <div className="flex items-center gap-1.5">
                <span className="status-dot bg-crypto-purple" /> Crypto
              </div>
              <div className="flex items-center gap-1.5">
                <span className="status-dot bg-investment-gold" /> Invest
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating activity chip */}
      <div className="absolute -top-3 -left-2 sm:-left-4 hidden sm:block">
        <Card className="premium-card rounded-xl px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="status-dot bg-success" />
            <span className="text-xs text-muted-foreground">PIX deposit received</span>
          </div>
        </Card>
      </div>

      <p className="mt-4 text-center text-[10px] text-muted-foreground/70">
        {DEMO_LABEL} · figures shown for visualization only
      </p>
    </div>
  );
}

function MiniChart() {
  // Static SVG sparkline — gradient fill, brand color
  const points = [38, 42, 40, 46, 50, 47, 52, 55, 53, 58, 62, 60, 65, 70];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 100;
  const h = 32;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hero-chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1687FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1687FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#hero-chart-grad)" />
      <path d={path} stroke="#1687FF" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AllocationRing() {
  const segments = [
    { color: "#1687FF", value: 0.45 },
    { color: "#8B68FF", value: 0.30 },
    { color: "#E8AA35", value: 0.15 },
    { color: "#2DDC8C", value: 0.10 },
  ];
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12">
      <circle cx="24" cy="24" r={radius} fill="none" stroke="#17243A" strokeWidth="5" />
      {segments.map((s, i) => {
        const len = s.value * circ;
        const dash = `${len} ${circ - len}`;
        const el = (
          <circle
            key={i}
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="5"
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            transform="rotate(-90 24 24)"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}
