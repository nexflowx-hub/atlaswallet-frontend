"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  Landmark,
  Bitcoin,
  CreditCard,
  MoreHorizontal,
  Lock,
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { plannedEndpoints } from "@/lib/feature-flags";
import { demoAccess } from "@/lib/mock-data";

type MethodKey = "pix" | "bank" | "crypto" | "buyCrypto" | "other";

const METHODS: {
  key: MethodKey;
  label: string;
  copy: string;
  icon: typeof QrCode;
  accent: string;
  bg: string;
}[] = [
  {
    key: "pix",
    label: "PIX",
    copy: "BRL deposit",
    icon: QrCode,
    accent: "text-success",
    bg: "bg-success/10",
  },
  {
    key: "bank",
    label: "Bank Transfer",
    copy: "EUR / IBAN / SEPA",
    icon: Landmark,
    accent: "text-brand",
    bg: "bg-brand/10",
  },
  {
    key: "crypto",
    label: "Crypto",
    copy: "Receive supported digital assets",
    icon: Bitcoin,
    accent: "text-crypto-purple",
    bg: "bg-crypto-purple/10",
  },
  {
    key: "buyCrypto",
    label: "Buy Crypto",
    copy: "Available fiat-to-crypto routes",
    icon: CreditCard,
    accent: "text-brand-bright",
    bg: "bg-brand/5",
  },
  {
    key: "other",
    label: "Other methods",
    copy: "Available for eligible accounts only",
    icon: MoreHorizontal,
    accent: "text-muted-foreground",
    bg: "bg-surface",
  },
];

