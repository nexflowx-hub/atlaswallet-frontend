# AtlasWallet Frontend V2

> Money · Crypto · Investments · One Portfolio.

Production-grade Next.js App Router frontend for AtlasWallet — built for the UK, EU and Brazil. V2 adds: animated premium background, PWA (installable + offline-safe), complete SEO (sitemap, robots, hreflang, JSON-LD, noindex for private routes), Atlas AI assistant, Add Money flow, Smart Allocation, skeletons/empty states, security headers, and global error boundary.

---

## Stack

- **Framework**: Next.js 16 (App Router) · TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 · CSS variables · AtlasWallet dark-first palette
- **UI**: shadcn/ui (customized) · Lucide icons · Framer Motion (subtle)
- **Server state**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts + lightweight inline SVG sparklines
- **Auth (session only)**: Supabase Auth — sandbox/demo uses a local fallback session when `NEXT_PUBLIC_SUPABASE_URL` is not set
- **PWA**: manifest.webmanifest, service worker, installable, offline page
- **AI**: Atlas AI assistant (SSE streaming, sanitized markdown, rate-limited, provider-abstract)
- **i18n**: messages prepared for `en-GB` (default), `pt-BR`, `pt-PT`

---

## Phase 2 Highlights

### Animated background (`src/components/shared/animated-background.tsx`)
- Canvas-based, single rAF loop, ~45fps throttled to save battery
- Respects `prefers-reduced-motion` (renders static gradient only)
- Auto-pauses when tab hidden
- DPR-aware (capped at 1.5)
- Network nodes (BRL · EUR · USD · GBP · USDT · USDC · BTC · ETH · SOL · PIX) with arcs between them
- 38 particles on desktop, 18 on mobile
- Subtle noise overlay via inline SVG

### PWA (`public/sw.js`, `src/app/manifest.ts`, `src/hooks/use-pwa.ts`, `src/components/shared/pwa-update-banner.tsx`)
- Manifest with `display: standalone`, `orientation: portrait-primary`, maskable icons (192/512), apple-touch-icon
- Service worker carefully scoped: NEVER caches API calls, balances, transactions, KYC, investment positions — only app shell, fonts, icons, public content
- Offline page at `/offline` shows "AtlasWallet is offline. Reconnect to access live financial information." — never shows stale balances
- Update banner: "A new version of AtlasWallet is available. [Update]"
- Install banner: "Install AtlasWallet" (Android/Chrome), iOS instructions tooltip

### SEO (`src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`)
- Dynamic sitemap with only public routes (private routes excluded)
- robots.txt blocks `/portfolio`, `/wallets`, `/activity`, `/profile`, `/settings`, `/invest/positions`, `/api/`, `/_next/`, `/offline`
- Each private route folder has `layout.tsx` exporting `metadata.robots = { index: false, follow: false, nocache: true }`
- JSON-LD: Organization, WebSite with SearchAction
- OpenGraph + Twitter cards
- hreflang: en-GB, pt-BR, pt-PT, x-default
- Per-page metadata (title, description, canonical, OG, Twitter, robots)

### Atlas AI Assistant (`src/components/atlas-ai/atlas-ai-widget.tsx`, `src/app/api/ai/chat/route.ts`, `src/config/atlas-ai-config.ts`)
- Floating button bottom-right (desktop) / bottom-right above mobile nav (mobile)
- Chat dialog with quick prompts (Add money, PIX, Buy USDT, Black tier, Profile, Investments, Talk to a human)
- SSE streaming via `/api/ai/chat`
- Sanitized markdown (escape HTML, allow-list: bold, italic, code, lists, line breaks; NO raw HTML, NO images, NO links)
- Stop generation, retry, copy, thumbs up/down feedback
- Rate-limited (20 req/min per IP)
- Clear conversation, conversation history (localStorage)
- NEVER executes financial operations — only prepares actions requiring explicit UI confirmation
- Default personality: professional, calm, precise, premium, international, concise, helpful
- Preview responses clearly labelled "_Preview response — when the live assistant is connected, responses will be authoritative and personalized to your account._"

### Add Money flow (`src/app/add-money/page.tsx`)
- 5 methods: PIX, Bank Transfer, Crypto, Buy Crypto, Other
- Provider-neutral UI (user sees "PIX", not internal provider code)
- Each method clearly shows when disabled (with capability explanation)
- Confirmation disabled until backend `/api/v1/deposit-intents` is live
- Crypto deposit: asset/network-specific address, warning about wrong-network sends

