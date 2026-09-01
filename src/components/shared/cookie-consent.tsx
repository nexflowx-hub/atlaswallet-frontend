"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Consent = {
  necessary: true; // always
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  ts: number;
  version: number;
};

const STORAGE_KEY = "atlaswallet.cookieConsent";
const CURRENT_VERSION = 1;

const DEFAULT_CONSENT: Consent = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  ts: 0,
  version: CURRENT_VERSION,
};

function loadConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(c: Consent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  // Real impl would also set document.cookie = "atlaswallet_consent=...; SameSite=Lax; ..."
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<Consent>(DEFAULT_CONSENT);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      // small delay so it doesn't fight with hero
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  function acceptAll() {
    const c: Consent = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      ts: Date.now(),
      version: CURRENT_VERSION,
    };
    saveConsent(c);
    setVisible(false);
  }

  function rejectNonEssential() {
    const c: Consent = { ...DEFAULT_CONSENT, ts: Date.now(), version: CURRENT_VERSION };
    saveConsent(c);
    setVisible(false);
  }

  function savePreferences() {
    const c: Consent = { ...draft, necessary: true, ts: Date.now(), version: CURRENT_VERSION };
    saveConsent(c);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[440px] z-[60] premium-card rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-brand/10 p-2 text-brand shrink-0">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="cookie-consent-title" className="text-sm font-semibold text-foreground">
            Cookies & privacy
          </h3>
          <p id="cookie-consent-desc" className="mt-1 text-xs text-muted-foreground leading-relaxed">
            We use necessary cookies for the service to function. Optional cookies help us improve.
            See our{" "}
            <Link href="/legal/cookies" className="text-brand hover:underline">
              Cookie Policy
            </Link>
            .
          </p>

          {expanded && (
            <div className="mt-3 space-y-2.5">
              {[
                { key: "preferences", label: "Preferences", desc: "Remember your settings" },
                { key: "analytics", label: "Analytics", desc: "Anonymous usage insights" },
                { key: "marketing", label: "Marketing", desc: "Relevant communications" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between gap-3 text-xs cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-foreground font-medium">{item.label}</span>
                    <span className="text-muted-foreground">— {item.desc}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={draft[item.key as keyof Consent] as boolean}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [item.key]: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#1687FF]"
                  />
                </label>
              ))}
              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                <span>Necessary cookies are always on (security, session).</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {!expanded ? (
              <>
                <Button size="sm" onClick={acceptAll} className="h-8">
                  Accept all
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={rejectNonEssential}
                  className="h-8 text-muted-foreground"
                >
                  Reject non-essential
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setExpanded(true)}
                  className="h-8 px-2 text-xs text-muted-foreground"
                >
                  Manage preferences
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={savePreferences} className="h-8">
                  Save my preferences
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(false)}
                  className="h-8 text-muted-foreground"
                >
                  Back
                </Button>
              </>
            )}
            <button
              aria-label="Dismiss"
              onClick={rejectNonEssential}
              className="ml-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
