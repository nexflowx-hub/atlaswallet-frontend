"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Product Showcase — AtlasMobility + Atlas Real Estate.
 *
 * IMPORTANT — Investment claims are jurisdiction/eligibility/legal-review gated.
 * Never present 3.33% monthly as guaranteed. Rate shown only as internal config;
 * public wording shows only after legally approved product configuration.
 */
const PRODUCTS = [
  {
    code: "ATLAS_MOBILITY",
    name: "AtlasMobility",
    category: "Mobility · Private opportunity",
    headline: "A private mobility opportunity, eligibility gated.",
    description:
      "AtlasMobility is structured as a private opportunity with a minimum ticket of R$ 25.000 and a 30-day redemption notice. Yield instructions, distributions and rate wording are only shown once legally approved product configuration is in place.",
    accent: "from-brand/30 via-brand/10 to-transparent",
    badge: "REVIEW_REQUIRED",
    minLabel: "From R$ 25.000",
    redemptionLabel: "30-day notice",
  },
  {
    code: "ATLAS_REAL_ESTATE",
    name: "Atlas Real Estate",
    category: "Real Assets · Private opportunities",
    headline: "Diversify into Brazilian private real estate opportunities.",
    description:
      "Atlas Real Estate surfaces eligible opportunities such as Praia do Lago and Encanto das Águas, subject to product terms, jurisdiction and account eligibility. Each opportunity is presented with its own key terms, risk acknowledgement and documents.",
    accent: "from-investment-gold/30 via-investment-gold/10 to-transparent",
    badge: "REVIEW_REQUIRED",
    minLabel: "Eligibility gated",
    redemptionLabel: "Per opportunity",
  },
];

export function ProductShowcase() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 radial-glow-gold opacity-40" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-4 border-investment-gold/30 text-investment-gold uppercase tracking-[0.16em] text-[10px]">
            Invest · Eligibility gated
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
            Eligible private opportunities, on one portfolio.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            AtlasWallet surfaces private opportunities in mobility and real estate — each
            with explicit eligibility, key terms, risk acknowledgement and document review
            before any subscription. Capital is at risk. Returns are not assured.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.code}
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="premium-card premium-card-hover rounded-2xl overflow-hidden group"
            >
              {/* Image / gradient header */}
              <div className={`relative h-44 bg-gradient-to-br ${p.accent}`}>
                <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning/10 text-warning uppercase tracking-wider text-[10px]"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {p.badge.replace("_", " ")}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {p.category}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">{p.name}</h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm text-foreground font-medium">{p.headline}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Minimum</p>
                    <p className="mt-0.5 text-foreground font-medium">{p.minLabel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Redemption</p>
                    <p className="mt-0.5 text-foreground font-medium">{p.redemptionLabel}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Link href={`/invest/${p.code}`}>
                      Learn more
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <p className="text-[10px] text-muted-foreground">
                    Capital at risk · Returns not assured
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