### Smart Allocation (`src/app/invest/page.tsx`)
- Visual diagram showing AtlasMobility → Atlas Real Estate cross-allocation concept
- Position A (AtlasMobility, R$ 50.000) → yield → Position B (Atlas Real Estate, R$ 25.000, Praia do Lago)
- Clear note: each subscription is a separate position with explicit allocation instructions, never automatic

### Skeletons (`src/components/shared/skeletons.tsx`)
- Skeleton, PortfolioSkeleton, WalletsSkeleton, ActivitySkeleton, ProfileSkeleton
- Subtle shimmer animation (1.6s, CSS-only)

### Premium 404 / error pages (`src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`)
- 404 with branded "404" gradient text + navigation shortcuts
- Error boundary with reference ID (AW-XXXX), no stack traces exposed
- Global error boundary catches any uncaught exception

### Security headers (`next.config.ts`)
- Content-Security-Policy (restrictive, app-friendly)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera/microphone/geolocation/interest-cohort/browsing-topics all disabled
- Strict-Transport-Security with preload
- Service-Worker-Allowed: /

### Support Center (`src/app/support/page.tsx`)
- FAQ knowledge base (`src/lib/support/faq.ts`) with 19 items across 7 categories
- Search interface with category filter
- Accordion expansion
- Atlas AI integration banner
- Human channels: Email, WhatsApp, Telegram Manager, News Channel

---

## Architecture

```
src/
  app/
    (flat routes)         # /, /login, /register, /portfolio, /wallets, /add-money, /invest, …
    legal/                # 9 legal pages
    [walletId]/, [productCode]/
    api/ai/chat/route.ts  # Atlas AI streaming endpoint (preview responses)
    sitemap.ts            # dynamic sitemap
    robots.ts             # robots.txt
    manifest.ts           # PWA manifest
    not-found.tsx         # premium 404
    error.tsx             # app error boundary
    global-error.tsx      # global error boundary
    offline/page.tsx      # offline fallback page
  components/
    atlas-ai/             # Atlas AI floating widget + chat
    marketing/            # header, footer, hero, four-worlds, product-showcase, security, final-cta, sub-page
    app-shell/            # desktop sidebar + mobile bottom nav + topbar
    shared/               # logo, language-selector, cookie-consent, providers, animated-background, pwa-update-banner, skeletons
    legal/                # legal-page scaffold
    ui/                   # shadcn/ui
  config/
    institutional-config.ts   # centralized entity/contacts/regions/footer
    atlas-ai-config.ts        # AI assistant name, prompts, disclaimers, limits
  hooks/
    use-pwa.ts            # PWA install/update detection
  lib/
    api/                  # client.ts (typed) + types.ts
    auth/                 # auth-context (Supabase session, demo fallback)
    feature-flags.ts      # NEXT_PUBLIC_FEATURE_* + planned-endpoints registry
    mock-data.ts          # clearly-labelled illustrative data
    portfolio-format.tsx  # shared formatters + AssetIcon
    seo/private-metadata.ts  # noindex helper for private routes
    support/faq.ts        # FAQ knowledge base
  messages/               # en-GB, pt-BR, pt-PT
  public/
    icons/                # PWA icons (192/512/maskable/apple-touch)
    sw.js                 # service worker
    favicon.svg
```

### Security boundary (non-negotiable)

| Boundary | Rule |
| --- | --- |
| Supabase | auth/session **only** — never writes authoritative financial state |
| Backend | `https://api.atlaswallet.org` is the single source of truth |
| Authorization | Bearer Supabase access token over HTTPS |
| Secrets | Only browser-safe `NEXT_PUBLIC_*` env values |
| PWA cache | NEVER caches API responses, balances, transactions, KYC, investment positions |
| AI | NEVER executes financial operations directly; never logs tokens/PII; rate-limited |

### Existing backend endpoints (wired in `src/lib/api/client.ts`)

- `GET  /api/health` (public)
- `GET  /api/health/ready` (public)
- `GET  /api/v1/me` (auth)
- `POST /api/v1/account/bootstrap` (auth, idempotent)
- `GET  /api/v1/account/access` (auth)
- `GET  /api/v1/wallets` (auth)
- `GET  /api/v1/wallets/:walletId` (auth)
- `GET  /api/v1/profile` (auth)
- `PATCH /api/v1/profile` (auth)

