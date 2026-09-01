/**
 * AtlasWallet — Smoke tests (Node-based).
 *
 * Run with: node tests/smoke.mjs
 *
 * Validates:
 *   - All public routes return 200
 *   - 404 returns 404 (not 500)
 *   - manifest.webmanifest is valid JSON
 *   - sitemap.xml is valid XML
 *   - robots.txt blocks private routes
 *   - /api/ai/chat accepts POST and returns SSE stream
 *   - Public pages contain expected HTML (h1, title)
 */

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const PUBLIC_ROUTES = [
  "/",
  "/money",
  "/crypto",
  "/exchange",
  "/invest",
  "/about",
  "/support",
  "/security",
  "/status",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/regulatory-status",
  "/legal/risk-disclosure",
  "/legal/investment-risk",
  "/legal/aml-kyc",
  "/legal/complaints",
  "/legal/acceptable-use",
  "/manifest.webmanifest",
  "/sitemap.xml",
  "/robots.txt",
  "/sw.js",
  "/offline",
];

const PRIVATE_ROUTES = [
  "/portfolio",
  "/wallets",
  "/activity",
  "/profile",
  "/settings",
  "/invest/positions",
  "/add-money",
];

let pass = 0;
let fail = 0;

function ok(label) {
  pass++;
  console.log("  ✓ " + label);
}
function err(label, msg) {
  fail++;
  console.error("  ✗ " + label + (msg ? " — " + msg : ""));
}

async function get(path, expectStatus = 200) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    if (res.status === expectStatus) {
      ok(`GET ${path} → ${res.status}`);
      return res;
    } else {
      err(`GET ${path}`, `expected ${expectStatus}, got ${res.status}`);
      return res;
    }
  } catch (e) {
    err(`GET ${path}`, e.message);
    return null;
  }
}

async function getBody(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) return null;
  return await res.text();
}

async function main() {
  console.log("\n=== AtlasWallet Smoke Tests ===\n");
  console.log("Target:", BASE, "\n");

  console.log("1. Public routes (200):");
  for (const r of PUBLIC_ROUTES) {
    await get(r, 200);
  }

  console.log("\n2. 404 route:");
  await get("/nonexistent", 404);

  console.log("\n3. Manifest is valid JSON:");
  const manifestBody = await getBody("/manifest.webmanifest");
  if (manifestBody) {
    try {
      const m = JSON.parse(manifestBody);
      if (m.name && m.short_name && m.icons && m.icons.length >= 4) {
        ok("manifest has name, short_name and ≥4 icons");
      } else {
        err("manifest fields", "missing required fields");
      }
    } catch (e) {
      err("manifest JSON", e.message);
    }
  }

  console.log("\n4. sitemap.xml:");
  const sitemap = await getBody("/sitemap.xml");
  if (sitemap && sitemap.includes("<urlset") && sitemap.includes("<loc>")) {
    ok("sitemap.xml contains urlset + loc");
  } else {
    err("sitemap.xml", "missing urlset or loc");
  }

  console.log("\n5. robots.txt blocks private routes:");
  const robots = await getBody("/robots.txt");
  if (robots && robots.includes("Disallow: /portfolio") && robots.includes("/wallets") && robots.includes("Sitemap:")) {
    ok("robots.txt blocks /portfolio, /wallets and references Sitemap");
  } else {
    err("robots.txt", "missing private route block or Sitemap reference");
  }

  console.log("\n6. Homepage has AtlasWallet branding:");
  const home = await getBody("/");
  if (home && home.includes("AtlasWallet") && home.includes("One Portfolio")) {
    ok("homepage contains AtlasWallet + tagline");
  } else {
    err("homepage content", "missing brand or tagline");
  }

  console.log("\n7. /api/ai/chat accepts POST and streams:");
  try {
    const res = await fetch(BASE + "/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });
    if (res.status === 200 && res.headers.get("content-type")?.includes("text/event-stream")) {
      ok("/api/ai/chat → 200 SSE stream");
      // Consume the stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (acc.length > 200) break;
      }
      if (acc.includes("data:")) {
        ok("SSE stream returned data chunks");
      } else {
        err("SSE stream", "no data chunks");
      }
    } else {
      err("/api/ai/chat", `expected 200 SSE, got ${res.status} ${res.headers.get("content-type")}`);
    }
  } catch (e) {
    err("/api/ai/chat", e.message);
  }

  console.log("\n8. Service worker exists:");
  await get("/sw.js", 200);

  console.log("\n=== Results ===");
  console.log(`Pass: ${pass}`);
  console.log(`Fail: ${fail}`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
