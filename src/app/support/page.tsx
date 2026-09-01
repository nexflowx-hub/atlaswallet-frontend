"use client";

import Link from "next/link";
import { Mail, MessageCircle, Send, AlertCircle, Clock } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { institutionalConfig } from "@/config/institutional-config";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: institutionalConfig.contacts.email.value,
    href: institutionalConfig.contacts.email.href,
    tone: "brand",
    external: true,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: institutionalConfig.contacts.whatsapp.display,
    href: institutionalConfig.contacts.whatsapp.href,
    tone: "success",
    external: true,
  },
  {
    icon: Send,
    label: "Telegram Manager",
    value: institutionalConfig.contacts.telegramManager.handle,
    href: institutionalConfig.contacts.telegramManager.href,
    tone: "purple",
    external: true,
  },
  {
    icon: Send,
    label: "News Channel",
    value: institutionalConfig.contacts.telegramNews.handle,
    href: institutionalConfig.contacts.telegramNews.href,
    tone: "brand",
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

  const content = (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <Badge variant="outline" className="mb-4 border-brand/30 text-brand-bright uppercase tracking-[0.16em] text-[10px]">
            Support
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            Real humans, when it matters.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Reach AtlasWallet across multiple channels. We never request passwords, seed
            phrases or private keys.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid sm:grid-cols-2 gap-4">
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
