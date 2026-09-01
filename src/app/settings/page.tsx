"use client";

import { useState } from "react";
import {
  Bell,
  Globe,
  Lock,
  Smartphone,
  Shield,
  LogOut,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/auth-context";
import { LanguageSelector } from "@/components/shared/language-selector";
import { toast } from "sonner";
import { demoMe } from "@/lib/auth/auth-context";

export default function SettingsPage() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    transactions: true,
    security: true,
    marketing: false,
  });

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/");
  }

  return (
    <AppShell>
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Settings · Preferences
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
          Settings
        </h1>
      </div>

      {/* Account / plan */}
      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Email" value={session?.user.email || "—"} />
          <Row
            label="Pricing plan"
            value={
              <Badge variant="outline" className="border-brand/40 bg-brand/5 text-brand-bright uppercase tracking-wider text-[10px]">
                {demoMe.account.pricingPlan.code.replace("_", " ")}
              </Badge>
            }
          />
          <Row label="Identity level" value={demoMe.account.identityLevel.replace("_", " ")} />
          <Row label="KYC status" value={demoMe.account.kycStatus.replace("_", " ")} />
          <Row label="Base currency" value={demoMe.account.baseCurrency} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/50">
          {[
            { key: "email", label: "Email notifications", desc: "Account, security and product updates" },
            { key: "push", label: "Push notifications", desc: "Instant alerts on this device" },
            { key: "transactions", label: "Transaction alerts", desc: "Notify on every operation" },
            { key: "security", label: "Security alerts", desc: "Login from new device, password changes" },
            { key: "marketing", label: "Marketing communications", desc: "Product launches and opportunities" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <Label className="text-sm font-medium">{n.label}</Label>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={notifications[n.key as keyof typeof notifications]}
                onCheckedChange={(v) =>
                  setNotifications((s) => ({ ...s, [n.key]: v }))
                }
                aria-label={n.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language & region */}
      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language & region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Display language</Label>
              <p className="text-xs text-muted-foreground">
                en-GB · pt-BR · pt-PT — suggested from browser, never forced by IP.
              </p>
            </div>
            <LanguageSelector />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <SettingLinkRow
            icon={Lock}
            label="Change password"
            desc="Update your account password"
            href="/forgot-password"
          />
          <Separator className="bg-border/50" />
          <SettingLinkRow
            icon={Smartphone}
            label="Two-factor authentication"
            desc="Coming soon — adds an extra layer of security"
            href="#"
            badge="Coming soon"
          />
          <Separator className="bg-border/50" />
          <SettingLinkRow
            icon={AlertCircle}
            label="Active sessions"
            desc="Manage devices currently signed in"
            href="#"
          />
        </CardContent>
      </Card>

      {/* Session */}
      <Card className="mt-5 rounded-2xl border-danger/30 bg-danger/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-danger">End session</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sign out from this device.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-danger/40 text-danger hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SettingLinkRow({
  icon: Icon,
  label,
  desc,
  href,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  href: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium flex items-center gap-2">
            {label}
            {badge && (
              <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[10px] uppercase tracking-wider">
                {badge}
              </Badge>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}