export default function AddMoneyPage() {
  const [selected, setSelected] = useState<MethodKey | null>(null);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const moneyDepositEnabled = demoAccess.effectiveCapabilities.moneyDeposit;
  const cryptoDepositEnabled = demoAccess.effectiveCapabilities.cryptoDeposit;

  const isMethodEnabled: Record<MethodKey, boolean> = {
    pix: moneyDepositEnabled,
    bank: moneyDepositEnabled,
    crypto: cryptoDepositEnabled,
    buyCrypto: false, // depends on deposit-intents + buy routes
    other: false,
  };

  const selectedMethod = METHODS.find((m) => m.key === selected);

  function copyPixKey() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("atlaswallet@pix.atlaswallet.org");
      setCopied(true);
      toast.success("PIX key copied");
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <AppShell>
      <Link
        href="/wallets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to wallets
      </Link>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Add money · Choose method
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Add money to your account
          </h1>
        </div>
        {!plannedEndpoints.depositIntents && (
          <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
            <AlertCircle className="h-3 w-3 mr-1" />
            Discovery only
          </Badge>
        )}
      </div>

      {!moneyDepositEnabled && !cryptoDepositEnabled && (
        <Alert className="mt-5 border-warning/30 bg-warning/5">
          <Lock className="h-4 w-4 text-warning" />
          <AlertDescription className="text-muted-foreground">
            Add money is currently disabled — your effective capabilities report
            <code className="mx-1 font-mono text-[10px] bg-surface px-1 py-0.5 rounded">moneyDeposit = false</code>
            and
            <code className="mx-1 font-mono text-[10px] bg-surface px-1 py-0.5 rounded">cryptoDeposit = false</code>.
            Operations stay disabled until backend policy enables them. UI is prepared and ready to enable.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-5 grid lg:grid-cols-12 gap-4">
        {/* Method list */}
        <div className="lg:col-span-5 space-y-2">
          {METHODS.map((m) => {
            const enabled = isMethodEnabled[m.key];
            const isActive = selected === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`w-full text-left premium-card rounded-xl p-4 transition-all ${
                  isActive ? "border-brand ring-1 ring-brand/30" : "premium-card-hover"
                } ${!enabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${m.bg} ${m.accent} shrink-0`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{m.label}</p>
                      {!enabled && (
                        <Badge variant="outline" className="border-muted-foreground/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <Lock className="h-2.5 w-2.5 mr-0.5" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.copy}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}

          {/* Provider-neutral notice */}
          <div className="rounded-xl border border-border bg-surface/40 p-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              AtlasWallet uses provider-neutral UI. You see <span className="text-foreground">PIX</span>,
              not the internal provider code. Availability is governed by backend policy, route and risk rules — never assumed.
            </p>
          </div>
        </div>

        {/* Selected method detail */}
        <div className="lg:col-span-7">
          {selectedMethod ? (
            <Card className="premium-card rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${selectedMethod.bg} ${selectedMethod.accent}`}>
                    <selectedMethod.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {selectedMethod.label}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{selectedMethod.copy}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MethodDetail
                  method={selected}
                  enabled={isMethodEnabled[selected]}
                  amount={amount}
                  setAmount={setAmount}
                  copied={copied}
                  onCopyPix={copyPixKey}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="premium-card rounded-2xl">
              <CardContent className="py-16 text-center">
                <div className="mx-auto rounded-full bg-surface p-3 w-fit">
                  <Landmark className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">Choose a method to begin</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Select PIX, Bank Transfer, Crypto, Buy Crypto or Other to see details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function MethodDetail({
  method,
  enabled,
  amount,
  setAmount,
  copied,
  onCopyPix,
}: {
  method: MethodKey;
  enabled: boolean;
  amount: string;
  setAmount: (v: string) => void;
  copied: boolean;
  onCopyPix: () => void;
}) {
  if (!enabled) {
    return (
      <div className="space-y-4">
        <Alert className="border-warning/30 bg-warning/5">
          <Lock className="h-4 w-4 text-warning" />
          <AlertDescription className="text-muted-foreground">
            This method is currently disabled. Backend policy will enable execution once the relevant
            endpoint and route are available. UI is prepared — no action is required from you.
          </AlertDescription>
        </Alert>
        <div className="rounded-lg border border-border bg-surface/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            What you&apos;ll see when enabled
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
              Authoritative deposit instructions from backend
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
              Clear fee breakdown (if applicable)
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
              Confirmation step before any commitment
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (method === "pix") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (BRL)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-surface/60 pr-12 tnum text-lg"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              BRL
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>PIX key (provider-neutral)</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value="atlaswallet@pix.atlaswallet.org"
              className="bg-surface/60 font-mono text-xs"
            />
            <Button variant="outline" size="icon" onClick={onCopyPix} aria-label="Copy PIX key">
              {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Confirmation
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            You&apos;ll see the deposit confirmation here once the backend PIX intent endpoint is live.
            Until then, no deposit is created.
          </p>
        </div>

        <Button
          className="w-full bg-success/15 hover:bg-success/25 text-success border border-success/30"
          disabled={!plannedEndpoints.depositIntents}
          onClick={() => toast.info("PIX deposit-intents endpoint pending")}
        >
          {!plannedEndpoints.depositIntents ? "Backend endpoint pending" : "Confirm PIX deposit"}
        </Button>
      </div>
    );
  }

  if (method === "bank") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank-amount">Amount</Label>
          <div className="relative">
            <Input
              id="bank-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-surface/60 pr-12 tnum text-lg"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              EUR
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Beneficiary</Label>
            <p className="mt-1 text-sm font-medium">Atlas Wallet Ltd</p>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">IBAN</Label>
            <p className="mt-1 text-sm font-mono">PT50 0000 0000 0012 3456 7890 1</p>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">BIC/SWIFT</Label>
            <p className="mt-1 text-sm font-mono">ATLWPTPL</p>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Reference</Label>
            <p className="mt-1 text-sm font-mono">AW-USER-DEMO</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">SEPA timing</p>
          <p className="mt-1 text-xs text-muted-foreground">
            SEPA Instant when supported. Standard SEPA: 1 business day.
          </p>
        </div>

        <Button
          className="w-full bg-brand hover:bg-brand-bright text-white"
          disabled={!plannedEndpoints.depositIntents}
          onClick={() => toast.info("Bank deposit-intents endpoint pending")}
        >
          {!plannedEndpoints.depositIntents ? "Backend endpoint pending" : "Confirm deposit details"}
        </Button>
      </div>
    );
  }

  if (method === "crypto") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Asset & network</Label>
          <select className="w-full bg-surface/60 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40">
            <option>USDT · Ethereum</option>
            <option>USDT · Tron</option>
            <option>USDT · Solana</option>
            <option>USDC · Ethereum</option>
            <option>USDC · Solana</option>
            <option>BTC · Bitcoin network</option>
            <option>ETH · Ethereum</option>
            <option>SOL · Solana</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Deposit address</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value="0x4f3eDF5B8e3C5d8e7A8f9E2C5b7E1d8a4F3c9b6E"
              className="bg-surface/60 font-mono text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText("0x4f3eDF5B8e3C5d8e7A8f9E2C5b7E1d8a4F3c9b6E");
                  toast.success("Address copied");
                }
              }}
              aria-label="Copy address"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Alert className="border-danger/30 bg-danger/5">
          <AlertCircle className="h-4 w-4 text-danger" />
          <AlertDescription className="text-xs text-muted-foreground">
            Only send the selected asset on the selected network. Sending other assets or networks may result in permanent loss.
          </AlertDescription>
        </Alert>

        <Button
          className="w-full bg-crypto-purple/15 hover:bg-crypto-purple/25 text-crypto-purple border border-crypto-purple/30"
          disabled={!plannedEndpoints.depositIntents}
        >
          {!plannedEndpoints.depositIntents ? "Backend endpoint pending" : "I understand — show QR code"}
        </Button>
      </div>
    );
  }

  if (method === "buyCrypto") {
    return (
      <div className="space-y-4">
        <Alert className="border-warning/30 bg-warning/5">
          <Lock className="h-4 w-4 text-warning" />
          <AlertDescription className="text-muted-foreground">
            Buy Crypto routes are being prepared. Once the backend fiat-to-crypto onramp is configured,
            eligible accounts will see available providers here. No provider is shown as available until verified.
          </AlertDescription>
        </Alert>
        <div className="grid sm:grid-cols-2 gap-2">
          {["BRL → USDT", "BRL → USDC", "EUR → BTC", "EUR → ETH", "USD → SOL", "GBP → USDT"].map((r) => (
            <div key={r} className="rounded-lg border border-border bg-surface/40 p-3 text-xs text-muted-foreground flex items-center justify-between">
              {r}
              <Badge variant="outline" className="border-muted-foreground/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                Soon
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // other
  return (
    <div className="space-y-4">
      <Alert className="border-warning/30 bg-warning/5">
        <Lock className="h-4 w-4 text-warning" />
        <AlertDescription className="text-muted-foreground">
          Other methods are available for eligible accounts only. Eligibility is determined by your account policy
          profile, jurisdiction and risk rules. If you have a specific need, contact support.
        </AlertDescription>
      </Alert>
    </div>
  );
}
