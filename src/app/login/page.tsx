"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { Logo } from "@/components/shared/logo";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
          <div className="absolute inset-0 radial-glow opacity-70" aria-hidden />
          <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
            <LanguageSelector />
          </header>
          <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md premium-card rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-40 bg-surface rounded mb-3" />
              <div className="h-4 w-64 bg-surface rounded mb-6" />
              <div className="space-y-4">
                <div className="h-10 bg-surface rounded" />
                <div className="h-10 bg-surface rounded" />
                <div className="h-10 bg-brand/30 rounded" />
              </div>
            </div>
          </main>
          <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Atlas Wallet Ltd · England and Wales
          </footer>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = search.get("next") || "/portfolio";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back to AtlasWallet");
      router.push(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <Card className="premium-card rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to your AtlasWallet portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Alert className="mb-4 border-brand/30 bg-brand/5">
            <Info className="h-4 w-4 text-brand" />
            <AlertDescription className="text-muted-foreground">
              Sandbox mode: Supabase is not configured. Use any email/password to explore the app.
            </AlertDescription>
          </Alert>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="pl-9"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-danger">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-danger">{form.formState.errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Controller
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    ref={field.ref}
                  />
                )}
              />
              Remember this device
            </label>

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-bright text-white glow-brand"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Log in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand hover:underline font-medium">
              Open account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
      <div className="absolute inset-0 radial-glow opacity-70" aria-hidden />
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
        <LanguageSelector />
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Atlas Wallet Ltd · England and Wales
      </footer>
    </div>
  );
}
