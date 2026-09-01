"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { institutionalConfig } from "@/config/institutional-config";

export function FinalCta() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-60" aria-hidden />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[680px] rounded-full bg-brand/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
            Your portfolio, your money, your crypto, your{" "}
            <span className="gradient-text">investments.</span>
            <br className="hidden sm:block" />
            One intelligent account.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Open an AtlasWallet account in minutes with a self-declared entry —
            email and password, then explore the portfolio. KYC is not a universal
            blocker; operations follow backend policy, provider and route eligibility.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand-bright text-white glow-brand">
              <Link href="/register">
                Create your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border bg-surface/40 hover:bg-surface-hover">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            {institutionalConfig.entity.legalName} · {institutionalConfig.entity.jurisdiction}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
