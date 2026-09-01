"use client";

import { cn } from "@/lib/utils";

/**
 * AtlasWallet — Skeleton loaders.
 *
 * Subtle shimmer effect, never aggressive.
 * Used during async data loading (wallets, activity, portfolio).
 *
 * Performance: pure CSS animation, no JS, no heavy DOM.
 */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-surface/60 relative overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-5">
      {/* Hero skeleton */}
      <div className="premium-card rounded-2xl p-6 space-y-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-40 w-full mt-4" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>

      {/* Category cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>

      {/* Asset table */}
      <div className="premium-card rounded-2xl p-5">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WalletsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 rounded-2xl" />
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
