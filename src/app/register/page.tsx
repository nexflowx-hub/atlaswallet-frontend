"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight, AlertCircle, Info, ShieldCheck } from "lucide-react";
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
import { institutionalConfig } from "@/config/institutional-config";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8, "Confirm your password"),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms and Privacy Notice",
    }),
    acceptMarketing: z.boolean().optional(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirm: "", acceptMarketing: false },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      // Production flow:
      //   Supabase signUp → session → GET /api/v1/me → if !provisioned POST /bootstrap → /portfolio
      await register(values.email, values.password);
      toast.success("Account created — welcome to AtlasWallet");
      // Profile is progressive — never force completion before portfolio.
      router.push("/portfolio");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
      <div className="absolute inset-0 radial-glow opacity-70" aria-hidden />
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
        <LanguageSelector />
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="premium-card rounded-2xl border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Open your account</CardTitle>
              <CardDescription>
                Frictionless entry — email and password. Self-declared profile is progressive and skippable.
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
                  Sandbox mode: Supabase is not configured. Demo session is local-only.
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="pl-9"
                      {...form.register("password")}
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-danger">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      className="pl-9"
                      {...form.register("confirm")}
                    />
                  </div>
                  {form.formState.errors.confirm && (
                    <p className="text-xs text-danger">{form.formState.errors.confirm.message}</p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Controller
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          ref={field.ref}
                        />
                      )}
                    />
                    <span className="leading-relaxed">
                      I have read and agree to the{" "}
                      <Link href="/legal/terms" className="text-brand hover:underline">Terms of Use</Link>{" "}
                      and{" "}
                      <Link href="/legal/privacy" className="text-brand hover:underline">Privacy Notice</Link>.
                    </span>
                  </label>
                  {form.formState.errors.acceptTerms && (
                    <p className="text-xs text-danger">
                      {form.formState.errors.acceptTerms.message as string}
                    </p>
                  )}

                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Controller
                      control={form.control}
                      name="acceptMarketing"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          ref={field.ref}
                        />
                      )}
                    />
                    <span className="leading-relaxed">
                      I want to receive marketing communications (optional, can be revoked at any time).
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-bright text-white glow-brand"
                  disabled={submitting}
                >
                  {submitting ? "Creating account…" : "Create account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-[10px] text-muted-foreground text-center pt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3 w-3" />
                  We never request passwords, seed phrases or private keys.
                </p>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-brand hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {institutionalConfig.entity.legalName} · Registered office: {institutionalConfig.entity.registeredOffice}
          </p>
        </div>
      </main>
    </div>
  );
}
