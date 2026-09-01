"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  function onSubmit(_values: FormValues) {
    // Real impl: supabase.auth.updateUser({ password })
    setDone(true);
    toast.success("Password updated — please log in");
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
              <CardTitle className="text-2xl">Set a new password</CardTitle>
              <CardDescription>
                Choose a strong password you don&apos;t use elsewhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {done ? (
                <div className="text-center py-6">
                  <div className="mx-auto rounded-full bg-success/10 p-3 w-fit">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <p className="mt-4 text-sm font-medium">Password updated</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    You can now log in with your new password.
                  </p>
                  <Button asChild className="mt-6 bg-brand hover:bg-brand-bright text-white">
                    <Link href="/login">Continue to login</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
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
                    <Label htmlFor="confirm">Confirm new password</Label>
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
                  <Button type="submit" className="w-full bg-brand hover:bg-brand-bright text-white">
                    Update password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
              {!done && (
                <Button asChild variant="ghost" size="sm" className="mt-4 text-muted-foreground">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
