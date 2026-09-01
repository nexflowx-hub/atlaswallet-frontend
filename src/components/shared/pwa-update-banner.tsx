"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Download, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwa } from "@/hooks/use-pwa";
import { toast } from "sonner";

/**
 * AtlasWallet — PWA Update & Install banner.
 *
 * Shows:
 *   - "A new version of AtlasWallet is available. [Update]" when SW detects an update.
 *   - "Install AtlasWallet" CTA (iOS shows instructions; Android/Chrome uses native prompt).
 *   - Respects user dismissal (per session, not persisted).
 *
 * NEVER shows stale balances or implies offline financial state.
 */
export function PwaUpdateBanner() {
  const { updateAvailable, applyUpdate, canInstall, promptInstall, isStandalone } = usePwa();
  const [dismissedUpdate, setDismissedUpdate] = useState(false);
  const [dismissedInstall, setDismissedInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    if (ios) {
      requestAnimationFrame(() => setIsIos(true));
    }
  }, []);

  // Show update banner
  if (updateAvailable && !dismissedUpdate) {
    return (
      <div
        role="alert"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-2rem)] max-w-md premium-card rounded-xl p-3 shadow-2xl animate-in slide-in-from-top-4 duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-success/10 p-2 text-success shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">A new version of AtlasWallet is available.</p>
          </div>
          <Button size="sm" onClick={applyUpdate} className="bg-success/15 hover:bg-success/25 text-success border border-success/30">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Update
          </Button>
          <button
            onClick={() => setDismissedUpdate(true)}
            aria-label="Dismiss"
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show install CTA — only on browsers that support it, only if not already standalone, only once per session
  if (canInstall && !isStandalone && !dismissedInstall) {
    return (
      <div
        role="dialog"
        aria-label="Install AtlasWallet"
        className="fixed bottom-4 left-4 z-[60] premium-card rounded-xl p-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-w-xs"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-brand/10 p-2 text-brand shrink-0">
            <Download className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Install AtlasWallet</p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Add to your home screen for a faster, app-like experience.
            </p>
            <div className="mt-2 flex gap-1.5">
              <Button
                size="sm"
                onClick={async () => {
                  const r = await promptInstall();
                  if (r === "accepted") toast.success("AtlasWallet installed");
                  if (r === "dismissed") setDismissedInstall(true);
                }}
                className="h-7 bg-brand hover:bg-brand-bright text-white"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissedInstall(true)}
                className="h-7 text-muted-foreground"
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // iOS — show a small tooltip pointing to Share → Add to Home Screen.
  // Not intrusive: only when feature flag enabled and once per session.
  if (
    isIos &&
    !isStandalone &&
    !dismissedInstall &&
    process.env.NEXT_PUBLIC_FEATURE_PWA === "true"
  ) {
    return (
      <div
        role="dialog"
        aria-label="Install AtlasWallet on iOS"
        className="fixed bottom-4 left-4 z-[60] premium-card rounded-xl p-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-w-xs"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-brand/10 p-2 text-brand shrink-0">
            <Download className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Install AtlasWallet</p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Tap <span className="font-medium text-foreground">Share</span> →{" "}
              <span className="font-medium text-foreground">Add to Home Screen</span>.
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissedInstall(true)}
              className="mt-2 h-7 text-muted-foreground p-0"
            >
              Got it
            </Button>
          </div>
          <button
            onClick={() => setDismissedInstall(true)}
            aria-label="Dismiss"
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
