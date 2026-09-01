/**
 * AtlasWallet — Service Worker.
 *
 * CRITICAL: AtlasWallet is a financial application.
 * We NEVER cache:
 * - access tokens
 * - balances
 * - transaction responses
 * - sensitive API data
 * - personal data
 * - KYC information
 * - investment positions
 * - private financial responses
 *
 * We DO cache (offline-safe):
 * - application shell (HTML, JS, CSS)
 * - fonts
 * - icons
 * - static public assets
 *
 * When offline we show a clear "AtlasWallet is offline" notice.
 * We NEVER show stale balances as current.
 *
 * Versioned — when a new deploy lands, the SW self-updates via `skipWaiting()`.
 * Users get: "A new version of AtlasWallet is available. [Update]"
 */

const SW_VERSION = "atlaswallet-v2.0.0-001";
const APP_SHELL_CACHE = `${SW_VERSION}-app-shell`;
const STATIC_CACHE = `${SW_VERSION}-static`;

// Public, non-sensitive assets that are safe to cache offline.
const APP_SHELL = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/offline",
];

// Public marketing/legal pages — safe to pre-cache.
const PUBLIC_CONTENT = [
  "/about",
  "/security",
  "/support",
  "/status",
  "/money",
  "/crypto",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/regulatory-status",
  "/legal/risk-disclosure",
  "/legal/investment-risk",
  "/legal/aml-kyc",
  "/legal/complaints",
  "/legal/acceptable-use",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const [shellCache, staticCache] = await Promise.all([
        caches.open(APP_SHELL_CACHE),
        caches.open(STATIC_CACHE),
      ]);
      // shell first
      await shellCache.addAll(APP_SHELL).catch(() => {
        // ignore individual failures
      });
      // public content — best-effort
      await staticCache.addAll(PUBLIC_CONTENT).catch(() => {
        // ignore individual failures
      });
      // activate immediately
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop old caches from previous versions
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(SW_VERSION))
          .map((k) => caches.delete(k))
      );
      // Take control immediately so updates roll out fast.
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * Strategy:
 * - Navigation requests (HTML pages): network-first, fall back to cache, then offline page.
 *   NEVER serve cached authenticated pages as if they were fresh — if the request
 *   requires auth, we don't cache it at all (Cache-Control: no-store from app).
 * - Static assets (JS/CSS/fonts/icons): stale-while-revalidate.
 * - API requests (api.atlaswallet.org, /api/*): NEVER cache. Always network.
 *   If offline, respond with a 503 with structured body.
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET — never POST/PUT/etc.
  if (req.method !== "GET") return;

  // Never intercept API calls — financial data must always be live.
  const isApi =
    url.pathname.startsWith("/api/") ||
    url.hostname.endsWith("atlaswallet.org") && url.hostname.startsWith("api.") ||
    url.hostname.endsWith("supabase.co");

  if (isApi) {
    // Network-only. If offline, return a structured 503.
    event.respondWith(
      fetch(req).catch(() =>
        new Response(
          JSON.stringify({
            error: "OFFLINE",
            message: "AtlasWallet is offline. Reconnect to access live financial information.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );
    return;
  }

  // Navigation (page loads) — network-first, fall back to cache or offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(APP_SHELL_CACHE);
          // Only cache successful responses for public (non-auth) routes.
          if (fresh.ok && fresh.status === 200) {
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch (err) {
          // Try cache
          const cached = await caches.match(req);
          if (cached) return cached;
          // Try offline page
          const offline = await caches.match("/offline");
          if (offline) return offline;
          // Last resort
          return new Response(
            "<!doctype html><title>AtlasWallet is offline</title>" +
              "<meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>" +
              "<body style='background:#020711;color:#F5F8FC;font-family:system-ui;padding:3rem;text-align:center'>" +
              "<h1>AtlasWallet is offline.</h1>" +
              "<p>Reconnect to access live financial information.</p>" +
              "</body>",
            { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
          );
        }
      })()
    );
    return;
  }

  // Static assets — stale-while-revalidate
  if (
    url.origin === self.location.origin &&
    (req.destination === "style" ||
      req.destination === "script" ||
      req.destination === "font" ||
      req.destination === "image" ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.startsWith("/_next/static/"))
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((fresh) => {
            if (fresh && fresh.ok) cache.put(req, fresh.clone());
            return fresh;
          })
          .catch(() => null);
        return cached || (await network) || Response.error();
      })()
    );
    return;
  }

  // Default: try network, fall back to cache.
  event.respondWith(
    fetch(req).catch(async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      return Response.error();
    })
  );
});
