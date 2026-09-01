"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Wallet, Bitcoin, Repeat2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WORLDS = [
  {
    key: "money",
    title: "Money",
    icon: Wallet,
    copy: "Multi-currency wallets prepared for BRL, EUR, USD and GBP.",
    chips: ["BRL", "EUR", "USD", "GBP"],
    accent: "text-success",
    ring: "bg-success/10",
    border: "group-hover:border-success/30",
  },
  {
    key: "crypto",
    title: "Crypto",
    icon: Bitcoin,
    copy: "Manage supported digital assets and networks through AtlasWallet infrastructure and eligible providers.",
    chips: ["USDT", "USDC", "BTC", "ETH", "SOL"],
    accent: "text-crypto-purple",
    ring: "bg-crypto-purple/10",
    border: "group-hover:border-crypto-purple/30",
  },
  {
    key: "exchange",
    title: "Exchange",
    icon: Repeat2,
    copy: "Simple fiat and crypto conversion with a clear quote and fee breakdown before confirmation.",
    chips: ["Fiat ↔ Crypto", "Crypto ↔ Crypto"],
    accent: "text-brand",
    ring: "bg-brand/10",
    border: "group-hover:border-brand/30",
  },
  {
    key: "invest",
    title: "Invest",
    icon: TrendingUp,
    copy: "Eligible private opportunities subject to product terms, jurisdiction and account eligibility.",
    chips: ["Mobility", "Real Estate", "Private Opportunities"],
    accent: "text-investment-gold",
    ring: "bg-investment-gold/10",
    border: "group-hover:border-investment-gold/30",
  },
];

export function FourWorldsSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-4 border-border text-muted-foreground uppercase tracking-[0.16em] text-[10px]">
            One account · four worlds
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
            Money, crypto, exchange and investments —{" "}
            <span className="gradient-text">in one intelligent portfolio.</span>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            AtlasWallet brings the four financial worlds under a single, premium interface —
            so you can move between fiat, digital assets, conversion and eligible private
            opportunities without juggling tabs, custodians or spreadsheets.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORLDS.map((w, i) => (
            <motion.div
              key={w.key}
              initial={reduce ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={cn(
                "group premium-card premium-card-hover rounded-2xl p-6 border border-border/60 transition-colors",
                w.border
              )}
            >
              <div className={cn("inline-flex rounded-xl p-2.5", w.ring, w.accent)}>
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.copy}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {w.chips.map((chip) => (
                  <span
                    key={chip}
                    className={cn(
                      "rounded-full border border-border bg-surface/60 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* World animation motif */}
        <WorldAnimation />
      </div>
    </section>
  );
}

function WorldAnimation() {
  return (
    <div className="mt-20 relative">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold tracking-tight">
          Built for a connected financial world.
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          A conceptual network visualization — not a claim that every rail is live in every country.
          Product availability is jurisdiction, eligibility and provider dependent.
        </p>
      </div>
      <div className="mt-10 relative h-72 sm:h-80 rounded-3xl overflow-hidden premium-card">
        <WorldMapSvg />
      </div>
    </div>
  );
}

function WorldMapSvg() {
  // Stylized world horizon — abstract dots, not a literal map.
  const dots: { x: number; y: number; size: number; delay: number }[] = [];
  const cols = 24;
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Pseudo-random visibility
      const seed = (r * 7 + c * 11) % 9;
      if (seed < 4) continue;
      const x = (c / (cols - 1)) * 100;
      const y = (r / (rows - 1)) * 100;
      const size = 1 + (seed % 3) * 0.7;
      dots.push({ x, y, size, delay: (r + c) * 0.04 });
    }
  }
  return (
    <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <radialGradient id="world-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1687FF" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#1687FF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1687FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="conn-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1687FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#1687FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1687FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="50" fill="url(#world-glow)" />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.size * 0.18}
          fill="#3EA0FF"
          opacity={0.35}
        >
          <animate
            attributeName="opacity"
            values="0.15;0.55;0.15"
            dur="3.6s"
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* Connection arcs */}
      <path d="M 18 30 Q 35 5 50 18" stroke="url(#conn-grad)" strokeWidth="0.18" fill="none" />
      <path d="M 50 18 Q 65 5 82 28" stroke="url(#conn-grad)" strokeWidth="0.18" fill="none" />
      <path d="M 30 38 Q 50 18 70 38" stroke="url(#conn-grad)" strokeWidth="0.18" fill="none" />
      {/* Hub nodes */}
      {[
        { x: 18, y: 30, label: "Brazil" },
        { x: 50, y: 18, label: "UK/EU" },
        { x: 82, y: 28, label: "Network" },
      ].map((hub) => (
        <g key={hub.label}>
          <circle cx={hub.x} cy={hub.y} r="0.9" fill="#1687FF" />
          <circle cx={hub.x} cy={hub.y} r="2" fill="none" stroke="#1687FF" strokeWidth="0.1" opacity="0.4">
            <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
