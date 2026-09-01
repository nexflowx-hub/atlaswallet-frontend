"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat2,
  Copy,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { demoWallets, DEMO_LABEL } from "@/lib/mock-data";
import { plannedEndpoints } from "@/lib/feature-flags";
import { BRL, formatAmount, brlRate, cryptoRate, AssetIcon } from "@/lib/portfolio-format";

export default function WalletDetailPage({
  params,
}: {
  params: Promise<{ walletId: string }>;
}) {
  const { walletId } = use(params);
  const wallet = demoWallets.find((w) => w.id === walletId);

  if (!wallet) {
    return (
      <AppShell>
        <Card className="premium-card rounded-2xl">
          <CardContent className="py-16 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-warning" />
            <p className="mt-3 text-base font-medium">Wallet not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The wallet you&apos;re looking for doesn&apos;t exist or was removed.
            </p>
            <Button asChild className="mt-6 bg-brand hover:bg-brand-bright text-white">
              <Link href="/wallets">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to wallets
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const valueBRL =
    Number(wallet.balance.available) *
    (wallet.asset.type === "FIAT" ? brlRate(wallet.asset.code) : cryptoRate(wallet.asset.code));

  return (
    <AppShell>
      <Link
        href="/wallets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to wallets
      </Link>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AssetIcon code={wallet.asset.code} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">
                {wallet.asset.code}
              </h1>
              <Badge variant="outline" className="border-border bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                {wallet.asset.network}
              </Badge>
              <Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[10px] uppercase tracking-wider">
                {wallet.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{wallet.asset.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={!wallet.asset.depositEnabled}
            className="bg-success/15 hover:bg-success/25 text-success border border-success/30"
            onClick={() => toast.info("Receive — execution enabled when backend supports deposit-intents")}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Receive
          </Button>
          <Button
            disabled={!wallet.asset.withdrawEnabled}
            className="bg-brand hover:bg-brand-bright text-white"
            onClick={() => toast.info("Send — execution enabled when backend supports withdrawal-intents")}
          >
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button
            asChild
            disabled={!wallet.asset.exchangeEnabled}
            variant="outline"
            className="border-border hover:bg-surface-hover"
          >
            <Link href="/exchange">
              <Repeat2 className="mr-2 h-4 w-4" />
              Exchange
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Balances */}
        <Card className="premium-card rounded-2xl lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BalanceRow label="Available" amount={wallet.balance.available} decimals={wallet.asset.decimals} code={wallet.asset.code} primary />
            <BalanceRow label="Pending" amount={wallet.balance.pending} decimals={wallet.asset.decimals} code={wallet.asset.code} muted />
            <BalanceRow label="Reserved" amount={wallet.balance.reserved} decimals={wallet.asset.decimals} code={wallet.asset.code} muted />
            <BalanceRow label="Blocked" amount={wallet.balance.blocked} decimals={wallet.asset.decimals} code={wallet.asset.code} danger />
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimated base value</p>
              <p className="mt-1 text-xl font-semibold tnum">{BRL.format(valueBRL)}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                {DEMO_LABEL} · authoritative value from backend quote.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Receive / Send tabs */}
        <Card className="premium-card rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="receive">
              <TabsList className="bg-surface/60 border border-border">
                <TabsTrigger value="receive">Receive</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="receive" className="mt-4">
                <ReceiveTab asset={wallet.asset} />
              </TabsContent>

              <TabsContent value="send" className="mt-4">
                <SendTab asset={wallet.asset} />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <WalletActivityTab walletId={wallet.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function BalanceRow({
  label,
  amount,
  decimals,
  code,
  primary,
  muted,
  danger,
}: {
  label: string;
  amount: string;
  decimals: number;
  code: string;
  primary?: boolean;
  muted?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`tnum ${primary ? "text-base font-semibold" : "text-sm"} ${
          danger ? "text-danger" : muted ? "text-muted-foreground" : ""
        }`}
      >
        {formatAmount(amount, decimals)}{" "}
        <span className="text-xs text-muted-foreground">{code}</span>
      </span>
    </div>
  );
}

function ReceiveTab({ asset }: { asset: { code: string; network: string; type: string } }) {
  const address =
    asset.type === "CRYPTO"
      ? "0x4f3eDF5B8e3C5d8e7A8f9E2C5b7E1d8a4F3c9b6E"
      : "IBAN: PT50 0000 0000 0012 3456 7890 1";
  const [copied, setCopied] = useState(false);

  function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div>
      {!plannedEndpoints.depositIntents && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Discovery UI only. Confirmation disabled — backend deposit-intents endpoint is not yet live.
          </p>
        </div>
      )}
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {asset.type === "CRYPTO" ? "Wallet address" : "Bank reference (IBAN)"}
      </Label>
      <div className="mt-2 flex gap-2">
        <Input readOnly value={address} className="bg-surface/60 font-mono text-xs" />
        <Button variant="outline" size="icon" onClick={copy} aria-label="Copy address">
          {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-border bg-surface/60 p-3">
          <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Network</p>
          <p className="mt-1 font-medium">{asset.network}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-3">
          <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Asset</p>
          <p className="mt-1 font-medium">{asset.code}</p>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-muted-foreground/70 flex items-start gap-1.5">
        <Info className="h-3 w-3 mt-0.5 shrink-0" />
        Only send {asset.code} on the {asset.network} network. Sending other assets or networks may result in permanent loss.
      </p>
    </div>
  );
}

function SendTab({ asset }: { asset: { code: string; decimals: number } }) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div>
      {!plannedEndpoints.withdrawalIntents && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <Lock className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Execution disabled. Backend withdrawal-intents endpoint is not yet live — the UI is prepared and quote will be authoritative.
          </p>
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dest">Destination address</Label>
          <Input
            id="dest"
            placeholder={asset.code === "BRL" ? "PIX key (CPF, email, phone or random key)" : "Wallet address"}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-surface/60 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount</Label>
            <span className="text-[10px] text-muted-foreground">Available: 0.00 {asset.code}</span>
          </div>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-surface/60 pr-20 tnum"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              {asset.code}
            </span>
          </div>
        </div>
        <Button
          className="w-full bg-brand hover:bg-brand-bright text-white"
          disabled={!plannedEndpoints.withdrawalIntents}
          onClick={() => toast.info("Withdrawal-intents endpoint pending")}
        >
          Continue to confirmation
        </Button>
      </div>
    </div>
  );
}

function WalletActivityTab({ walletId }: { walletId: string }) {
  // Stub — would call /api/v1/activity?walletId=... once backend supports it
  return (
    <div className="text-center py-10">
      <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">
        Wallet-level activity will appear here once the backend MVP endpoint is live.
      </p>
      <p className="mt-1 text-[10px] text-muted-foreground/70">Reference: {walletId}</p>
    </div>
  );
}
