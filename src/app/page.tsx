"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Repeat2,
  TrendingUp,
  Globe2,
  Sparkles,
  Lock,
  Eye,
  RefreshCw,
  Banknote,
  Bitcoin,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/shared/logo";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { HeroPortfolioPreview } from "@/components/marketing/hero-portfolio-preview";
import { FourWorldsSection } from "@/components/marketing/four-worlds";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { SecuritySection } from "@/components/marketing/security-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { DEMO_LABEL } from "@/lib/mock-data";
import { institutionalConfig } from "@/config/institutional-config";

export default function HomePage() {
  return (
    <MarketingShell>
      <Hero />
      <TrustBar />
      <FourWorldsSection />
      <ProductShowcase />
      <SecuritySection />
      <SupportSection />
      <FinalCta />
    </MarketingShell>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop layers */}
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="absolute inset-0 radial-glow" aria-hidden />
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-brand/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-crypto-purple/8 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <Badge
              variant="outline"
              className="mb-6 border-brand/30 bg-brand/5 text-brand-bright px-3 py-1 uppercase tracking-[0.16em] text-[10px]"
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              {institutionalConfig.project.tagline}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              One Portfolio.
              <br />
              <span className="gradient-text">Endless Possibilities.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Manage money, digital assets, exchange and eligible private opportunities
              from one intelligent portfolio — built for the UK, EU and Brazil.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-brand hover:bg-brand-bright text-white glow-brand">
                <Link href="/register">
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border bg-surface/40 hover:bg-surface-hover">
                <Link href="/about">Explore AtlasWallet</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Self-declared entry — start in minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                BLACK_30 commercial tier
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                UK · EU · Brazil
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <HeroPortfolioPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Security-first", desc: "Supabase auth · backend-authoritative state" },
    { icon: Globe2, label: "Multi-region", desc: "UK · EU/EEA · Brazil ready" },
    { icon: Lock, label: "Private by design", desc: "No financial state in frontend DB" },
    { icon: Eye, label: "Transparent fees", desc: "Quote before confirmation" },
  ];
  return (
    <section className="border-y border-border bg-background-elevated/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="rounded-lg bg-surface p-2 text-brand shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  const channels = [
    {
      icon: Banknote,
      label: "Email",
      value: institutionalConfig.contacts.email.value,
      href: institutionalConfig.contacts.email.href,
      tone: "brand" as const,
    },
    {
      icon: RefreshCw,
      label: "WhatsApp",
      value: institutionalConfig.contacts.whatsapp.display,
      href: institutionalConfig.contacts.whatsapp.href,
      tone: "success" as const,
    },
    {
      icon: Bitcoin,
      label: "Telegram Manager",
      value: institutionalConfig.contacts.telegramManager.handle,
      href: institutionalConfig.contacts.telegramManager.href,
      tone: "purple" as const,
    },
    {
      icon: Building2,
      label: "News Channel",
      value: institutionalConfig.contacts.telegramNews.handle,
      href: institutionalConfig.contacts.telegramNews.href,
      tone: "brand" as const,
    },
  ];
  const toneMap = {
    brand: "bg-brand/10 text-brand",
    success: "bg-success/10 text-success",
    purple: "bg-crypto-purple/10 text-crypto-purple",
  } as const;
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="mb-4 border-border text-muted-foreground uppercase tracking-[0.16em] text-[10px]">
            Support
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Real humans, when it matters.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Reach AtlasWallet across multiple channels. We never request passwords, seed
            phrases or private keys.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="premium-card premium-card-hover rounded-2xl p-5 group"
            >
              <div className={`inline-flex rounded-lg p-2 ${toneMap[c.tone]}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground group-hover:text-brand transition-colors break-all">
                {c.value}
              </p>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Telegram Bot · {institutionalConfig.contacts.telegramBot.handle} ·{" "}
          <span className="text-warning">{institutionalConfig.contacts.telegramBot.status.replace("_", " ")}</span>
        </p>
      </div>
    </section>
  );
}
