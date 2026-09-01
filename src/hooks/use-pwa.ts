"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaState {
  registered: boolean;
  updateAvailable: boolean;
  applyUpdate: () => void;
  canInstall: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  isStandalone: boolean;
}

export function usePwa(): PwaState {
  const [registered, setRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already installed (standalone mode)?
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      requestAnimationFrame(() => setIsStandalone(true));
    }

    // Register service worker — only when PWA flag is enabled OR in production.
    if (!("serviceWorker" in navigator)) return;
    const enableSw =
      process.env.NEXT_PUBLIC_FEATURE_PWA === "true" ||
      process.env.NODE_ENV === "production";
    if (!enableSw) return;

    let cancelled = false;
    const onLoad = () => {
      if (cancelled) return;
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          if (cancelled) return;
          requestAnimationFrame(() => setRegistered(true));
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                requestAnimationFrame(() => setUpdateAvailable(true));
              }
            });
          });
          // Periodic check every 60 min
          setInterval(() => {
            reg.update().catch(() => void 0);
          }, 60 * 60 * 1000);
        })
        .catch(() => {
          // SW registration failure is non-fatal — app still works.
        });
    };
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      requestAnimationFrame(() => {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setCanInstall(true);
      });
    };
    const onInstalled = () => {
      requestAnimationFrame(() => {
        setCanInstall(false);
        setDeferredPrompt(null);
      });
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const applyUpdate = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage("SKIP_WAITING");
    }
    setUpdateAvailable(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const promptInstall = async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferredPrompt) return "unavailable";
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    return choice.outcome;
  };

  return {
    registered,
    updateAvailable,
    applyUpdate,
    canInstall,
    promptInstall,
    isStandalone,
  };
}
