"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizeMap = {
  sm: { mark: "h-6 w-6", text: "text-sm" },
  md: { mark: "h-8 w-8", text: "text-base" },
  lg: { mark: "h-10 w-10", text: "text-lg" },
};

/**
 * AtlasWallet logo mark — stylized "A" forming a mountain/apex (Atlas symbol).
 * Drawn as SVG so it scales crisply and stays on-brand.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="AtlasWallet logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="atlas-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3EA0FF" />
          <stop offset="1" stopColor="#1687FF" />
        </linearGradient>
        <linearGradient id="atlas-grad-2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B68FF" />
          <stop offset="1" stopColor="#1687FF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="#0A1424" />
      <rect width="40" height="40" rx="10" stroke="url(#atlas-grad)" strokeOpacity="0.4" strokeWidth="1" />
      {/* Apex / mountain shape */}
      <path d="M20 8 L32 30 L25 30 L20 21 L15 30 L8 30 Z" fill="url(#atlas-grad)" />
      <path d="M20 8 L20 21 L15 30 L8 30 Z" fill="url(#atlas-grad-2)" opacity="0.6" />
      {/* Inner highlight */}
      <path d="M20 8 L23 14 L20 21 Z" fill="#FFFFFF" fillOpacity="0.18" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true, size = "md", href = "/" }: LogoProps) {
  const sz = sizeMap[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn(sz.mark, "shrink-0")} />
      {showWordmark && (
        <span className={cn("font-semibold tracking-[0.16em] uppercase", sz.text)}>
          Atlas<span className="text-brand">Wallet</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
