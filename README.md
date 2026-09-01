# AtlasWallet Frontend V1

A unified digital portfolio for **money · crypto · investments** — built for the UK, EU and Brazil.

> Money · Crypto · Investments · One Portfolio.

Built per `atlaswallet_frontend_v1_spec.json`. The JSON is the functional source of truth; the attached AtlasWallet mockup is the visual source of truth.

---

## Stack

- **Framework**: Next.js 16 (App Router) · TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 · CSS variables · AtlasWallet dark-first palette
- **UI**: shadcn/ui (customized) · Lucide icons · Framer Motion (subtle)
- **Server state**: TanStack Query v5
- **Forms**: React Hook Form · Zod
- **Charts**: Recharts + lightweight inline SVG sparklines
- **Auth (session only)**: Supabase Auth — sandbox/demo uses a local fallback session when `NEXT_PUBLIC_SUPABASE_URL` is not set
- **i18n**: messages prepared for `en-GB` (default), `pt-BR`, `pt-PT`
- **Tests**: Vitest + React Testing Library + Playwright (smoke) — see `tests/`

---

## Architecture

Single Next.js repository with shared design system and hostname-aware marketing/app shells (production). In this single-host preview, marketing and app coexist:

```
src/
  app/
    (flat routes)         # /, /login, /register, /portfolio, /wallets, /invest, …
    legal/                # 9 legal pages
    [walletId]/, [productCode]/
  components/
    marketing/            # header, footer, hero, four-worlds, product-showcase, security, final-cta, sub-page
    app-shell/            # desktop sidebar + mobile bottom nav + topbar
    shared/               # logo, language-selector, cookie-consent, providers
    legal/                # legal-page scaffold
    ui/                   # shadcn/ui
  config/
    institutional-config.ts   # centralized entity/contacts/regions/footer
  lib/
    api/                  # client.ts (typed) + types.ts
    auth/                 # auth-context (Supabase session, demo fallback)
    i18n/                 # (locale helpers)
    feature-flags.ts      # NEXT_PUBLIC_FEATURE_* + planned-endpoints registry
    mock-data.ts          # clearly-labelled illustrative data
    portfolio-format.tsx  # shared formatters + AssetIcon
  messages/               # en-GB, pt-BR, pt-PT
```

### Security boundary (non-negotiable)

| Boundary | Rule |
| --- | --- |
| Supabase | auth/session **only** — never writes authoritative financial state |
| Backend | `https://api.atlaswallet.org` is the single source of truth for balances, fees, quotes, capabilities, settlement and investment state |
| Authorization | Bearer Supabase access token attached to every API call over HTTPS |
| Secrets | Only browser-safe `NEXT_PUBLIC_*` env values. No service-role keys, no DB credentials, no provider secrets, no crypto private keys |

### Existing backend endpoints (wired)

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

# production build
bun run build
bun run start
```

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

## Critical product rules (respected)

- ✅ No fabricated balances, transactions, user counts, testimonials, provider availability, licenses or guarantees
- ✅ No invented Companies House number
- ✅ No FCA / MiCA-CASP / BCB / CVM authorization claim unless verified and configured
- ✅ No public 3.33% monthly guarantee unless legally approved product configuration explicitly enables it
- ✅ BLACK_30 is a commercial tier; SELF_DECLARED is an identity level; KYC is a separate state — `NOT_STARTED` is **not** a universal frontend blocker
- ✅ Requested capabilities ≠ effective capabilities — soft-gate, never fabricate success
- ✅ All fees from backend quote/transaction snapshot — never computed solely in the browser
- ✅ Cookie consent gates non-essential tracking
- ✅ Investment claims are jurisdiction / eligibility / legal-review gated

---

## Deployment

Vercel-ready. Set the env vars from `.env.example` in the Vercel project settings, point `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` at your Supabase project, and deploy.

Before formal public production launch:
1. Populate the confirmed Companies House number in `src/config/institutional-config.ts` (`entity.companyNumber`).
2. Verify and configure any regulatory authorization claims in `src/config/institutional-config.ts`.
3. Confirm legal review of investment product rate/return wording.

---

© Atlas Wallet Ltd. All rights reserved.
