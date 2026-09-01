"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  Repeat2,
  TrendingUp,
  Activity,
  User,
  Settings,
  LifeBuoy,
  LogOut,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/shared/language-selector";
import { demoMe } from "@/lib/auth/auth-context";

const DESKTOP_NAV = [
  { label: "Portfolio", href: "/portfolio", icon: LayoutDashboard },
  { label: "Wallets", href: "/wallets", icon: Wallet },
  { label: "Exchange", href: "/exchange", icon: Repeat2 },
  { label: "Invest", href: "/invest", icon: TrendingUp },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: LifeBuoy },
];

const MOBILE_NAV = [
  { label: "Home", href: "/portfolio", icon: LayoutDashboard },
  { label: "Wallets", href: "/wallets", icon: Wallet },
  { label: "Exchange", href: "/exchange", icon: Repeat2 },
  { label: "Invest", href: "/invest", icon: TrendingUp },
  { label: "Profile", href: "/profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, session, pathname, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
          <p className="text-xs text-muted-foreground">Loading AtlasWallet…</p>
        </div>
      </div>
    );
  }

  const initials = session.user.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-background-elevated/60"
        aria-label="Primary"
      >
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {DESKTOP_NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portfolio" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand-bright border-l-2 border-brand"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Tier / Identity panel */}
        <div className="m-3 rounded-xl border border-border bg-surface/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Plan
            </span>
            <Badge variant="outline" className="border-brand/40 bg-brand/5 text-brand-bright uppercase tracking-wider text-[10px]">
              BLACK 30
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Identity
            </span>
            <span className="text-[10px] text-muted-foreground">
              {demoMe.account.identityLevel.replace("_", " ")}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              KYC
            </span>
            <span className="text-[10px] text-muted-foreground">
              {demoMe.account.kycStatus.replace("_", " ")}
            </span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Logo size="sm" href={null} className="lg:hidden" />
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {currentSectionLabel(pathname)}
              </p>
              <p className="text-sm font-medium -mt-0.5">{currentSectionTitle(pathname)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className="hidden md:inline-flex border-brand/40 bg-brand/5 text-brand-bright uppercase tracking-wider text-[10px]"
            >
              BLACK 30
            </Badge>
            <LanguageSelector compact />
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center gap-2 rounded-full hover:bg-surface-hover p-0.5 pr-2 transition-colors">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-brand/15 text-brand-bright text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/support">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-danger focus:text-danger"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-h-0 overflow-y-auto pb-24 lg:pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav
          aria-label="Mobile primary"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background-elevated/95 backdrop-blur-xl safe-bottom"
        >
          <div className="grid grid-cols-5 h-16">
            {MOBILE_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/portfolio" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                    active
                      ? "text-brand-bright"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_rgba(22,135,255,0.4)]")} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function currentSectionLabel(pathname: string): string {
  if (pathname.startsWith("/portfolio")) return "Portfolio";
  if (pathname.startsWith("/wallets")) return "Wallets";
  if (pathname.startsWith("/exchange")) return "Exchange";
  if (pathname.startsWith("/invest")) return "Invest";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/support")) return "Support";
  return "AtlasWallet";
}

function currentSectionTitle(pathname: string): string {
  if (pathname.startsWith("/portfolio")) return "Overview";
  if (pathname.startsWith("/wallets")) return "All assets";
  if (pathname.startsWith("/exchange")) return "Convert";
  if (pathname.startsWith("/invest")) return "Opportunities";
  if (pathname.startsWith("/activity")) return "Recent activity";
  if (pathname.startsWith("/profile")) return "Self-declared";
  if (pathname.startsWith("/settings")) return "Preferences";
  if (pathname.startsWith("/support")) return "How can we help?";
  return "Dashboard";
}
