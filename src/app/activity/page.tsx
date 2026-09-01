"use client";

import { AlertCircle, Clock, Inbox } from "lucide-react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plannedEndpoints } from "@/lib/feature-flags";
import { demoActivity, DEMO_LABEL } from "@/lib/mock-data";
import { Plus, Send, Repeat2, TrendingUp, ArrowDownRight, Info } from "lucide-react";

export default function ActivityPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Activity · Recent
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Activity
          </h1>
        </div>
        {!plannedEndpoints.activity && (
          <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
            <AlertCircle className="h-3 w-3 mr-1" />
            PLANNED
          </Badge>
        )}
      </div>

      {!plannedEndpoints.activity && (
        <Card className="mt-5 rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Backend endpoint pending</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The <code className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded">/api/v1/activity</code>
                {" "}endpoint is not yet live. Items below are {DEMO_LABEL.toLowerCase()}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {demoActivity.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto rounded-full bg-surface p-3 w-fit">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">No activity yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {demoActivity.map((a) => (
                <li key={a.id} className="px-5 py-4 flex items-center gap-3 hover:bg-surface-hover/40 transition-colors">
                  <div className="rounded-lg bg-surface p-2">
                    <ActivityIcon type={a.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString("pt-BR")} · {a.assetCode}
                      {a.network ? ` · ${a.network}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium tnum">
                      {a.amount} <span className="text-xs text-muted-foreground">{a.assetCode}</span>
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider ${
                      a.status === "COMPLETED" ? "text-success" :
                      a.status === "PENDING" ? "text-warning" :
                      a.status === "FAILED" ? "text-danger" : "text-muted-foreground"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, React.ReactNode> = {
    DEPOSIT: <Plus className="h-4 w-4 text-success" />,
    WITHDRAWAL: <Send className="h-4 w-4 text-brand" />,
    EXCHANGE: <Repeat2 className="h-4 w-4 text-crypto-purple" />,
    INVESTMENT_SUBSCRIPTION: <TrendingUp className="h-4 w-4 text-investment-gold" />,
    INVESTMENT_REDEMPTION: <ArrowDownRight className="h-4 w-4 text-investment-gold" />,
    FEE: <Info className="h-4 w-4 text-muted-foreground" />,
    ADJUSTMENT: <Info className="h-4 w-4 text-muted-foreground" />,
    CRYPTO_DEPOSIT: <Plus className="h-4 w-4 text-success" />,
  };
  return <>{map[type] || <Info className="h-4 w-4" />}</>;
}
