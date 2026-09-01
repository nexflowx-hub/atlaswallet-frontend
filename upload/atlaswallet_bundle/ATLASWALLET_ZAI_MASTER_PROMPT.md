# ATLASWALLET — Z.AI MASTER FRONTEND PROMPT

Build the complete AtlasWallet V1 frontend from the attached `atlaswallet_frontend_v1_spec.json`.

The JSON is the functional source of truth. If the current AtlasWallet visual mockup is also attached, use that mockup as the visual source of truth.

## Required result
Create a production-grade Next.js App Router + TypeScript project containing the public AtlasWallet website, authentication, the authenticated operational dashboard/app, responsive mobile experience, UK/EU/Brazil-ready institutional/legal structure, and real integration with the existing AtlasWallet backend.

## Critical implementation rules
- Do not build a fake dashboard. Existing API routes must be called for real.
- Supabase is for auth/session only. Never write financial state directly to Supabase/PostgreSQL.
- All financial state comes from `https://api.atlaswallet.org`.
- Registration must be frictionless: email + password -> session -> GET /me -> bootstrap when required -> Portfolio.
- Never force self-declared profile completion before Portfolio.
- BLACK_30, SELF_DECLARED, KYC status and capability state come from backend data.
- Never treat KYC NOT_STARTED as a universal frontend blocker.
- Respect requestedCapabilities vs effectiveCapabilities.
- Never fabricate balances, successful payments, transactions, investment positions, user counts, testimonials, provider availability, licenses or guarantees.
- Planned payment/exchange/investment APIs may have polished UI, but execution must stay disabled/feature-gated until backend endpoints exist.
- Never expose provider credentials, database credentials, service-role keys or private keys.
- Never invent the Companies House number; it is pending confirmation.
- Never claim FCA, MiCA/CASP, BCB, CVM or other authorization unless verified configuration is added.
- Do not publicly present AtlasMobility 3.33% monthly as guaranteed unless legally approved product content explicitly enables that claim.

## Institutional data
- Atlas Wallet Ltd
- England and Wales
- Registered office: 71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ
- Company number: pending confirmation, never invent
- support@atlaswallet.org
- WhatsApp: +351 925 386 409
- Telegram Manager: @AtlasWallet_Manager
- News: @atlaswallet_news
- Telegram Bot: @AtlasWallet_TGbot — Coming soon

Centralize all of the above in `src/config/institutional-config.ts`.

## Current real API
Implement exactly:
- GET /api/v1/me
- POST /api/v1/account/bootstrap
- GET /api/v1/account/access
- GET /api/v1/wallets
- GET /api/v1/wallets/:walletId
- GET /api/v1/profile
- PATCH /api/v1/profile
- health/readiness endpoints

## Visual style
Premium private banking + modern wallet + crypto + private assets: deep navy/black, titanium/silver surfaces, electric blue accent, restrained green success, restrained gold investments, generous spacing, premium rounded cards, subtle motion. No casino feel and no trading-terminal complexity in V1.

Desktop main navigation: Portfolio / Wallets / Exchange / Invest / Activity / Profile / Settings / Support.
Mobile bottom navigation: Home / Wallets / Exchange / Invest / Profile.

## Output
Generate the full repository including package.json, config, route groups, components, typed API client, Supabase auth/session helpers, TanStack Query, Zod forms, i18n en-GB/pt-BR/pt-PT, cookie consent, legal pages, `.env.example`, README, unit tests, Playwright smoke tests and Vercel-ready deployment.

Do not leave TODO placeholders for landing/auth/portfolio/wallet/profile core. Planned financial execution may be visibly complete but must be safely capability-gated.
