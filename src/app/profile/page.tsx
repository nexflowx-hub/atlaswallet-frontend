"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info, User, AlertCircle, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { demoProfile } from "@/lib/mock-data";
import { demoMe } from "@/lib/auth/auth-context";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationalityCountryCode: z.string().min(2, "Required"),
  residenceCountryCode: z.string().min(2, "Required"),
  phoneE164: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const COUNTRIES = [
  { code: "BR", name: "Brazil" },
  { code: "PT", name: "Portugal" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "IE", name: "Ireland" },
  { code: "US", name: "United States" },
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: demoProfile.profile?.firstName || "",
      lastName: demoProfile.profile?.lastName || "",
      dateOfBirth: "",
      nationalityCountryCode: "",
      residenceCountryCode: "",
      phoneE164: "",
    },
  });

  function onSubmit(_values: FormValues) {
    // Real impl: PATCH /api/v1/profile
    setSaved(true);
    toast.success("Profile saved");
    setTimeout(() => setSaved(false), 2000);
  }

  function skip() {
    toast.info("Profile skipped — you can complete it later");
  }

  const completion = demoProfile.completion;

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Profile · Self-declared
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            Your profile
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-brand/40 bg-brand/5 text-brand-bright text-[10px] uppercase tracking-wider">
            {demoMe.account.identityLevel.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground text-[10px] uppercase tracking-wider">
            KYC: {demoMe.account.kycStatus.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <Alert className="mt-5 border-brand/30 bg-brand/5">
        <Info className="h-4 w-4 text-brand" />
        <AlertDescription className="text-muted-foreground">
          Your profile is self-declared and skippable. KYC is a separate state — NOT_STARTED is
          not a universal blocker. Operation eligibility comes from backend policy, provider and route rules.
        </AlertDescription>
      </Alert>

      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Completion</CardTitle>
            <span className="text-sm font-medium tnum">{completion.percent}%</span>
          </div>
          <Progress value={completion.percent} className="h-2 bg-surface" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Missing fields: {completion.missingFields.join(", ") || "none"}
          </p>
        </CardContent>
      </Card>

      <Card className="mt-5 premium-card rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <Field label="First name" error={form.formState.errors.firstName?.message as string | undefined}>
              <Input {...form.register("firstName")} className="bg-surface/60" />
            </Field>
            <Field label="Last name" error={form.formState.errors.lastName?.message as string | undefined}>
              <Input {...form.register("lastName")} className="bg-surface/60" />
            </Field>
            <Field label="Date of birth" error={form.formState.errors.dateOfBirth?.message as string | undefined}>
              <Input type="date" {...form.register("dateOfBirth")} className="bg-surface/60" />
            </Field>
            <Field label="Phone (E.164, optional)" error={form.formState.errors.phoneE164?.message as string | undefined}>
              <Input placeholder="+351 9XX XXX XXX" {...form.register("phoneE164")} className="bg-surface/60" />
            </Field>
            <Field label="Nationality" error={form.formState.errors.nationalityCountryCode?.message as string | undefined}>
              <select
                {...form.register("nationalityCountryCode")}
                className="w-full bg-surface/60 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-surface">
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Country of residence" error={form.formState.errors.residenceCountryCode?.message as string | undefined}>
              <select
                {...form.register("residenceCountryCode")}
                className="w-full bg-surface/60 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-surface">
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={skip} className="text-muted-foreground">
                <SkipForward className="mr-2 h-4 w-4" />
                Skip for now
              </Button>
              <Button type="submit" className="bg-brand hover:bg-brand-bright text-white">
                {saved ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                    Saved
                  </>
                ) : (
                  "Save profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert className="mt-5 border-border bg-surface/40">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
        <AlertDescription className="text-xs text-muted-foreground">
          Self-declared data is not verified. Source of funds/wealth may be requested later, and
          restrictions apply to suspicious or prohibited activity per our AML/KYC controls.
        </AlertDescription>
      </Alert>
    </AppShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