### Planned MVP endpoints (interfaces prepared, execution disabled)

- `GET  /api/v1/portfolio` → hide performance until backend exists
- `GET  /api/v1/activity` → empty state
- `POST /api/v1/quotes` → no fake quote generated
- `POST /api/v1/deposit-intents` → execution disabled
- `POST /api/v1/withdrawal-intents` → execution disabled
- `GET  /api/v1/investments/products` → legal/eligibility gated
- `GET  /api/v1/investments/positions` → empty state
- `POST /api/v1/investments/subscriptions` → disabled
- `POST /api/v1/investments/redemptions` → disabled
- `POST /api/v1/assistant/chat` → AI assistant preview mode active until backend live

---

## Local development

```bash
# install deps
bun install

# copy env
cp .env.example .env.local
# populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for real auth

# dev
bun run dev

# lint
bun run lint

# smoke tests (requires dev server running on :3000)
node tests/smoke.mjs

# production build
bun run build
bun run start
```

---

## Routes (34 total — all 200 OK)

**Public marketing (10):** `/`, `/money`, `/crypto`, `/about`, `/support`, `/security`, `/status`, `/invest` (marketing info)
**Auth (4):** `/login`, `/register`, `/forgot-password`, `/reset-password`
**App (private, noindex) (10):** `/portfolio`, `/wallets`, `/wallets/[walletId]`, `/add-money`, `/exchange`, `/invest`, `/invest/[productCode]`, `/invest/positions`, `/activity`, `/profile`, `/settings`
**Legal (9):** `/legal/terms`, `/legal/privacy`, `/legal/cookies`, `/legal/regulatory-status`, `/legal/risk-disclosure`, `/legal/investment-risk`, `/legal/aml-kyc`, `/legal/complaints`, `/legal/acceptable-use`
**PWA / SEO (5):** `/manifest.webmanifest`, `/sw.js`, `/sitemap.xml`, `/robots.txt`, `/offline`
**Error (1):** `/nonexistent` → 404 premium page

---

## Institutional

- **Entity**: Atlas Wallet Ltd
- **Jurisdiction**: England and Wales
- **Registered office**: 71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ
- **Company number**: PENDING_CONFIRMATION — never invented
- **Email**: support@atlaswallet.org
- **WhatsApp**: +351 925 386 409
- **Telegram**: @AtlasWallet_Manager · @atlaswallet_news · @AtlasWallet_TGbot (coming soon)

Centralized in `src/config/institutional-config.ts`.

---

## Critical product rules (respected in V2)

- ✅ No fabricated balances, transactions, user counts, testimonials, provider availability, licenses or guarantees
- ✅ No invented Companies House number
- ✅ No FCA / MiCA-CASP / BCB / CVM authorization claim unless verified and configured
- ✅ No public 3.33% monthly guarantee unless legally approved product configuration explicitly enables it
- ✅ BLACK_30 is a commercial tier; SELF_DECLARED is an identity level; KYC is a separate state — `NOT_STARTED` is **not** a universal frontend blocker
- ✅ Requested capabilities ≠ effective capabilities — soft-gate, never fabricate success
- ✅ All fees from backend quote/transaction snapshot — never computed solely in the browser
- ✅ Cookie consent gates non-essential tracking
- ✅ Investment claims are jurisdiction / eligibility / legal-review gated
- ✅ Private routes are `noindex, nofollow` — never indexed
- ✅ PWA never caches financial data
- ✅ Atlas AI never executes financial operations directly — only prepares actions requiring explicit UI confirmation
- ✅ Atlas AI never exposes raw LLM provider errors

---

## Deployment

Vercel-ready. Set the env vars from `.env.example` in the Vercel project settings, point `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` at your Supabase project, and deploy.

Before formal public production launch:
1. Populate the confirmed Companies House number in `src/config/institutional-config.ts` (`entity.companyNumber`).
2. Verify and configure any regulatory authorization claims in `src/config/institutional-config.ts`.
3. Confirm legal review of investment product rate/return wording.
4. Enable PWA via `NEXT_PUBLIC_FEATURE_PWA=true`.
5. Connect `/api/v1/assistant/chat` backend endpoint to replace Atlas AI preview responses.

---

© Atlas Wallet Ltd. All rights reserved.
