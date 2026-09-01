"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Plus,
  Send,
  Repeat2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Info,
  ShieldCheck,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  demoWallets,
  demoProfile,
  demoActivity,
  buildIllustrativeHistory,
  DEMO_LABEL,
} from "@/lib/mock-data";
import { plannedEndpoints } from "@/lib/feature-flags";
import { institutionalConfig } from "@/config/institutional-config";

const PERIODS = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;
type Period = (typeof PERIODS)[number];

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export default function PortfolioPage() {
  return (
    <AppShell>
      <PortfolioHero />
      <QuickActions />
      <CategoryCards />
      <AssetTable />
      <InvestmentSummary />
      <RecentActivity />
      <ProgressiveProfileCard />
    </AppShell>
  );
}

function PortfolioHero() {
  const [period, setPeriod] = useState<Period>("1M");
  const history = useMemo(() => buildIllustrativeHistory(30), []);
  const total = history[history.length - 1].value;
  const first = history[0].value;
  const changePct = ((total - first) / first) * 100;

  return (
    <Card className="premium-card rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Total Portfolio · BRL
              </p>
              {!plannedEndpoints.portfolio && (
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
                  <Info className="h-3 w-3 mr-1" />
                  {DEMO_LABEL}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-4xl sm:text-5xl font-semibold tnum">
              {BRL.format(total)}
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
                  changePct >= 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {changePct >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {changePct >= 0 ? "+" : ""}
                {changePct.toFixed(2)}%
              </span>
              <span className="text-muted-foreground text-xs">
                last {period.toLowerCase()} · {DEMO_LABEL.toLowerCase()}
              </span>
            </div>
          </div>

          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList className="bg-surface/60 border border-border">
              {PERIODS.map((p) => (
                <TabsTrigger key={p} value={p} className="text-xs px-2.5 py-1 data-[state=active]:bg-brand/10 data-[state=active]:text-brand-bright">
                  {p}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1687FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1687FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="ts"
                tickFormatter={(t) => new Date(t).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                tick={{ fill: "#68778D", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
              <Tooltip
                cursor={{ stroke: "#1687FF", strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "#0D1A2D",
                  border: "1px solid #17243A",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#95A4B8" }}
                formatter={(v: number) => [BRL.format(v), "Value"]}
                labelFormatter={(t) => new Date(t as string).toLocaleString("pt-BR")}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1687FF"
                strokeWidth={2}
                fill="url(#portfolio-grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { icon: Plus, label: "Add Money", color: "text-success", bg: "bg-success/10", href: "/wallets" },
    { icon: Send, label: "Send", color: "text-brand", bg: "bg-brand/10", href: "/wallets" },
    { icon: Repeat2, label: "Exchange", color: "text-crypto-purple", bg: "bg-crypto-purple/10", href: "/exchange" },
    { icon: TrendingUp, label: "Invest", color: "text-investment-gold", bg: "bg-investment-gold/10", href: "/invest" },
  ];
  return (
    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          className="premium-card premium-card-hover rounded-xl p-4 flex items-center gap-3 group"
        >
          <div className={`rounded-lg ${a.bg} ${a.color} p-2`}>
            <a.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{a.label}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
        </Link>
      ))}
    </div>
  );
}

function CategoryCards() {
  const moneyTotal = demoWallets
    .filter((w) => w.asset.type === "FIAT")
    .reduce((s, w) => s + Number(w.balance.available) * brlRate(w.asset.code), 0);
  const cryptoTotal = demoWallets
    .filter((w) => w.asset.type === "CRYPTO")
    .reduce((s, w) => s + Number(w.balance.available) * cryptoRate(w.asset.code), 0);

  const cards = [
    {
      label: "Money",
      total: moneyTotal,
      changePct: 1.2,
      tone: "success",
      icon: "wallet",
      sparkColor: "#2DDC8C",
      sparkPoints: [30, 32, 31, 35, 33, 38, 40, 42, 41, 44, 46, 45, 48],
    },
    {
      label: "Crypto",
      total: cryptoTotal,
      changePct: 4.8,
      tone: "purple",
      icon: "bitcoin",
      sparkColor: "#8B68FF",
      sparkPoints: [25, 22, 28, 30, 27, 35, 38, 42, 45, 50, 48, 55, 62],
    },
    {
      label: "Investments",
      total: 0,
      changePct: 0,
      tone: "gold",
      icon: "trending",
      sparkColor: "#E8AA35",
      sparkPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      empty: true,
    },
  ];

  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="premium-card rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`status-dot bg-${c.tone}`} style={{ background: c.sparkColor }} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </span>
              </div>
              {!c.empty && (
                <span className={`text-xs ${c.changePct >= 0 ? "text-success" : "text-danger"}`}>
                  {c.changePct >= 0 ? "+" : ""}
                  {c.changePct.toFixed(2)}%
                </span>
              )}
            </div>
            <p className="mt-2 text-2xl font-semibold tnum">
              {c.empty ? "—" : BRL.format(c.total)}
            </p>
            {c.empty ? (
              <p className="mt-1 text-xs text-muted-foreground">
                No active positions — explore eligible opportunities.
              </p>
            ) : (
              <div className="mt-3 h-8">
                <Sparkline points={c.sparkPoints} color={c.sparkColor} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 100;
  const h = 24;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AssetTable() {
  const sorted = [...demoWallets].sort((a, b) => {
    const av = Number(a.balance.available) * (a.asset.type === "FIAT" ? brlRate(a.asset.code) : cryptoRate(a.asset.code));
    const bv = Number(b.balance.available) * (b.asset.type === "FIAT" ? brlRate(b.asset.code) : cryptoRate(b.asset.code));
    return bv - av;
  });

  return (
    <Card className="mt-5 premium-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Your assets</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/wallets">
            View all
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="font-medium px-5 py-2.5">Asset</th>
                <th className="font-medium px-3 py-2.5 hidden md:table-cell">Network</th>
                <th className="font-medium px-3 py-2.5 text-right">Available</th>
                <th className="font-medium px-3 py-2.5 text-right hidden sm:table-cell">Est. value</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 6).map((w) => {
                const value =
                  Number(w.balance.available) *
                  (w.asset.type === "FIAT" ? brlRate(w.asset.code) : cryptoRate(w.asset.code));
                return (
                  <tr key={w.id} className="border-b border-border/50 hover:bg-surface-hover/40 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/wallets/${w.id}`} className="flex items-center gap-3">
                        <AssetIcon code={w.asset.code} />
                        <div>
                          <p className="font-medium">{w.asset.code}</p>
                          <p className="text-xs text-muted-foreground">{w.asset.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
                        {w.asset.network}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tnum">
                      {formatAmount(w.balance.available, w.asset.decimals)}{" "}
                      <span className="text-xs text-muted-foreground">{w.asset.code}</span>
                    </td>
                    <td className="px-3 py-3 text-right tnum hidden sm:table-cell">
                      {BRL.format(value)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/wallets/${w.id}`}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Open ${w.asset.code} wallet`}
                      >
                        <ChevronRight className="h-4 w-4 inline" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function InvestmentSummary() {
  return (
    <Card className="mt-5 premium-card rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Investments</CardTitle>
          <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
            <AlertTriangle className="h-3 w-3 mr-1" />
            PLANNED
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tnum">—</p>
            <p className="text-xs text-muted-foreground mt-1">
              No active positions. Explore eligible private opportunities.
            </p>
          </div>
          <Button asChild variant="outline" className="border-investment-gold/40 text-investment-gold hover:bg-investment-gold/10 hover:text-investment-gold">
            <Link href="/invest">
              Explore opportunities
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card className="mt-5 premium-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
        <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
          <AlertTriangle className="h-3 w-3 mr-1" />
          PLANNED
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {!plannedEndpoints.activity && (
          <div className="px-5 py-3 border-b border-border/50 bg-warning/5">
            <p className="text-xs text-muted-foreground">
              Activity feed shows once the backend MVP endpoint is live. Items below are illustrative.
            </p>
          </div>
        )}
        <ul className="divide-y divide-border/50">
          {demoActivity.map((a) => (
            <li key={a.id} className="px-5 py-3 flex items-center gap-3 hover:bg-surface-hover/40 transition-colors">
              <div className="rounded-lg bg-surface p-2">
                <ActivityTypeIcon type={a.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{a.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.createdAt).toLocaleString("pt-BR")} · {a.assetCode} · {a.network}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tnum">
                  {a.amount} <span className="text-xs text-muted-foreground">{a.assetCode}</span>
                </p>
                <span className={`text-[10px] uppercase tracking-wider ${a.status === "COMPLETED" ? "text-success" : "text-warning"}`}>
                  {a.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ProgressiveProfileCard() {
  const { percent, missingFields } = demoProfile.completion;
  return (
    <Card className="mt-5 premium-card rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Profile completion</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Self-declared · progressive · skippable. KYC is a separate, non-blocking state.
            </p>
          </div>
          <Badge variant="outline" className="border-brand/40 bg-brand/5 text-brand-bright text-[10px] uppercase tracking-wider">
            SELF_DECLARED
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Progress value={percent} className="h-2 bg-surface" />
          </div>
          <span className="text-sm font-medium tnum">{percent}%</span>
        </div>
        {missingFields.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Missing fields:</p>
            <div className="flex flex-wrap gap-1.5">
              {missingFields.map((f) => (
                <span key={f} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <Button asChild size="sm" variant="outline" className="border-border hover:bg-surface-hover">
            <Link href="/profile">
              Complete profile
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="text-muted-foreground">
            <Link href="/portfolio">Skip for now</Link>
          </Button>
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Auth via Supabase (session only)
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3" />
            State from {institutionalConfig.domains.api.replace("https://", "")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// --- helpers ---

function brlRate(code: string): number {
  // Illustrative reference rates — not authoritative. Real values come from backend.
  const r: Record<string, number> = { BRL: 1, EUR: 5.5, USD: 5.05, GBP: 6.4 };
  return r[code] || 1;
}
function cryptoRate(code: string): number {
  const r: Record<string, number> = { USDT: 5.05, USDC: 5.05, BTC: 320000, ETH: 18000, SOL: 800 };
  return r[code] || 1;
}
function formatAmount(s: string, decimals: number): string {
  const n = Number(s);
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: decimals });
}

function AssetIcon({ code }: { code: string }) {
  const colors: Record<string, string> = {
    BRL: "#2DDC8C",
    EUR: "#1687FF",
    USD: "#2DDC8C",
    GBP: "#8B68FF",
    USDT: "#2DDC8C",
    USDC: "#1687FF",
    BTC: "#F6B93B",
    ETH: "#8B68FF",
    SOL: "#8B68FF",
  };
  const c = colors[code] || "#95A4B8";
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
      style={{ background: c, boxShadow: `0 0 12px -2px ${c}80` }}
    >
      {code.slice(0, 3)}
    </div>
  );
}

function ActivityTypeIcon({ type }: { type: string }) {
  const map: Record<string, React.ReactNode> = {
    DEPOSIT: <Plus className="h-4 w-4 text-success" />,
    WITHDRAWAL: <Send className="h-4 w-4 text-brand" />,
    EXCHANGE: <Repeat2 className="h-4 w-4 text-crypto-purple" />,
    INVESTMENT_SUBSCRIPTION: <TrendingUp className="h-4 w-4 text-investment-gold" />,
    INVESTMENT_REDEMPTION: <ArrowDownRight className="h-4 w-4 text-investment-gold" />,
    FEE: <Info className="h-4 w-4 text-muted-foreground" />,
    ADJUSTMENT: <Info className="h-4 w-4 text-muted-foreground" />,
  };
  return <>{map[type] || <Info className="h-4 w-4" />}</>;
}
