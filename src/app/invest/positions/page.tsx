"use client";

import Link from "next/link";
import { ChevronRight, Inbox, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { plannedEndpoints } from "@/lib/feature-flags";
import { demoInvestmentPositions } from "@/lib/mock-data";

export default function InvestPositionsPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Invest · My positions
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Investment positions
          </h1>
        </div>
        <Button asChild variant="outline" className="border-border hover:bg-surface-hover">
          <Link href="/invest">
            Browse opportunities
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {!plannedEndpoints.investmentPositions ? (
        <Card className="mt-5 premium-card rounded-2xl">
          <CardContent className="py-12 text-center">
            <div className="mx-auto rounded-full bg-warning/10 p-3 w-fit">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <p className="mt-4 text-sm font-medium">Backend endpoint pending</p>
            <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
              The <code className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded">/api/v1/investments/positions</code>
              {" "}endpoint is not yet live. Positions will appear here once the backend is ready.
            </p>
            <Button asChild variant="outline" className="mt-6 border-border hover:bg-surface-hover">
              <Link href="/invest">Explore opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      ) : demoInvestmentPositions.length === 0 ? (
        <Card className="mt-5 premium-card rounded-2xl">
          <CardContent className="py-12 text-center">
            <div className="mx-auto rounded-full bg-surface p-3 w-fit">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No active positions yet</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Once you subscribe to an opportunity, your positions will appear here.
            </p>
            <Button asChild className="mt-6 bg-brand hover:bg-brand-bright text-white">
              <Link href="/invest">Explore opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 space-y-3">
          {demoInvestmentPositions.map((p) => (
            <Card key={p.id} className="premium-card premium-card-hover rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{p.productName}</h3>
                      <Badge variant="outline" className="border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Opened {new Date(p.openedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current value</p>
                    <p className="text-lg font-semibold tnum">R$ {Number(p.currentValueBRL).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Principal R$ {Number(p.principalBRL).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
