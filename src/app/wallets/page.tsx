"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoWallets } from "@/lib/mock-data";
import { BRL, formatAmount, brlRate, cryptoRate, AssetIcon } from "@/lib/portfolio-format";

type Filter = "ALL" | "FIAT" | "CRYPTO";

export default function WalletsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const filtered = demoWallets.filter((w) => {
    if (filter !== "ALL" && w.asset.type !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        w.asset.code.toLowerCase().includes(q) ||
        w.asset.name.toLowerCase().includes(q) ||
        w.asset.network.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Wallets · All assets
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Your money & crypto
          </h1>
        </div>
        <Button className="bg-brand hover:bg-brand-bright text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add money
        </Button>
      </div>

      <Card className="mt-5 premium-card rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search asset, name or network"
                className="pl-9 bg-surface/60 border-border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList className="bg-surface/60 border border-border">
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="FIAT">Money</TabsTrigger>
                <TabsTrigger value="CRYPTO">Crypto</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-3">
        {filtered.map((w) => {
          const valueBRL =
            Number(w.balance.available) *
            (w.asset.type === "FIAT" ? brlRate(w.asset.code) : cryptoRate(w.asset.code));
          return (
            <Card key={w.id} className="premium-card premium-card-hover rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <AssetIcon code={w.asset.code} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/wallets/${w.id}`} className="text-base font-semibold hover:text-brand transition-colors">
                        {w.asset.code}
                      </Link>
                      <Badge variant="outline" className="border-border bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                        {w.asset.network}
                      </Badge>
                      {w.status !== "ACTIVE" && (
                        <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
                          {w.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.asset.name}</p>
                  </div>

                  <div className="hidden sm:grid grid-cols-3 gap-6 text-right">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Available</p>
                      <p className="text-sm font-medium tnum">
                        {formatAmount(w.balance.available, w.asset.decimals)}{" "}
                        <span className="text-xs text-muted-foreground">{w.asset.code}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending</p>
                      <p className="text-sm font-medium tnum text-muted-foreground">
                        {formatAmount(w.balance.pending, w.asset.decimals)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. value</p>
                      <p className="text-sm font-medium tnum">{BRL.format(valueBRL)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {w.asset.depositEnabled && (
                      <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-success hover:bg-success/10" aria-label="Receive">
                        <Link href={`/wallets/${w.id}`}>
                          <ArrowDownToLine className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {w.asset.withdrawEnabled && (
                      <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-brand hover:bg-brand/10" aria-label="Send">
                        <Link href={`/wallets/${w.id}`}>
                          <ArrowUpFromLine className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {w.asset.exchangeEnabled && (
                      <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-crypto-purple hover:bg-crypto-purple/10" aria-label="Exchange">
                        <Link href="/exchange">
                          <Repeat2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground" aria-label="Open wallet">
                      <Link href={`/wallets/${w.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Mobile: condensed info */}
                <div className="mt-3 sm:hidden grid grid-cols-3 gap-2 text-center pt-3 border-t border-border/50">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Available</p>
                    <p className="text-sm font-medium tnum">{formatAmount(w.balance.available, w.asset.decimals)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending</p>
                    <p className="text-sm font-medium tnum text-muted-foreground">{formatAmount(w.balance.pending, w.asset.decimals)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Value</p>
                    <p className="text-sm font-medium tnum">{BRL.format(valueBRL)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="premium-card rounded-2xl">
            <CardContent className="py-12 text-center">
              <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No wallets match this filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
