"use client";

import Link from "next/link";
import { Mail, MessageCircle, Send } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import {
  getCompanyLine,
  getCopyright,
  institutionalConfig,
} from "@/config/institutional-config";

const COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean; status?: string }[];
}[] = [
  {
    title: "Products",
    links: [
      { label: "Money", href: "/money" },
      { label: "Crypto", href: "/crypto" },
      { label: "Exchange", href: "/exchange" },
      { label: "Invest", href: "/invest" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      { label: "Support", href: "/support" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Risk Disclosure", href: "/legal/risk-disclosure" },
      { label: "Regulatory Status", href: "/legal/regulatory-status" },
      { label: "Complaints", href: "/legal/complaints" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "Email",
        href: institutionalConfig.contacts.email.href,
        external: true,
      },
      {
        label: "WhatsApp",
        href: institutionalConfig.contacts.whatsapp.href,
        external: true,
      },
      {
        label: "Telegram Manager",
        href: institutionalConfig.contacts.telegramManager.href,
        external: true,
      },
      {
        label: "News Channel",
        href: institutionalConfig.contacts.telegramNews.href,
        external: true,
      },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {institutionalConfig.project.positioning}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={institutionalConfig.contacts.email.href}
                aria-label="Email"
                className="rounded-md p-2 text-muted-foreground hover:text-brand hover:bg-surface-hover transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={institutionalConfig.contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                className="rounded-md p-2 text-muted-foreground hover:text-success hover:bg-surface-hover transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={institutionalConfig.contacts.telegramManager.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Telegram"
                className="rounded-md p-2 text-muted-foreground hover:text-crypto-purple hover:bg-surface-hover transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getCompanyLine()}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {institutionalConfig.footer.disclaimer}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
            <p className="text-xs text-muted-foreground">{getCopyright()}</p>
            <p className="text-xs text-muted-foreground/70">
              {institutionalConfig.entity.jurisdiction}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
