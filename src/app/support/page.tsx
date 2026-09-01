"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Send,
  AlertCircle,
  Clock,
  Search,
  Sparkles,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth/auth-context";
import { institutionalConfig } from "@/config/institutional-config";
import { FAQ_ITEMS, FAQ_CATEGORIES, searchFaq, type FaqItem } from "@/lib/support/faq";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: institutionalConfig.contacts.email.value,
    href: institutionalConfig.contacts.email.href,
    tone: "brand" as const,
    external: true,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: institutionalConfig.contacts.whatsapp.display,
    href: institutionalConfig.contacts.whatsapp.href,
    tone: "success" as const,
    external: true,
  },
  {
    icon: Send,
    label: "Telegram Manager",
    value: institutionalConfig.contacts.telegramManager.handle,
    href: institutionalConfig.contacts.telegramManager.href,
    tone: "purple" as const,
    external: true,
  },
  {
    icon: Send,
    label: "News Channel",
    value: institutionalConfig.contacts.telegramNews.handle,
    href: institutionalConfig.contacts.telegramNews.href,
    tone: "brand" as const,
    external: true,
  },
];

const toneMap = {
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  purple: "bg-crypto-purple/10 text-crypto-purple",
} as const;

export default function SupportPage() {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = searchFaq(query);
    if (activeCategory) {
      items = items.filter((i) => i.category === activeCategory);
    }
    return items;
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map: Record<string, FaqItem[]> = {};
    for (const c of FAQ_CATEGORIES) {
      map[c] = filtered.filter((i) => i.category === c);
    }
    return map;
  }, [filtered]);

  const content = (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <Badge variant="outline" className="mb-4 border-brand/30 text-brand-bright uppercase tracking-[0.16em] text-[10px]">
            Support Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            How can we help?
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Search our knowledge base, chat with{" "}
            <span className="text-brand-bright">Atlas AI</span>, or reach a human through your preferred channel.
            We never request passwords, seed phrases or private keys.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search support — e.g. 'PIX', 'USDT', 'Black tier'…"
                className="pl-11 h-12 bg-surface/60 border-border text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick category filter */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                activeCategory === null
                  ? "border-brand bg-brand/10 text-brand-bright"
                  : "border-border bg-surface/60 text-muted-foreground hover:text-foreground hover:border-brand/40"
              }`}
            >
              All
            </button>
            {FAQ_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                  activeCategory === c
                    ? "border-brand bg-brand/10 text-brand-bright"
                    : "border-border bg-surface/60 text-muted-foreground hover:text-foreground hover:border-brand/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas AI banner */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="premium-card rounded-2xl border-brand/30 bg-brand/5 overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-brand to-brand-bright p-3 text-white shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Ask Atlas AI</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Get instant answers about AtlasWallet — money, crypto, exchange, investments, your account and more.
                Tap the floating button at the bottom-right of any page.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider shrink-0 hidden sm:block">
              Available 24/7 · Preview mode
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ results */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <Card className="premium-card rounded-2xl">
            <CardContent className="py-12 text-center">
              <div className="mx-auto rounded-full bg-surface p-3 w-fit">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No results for &quot;{query}&quot;</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Try a different search or contact a human via the channels below.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                }}
                className="mt-4 text-brand"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {FAQ_CATEGORIES.filter((c) => grouped[c]?.length).map((cat) => (
              <div key={cat}>
                <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-3">
                  {cat} · {grouped[cat].length}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {grouped[cat].map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="premium-card rounded-xl px-4 border-border/50"
                    >
                      <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Human channels */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Talk to a human</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reach AtlasWallet across multiple channels — we never request passwords, seed phrases or private keys.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="premium-card premium-card-hover rounded-2xl p-5 group flex items-start gap-4"
            >
              <div className={`rounded-lg p-2 ${toneMap[c.tone as keyof typeof toneMap]} shrink-0`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-sm font-medium text-foreground group-hover:text-brand transition-colors break-all">
                  {c.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <Card className="mt-6 premium-card rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="p-5 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Telegram Bot</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {institutionalConfig.contacts.telegramBot.handle} — status:{" "}
                <span className="text-warning">{institutionalConfig.contacts.telegramBot.status.replace("_", " ")}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 premium-card rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-danger" />
              {institutionalConfig.supportWarning}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              AtlasWallet will never request your password, seed phrase, private keys, 2FA code
              or one-time passcodes. If anyone asks, do not respond — report to{" "}
              <a href={institutionalConfig.contacts.email.href} className="text-brand hover:underline">
                {institutionalConfig.contacts.email.value}
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 premium-card rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" />
              Response times
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>· Email — typically within 24 hours on business days</li>
              <li>· WhatsApp — best-effort during business hours (UTC)</li>
              <li>· Telegram Manager — best-effort during business hours</li>
              <li>· Critical security reports — prioritized</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );

  if (session) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto w-full">{content}</div>
      </AppShell>
    );
  }

  return <MarketingShell>{content}</MarketingShell>;
}
