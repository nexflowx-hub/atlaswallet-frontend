"use client";

import { useState, useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  Repeat2,
  AlertCircle,
  Clock,
  Info,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { plannedEndpoints } from "@/lib/feature-flags";
import { demoAccess } from "@/lib/mock-data";

const ASSETS = [
  { code: "BRL", name: "Brazilian Real", type: "FIAT", network: "PIX" },
  { code: "EUR", name: "Euro", type: "FIAT", network: "SEPA" },
  { code: "USD", name: "US Dollar", type: "FIAT", network: "SWIFT" },
  { code: "GBP", name: "Pound Sterling", type: "FIAT", network: "SWIFT" },
  { code: "USDT", name: "Tether USD", type: "CRYPTO", network: "ETHEREUM" },
  { code: "USDC", name: "USD Coin", type: "CRYPTO", network: "SOLANA" },
  { code: "BTC", name: "Bitcoin", type: "CRYPTO", network: "ETHEREUM" },
  { code: "ETH", name: "Ether", type: "CRYPTO", network: "ETHEREUM" },
];

export default function ExchangePage() {
  const [payAsset, setPayAsset] = useState("BRL");
  const [receiveAsset, setReceiveAsset] = useState("USDT");
  const [payAmount, setPayAmount] = useState("1000");

  const payAssetInfo = ASSETS.find((a) => a.code === payAsset)!;
  const receiveAssetInfo = ASSETS.find((a) => a.code === receiveAsset)!;

  // Illustrative rate (NOT authoritative — backend quote is authoritative)
  const rate = useMemo(() => illustrativeRate(payAsset, receiveAsset), [payAsset, receiveAsset]);
  const payAmountNum = Number(payAmount) || 0;
  const receiveAmount = payAmountNum * rate;
  const atlasFee = payAmountNum * 0.003;
  const providerFee = payAssetInfo.type === "CRYPTO" ? 0.0005 : 0;
  const net = receiveAmount;

  const exchangeEnabled = demoAccess.effectiveCapabilities.exchange;

  function swap() {
    setPayAsset(receiveAsset);
    setReceiveAsset(payAsset);
  }

  function getQuote() {
    if (!plannedEndpoints.quotes) {
      toast.info("Backend /api/v1/quotes endpoint pending — no fake quote generated.");
      return;
    }
    toast.success("Quote requested");
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Exchange · Convert
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Convert assets
          </h1>
        </div>
        <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
          <AlertCircle className="h-3 w-3 mr-1" />
          Quote from backend
        </Badge>
      </div>

      {!exchangeEnabled && (
        <Card className="mt-5 rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Lock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Exchange is currently disabled</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The backend reports <code className="font-mono">effectiveCapabilities.exchange = false</code>.
                Operations stay disabled until backend policy enables execution. The UI is prepared and
                ready to enable.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-5 grid lg:grid-cols-5 gap-4">
        {/* Convert card */}
        <Card className="premium-card rounded-2xl lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Convert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Pay */}
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">You pay</Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                  className="border-0 bg-transparent text-2xl font-semibold tnum p-0 h-auto focus-visible:ring-0"
                />
                <AssetPicker value={payAsset} onChange={setPayAsset} exclude={receiveAsset} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Available: {payAssetInfo.name} · {payAssetInfo.network}
              </p>
            </div>

            {/* Swap button */}
            <div className="flex justify-center -my-1.5 relative z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={swap}
                className="rounded-full border-border bg-surface hover:bg-surface-hover hover:rotate-180 transition-transform duration-300"
                aria-label="Swap assets"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Receive */}
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">You receive (estimated)</Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  readOnly
                  value={receiveAmount.toFixed(6)}
                  className="border-0 bg-transparent text-2xl font-semibold tnum p-0 h-auto focus-visible:ring-0"
                />
                <AssetPicker value={receiveAsset} onChange={setReceiveAsset} exclude={payAsset} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {receiveAssetInfo.name} · {receiveAssetInfo.network}
              </p>
            </div>

            <Button
              className="w-full bg-brand hover:bg-brand-bright text-white"
              disabled={!exchangeEnabled || !plannedEndpoints.quotes}
              onClick={getQuote}
            >
              {!plannedEndpoints.quotes ? "Backend /quotes pending" : "Get authoritative quote"}
              <Repeat2 className="ml-2 h-4 w-4" />
            </Button>
            {!plannedEndpoints.quotes && (
              <p className="text-[10px] text-muted-foreground text-center">
                No fake quote is generated. The UI is ready to consume /api/v1/quotes once live.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Fee breakdown */}
        <Card className="premium-card rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Fee breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <FeeRow label="Gross amount" value={`${payAmount} ${payAsset}`} hint="Your input" />
            <FeeRow
              label="Indicative rate"
              value={`1 ${payAsset} ≈ ${rate.toFixed(6)} ${receiveAsset}`}
              hint="Illustrative — backend quote is authoritative"
            />
            <FeeRow label="Atlas service fee" value={`${atlasFee.toFixed(6)} ${payAsset}`} hint="0.30% · from BLACK_30 (not universal)" />
            {payAssetInfo.type === "CRYPTO" && (
              <FeeRow label="Provider / network fee" value={`${providerFee.toFixed(6)} ${payAsset}`} hint="Provider-dependent" />
            )}
            <div className="h-px bg-border my-1" />
            <FeeRow label="Net you receive" value={`${net.toFixed(6)} ${receiveAsset}`} primary />
            <FeeRow
              label="Quote expiry"
              value="—"
              hint="Set once backend quote is requested"
            />

            <div className="mt-3 pt-3 border-t border-border space-y-2 text-[10px] text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                Fees come from the backend quote/transaction snapshot — never computed solely in the browser.
              </p>
              <p className="flex items-start gap-1.5">
                <Clock className="h-3 w-3 shrink-0 mt-0.5" />
                Stale quotes cannot be executed. Provider maintenance is shown as a neutral retryable state.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function FeeRow({
  label,
  value,
  hint,
  primary,
}: {
  label: string;
  value: string;
  hint?: string;
  primary?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className={primary ? "text-foreground font-medium" : "text-muted-foreground"}>{label}</p>
        {hint && <p className="text-[10px] text-muted-foreground/70">{hint}</p>}
      </div>
      <p className={`tnum text-right ${primary ? "text-foreground font-semibold" : ""}`}>{value}</p>
    </div>
  );
}

function AssetPicker({
  value,
  onChange,
  exclude,
}: {
  value: string;
  onChange: (v: string) => void;
  exclude: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 cursor-pointer"
      aria-label="Select asset"
    >
      {ASSETS.filter((a) => a.code !== exclude).map((a) => (
        <option key={a.code} value={a.code} className="bg-surface">
          {a.code} · {a.name}
        </option>
      ))}
    </select>
  );
}

function illustrativeRate(pay: string, receive: string): number {
  // Stable illustrative rates in BRL equivalent (for preview only)
  const brl: Record<string, number> = {
    BRL: 1,
    EUR: 5.5,
    USD: 5.05,
    GBP: 6.4,
    USDT: 5.05,
    USDC: 5.05,
    BTC: 320000,
    ETH: 18000,
  };
  const payInBrl = brl[pay] || 1;
  const receiveInBrl = brl[receive] || 1;
  return payInBrl / receiveInBrl;
}
