import { NextRequest } from "next/server";
import { z } from "zod";
import { atlasAiConfig } from "@/config/atlas-ai-config";

export const runtime = "edge";

/**
 * AtlasWallet — Atlas AI chat endpoint.
 *
 * Production target: POST /api/v1/assistant/chat on the AtlasWallet Backend.
 * Until that endpoint is live, this route returns clearly-labelled PREVIEW
 * responses (server-side, deterministic, no LLM call) so the frontend UX is
 * fully testable. Preview responses never fabricate financial data, never
 * claim to be authoritative, and never execute operations.
 *
 * SECURITY:
 * - Never logs bearer tokens or PII.
 * - Validates input length.
 * - Rate limited (best-effort, in-memory per IP).
 * - Streaming via SSE; client can stop generation.
 * - Sanitizes output before rendering (handled client-side with a strict
 *   markdown allow-list; this endpoint returns plain text only).
 */

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().max(atlasAiConfig.limits.maxPromptLength),
      })
    )
    .min(1)
    .max(atlasAiConfig.limits.messagesPerConversation + 2),
  language: z.string().optional(),
  conversationId: z.string().optional(),
});

interface RateBucket {
  count: number;
  resetAt: number;
}
const rateBuckets = new Map<string, RateBucket>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRate(ip: string): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const b = rateBuckets.get(ip);
  if (!b || b.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX - 1, retryAfterMs: 0 };
  }
  if (b.count >= RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0, retryAfterMs: b.resetAt - now };
  }
  b.count += 1;
  return { ok: true, remaining: RATE_LIMIT_MAX - b.count, retryAfterMs: 0 };
}

/**
 * Preview response generator — deterministic, knowledge-based, never financial advice.
 * This is a FALLBACK for when the backend /api/v1/assistant/chat is not yet live.
 */
function previewResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase().trim();

  if (p.includes("add money") || p.includes("deposit")) {
    return [
      "Adding money to AtlasWallet depends on your country and account eligibility:",
      "",
      "• **PIX** — BRL deposits, available for eligible Brazilian accounts.",
      "• **Bank Transfer (SEPA/SWIFT)** — EUR / USD / GBP deposits.",
      "• **Crypto** — receive supported digital assets (USDT, USDC, BTC, ETH, SOL) on supported networks.",
      "• **Buy Crypto** — available fiat-to-crypto routes for eligible accounts.",
      "",
      "Open the **Wallets** tab, pick the asset you want to fund, and choose **Receive** or **Add Money**.",
      "",
      "_Note: this is a preview response. Authoritative methods and fees come from the backend once the live assistant is connected._",
    ].join("\n");
  }
  if (p.includes("pix")) {
    return [
      "PIX is the Brazilian instant payment rail. In AtlasWallet, eligible BRL wallets can receive PIX deposits.",
      "",
      "To receive via PIX:",
      "1. Open your **BRL** wallet.",
      "2. Tap **Receive**.",
      "3. The displayed key (CPF, email, phone or random key) is your deposit destination.",
      "",
      "Eligibility is backend-controlled — your effective capability determines if PIX is enabled. Until then, the receive action is shown but confirmation is disabled.",
      "",
      "_Preview response — confirmed availability comes from the backend._",
    ].join("\n");
  }
  if (p.includes("usdt") || p.includes("buy crypto")) {
    return [
      "Buying crypto on AtlasWallet:",
      "",
      "• Eligible accounts can use **Buy Crypto** to convert fiat (BRL, EUR, USD, GBP) into supported digital assets (USDT, USDC, BTC, ETH, SOL).",
      "• Each conversion requires an authoritative backend **quote** before confirmation: gross amount, Atlas service fee, provider/network fee, FX rate, and net amount are all shown up-front.",
      "• Quotes expire — stale quotes are never executed.",
      "",
      "To start: open **Exchange**, choose what you pay (e.g. BRL) and what you want to receive (e.g. USDT), then **Get authoritative quote**.",
      "",
      "_Preview response — no fake quotes are generated. The backend /api/v1/quotes endpoint will be the source of truth._",
    ].join("\n");
  }
  if (p.includes("black") || p.includes("tier")) {
    return [
      "Your **Atlas Black 30** tier is a commercial pricing tier — it's not a verification status and not a fee.",
      "",
      "• BLACK_30 reflects the fee schedule applied to your operations (visible in the quote breakdown, never as a universal flat fee).",
      "• It's separate from **Identity Level** (currently: Self-declared) and **KYC status** (currently: Not started).",
      "• KYC NOT_STARTED is **not** a blocker — it simply means additional verification hasn't been requested yet for any operation.",
      "",
      "If you want to access additional services that require higher verification, you can start that from **Settings → Security**.",
      "",
      "_Preview response — current values come from /api/v1/me._",
    ].join("\n");
  }
  if (p.includes("profile")) {
    return [
      "Your profile is **progressive and skippable** — you don't need to complete it to use the portfolio.",
      "",
      "Missing fields are surfaced quietly on the Portfolio page. To complete it:",
      "1. Open **Profile** from the sidebar.",
      "2. Fill in the missing fields (First name, Last name, Date of birth, Nationality, Country of residence).",
      "3. Tap **Save profile**.",
      "",
      "Profile is self-declared (not verified). Source-of-funds/wealth may be requested later for certain operations.",
      "",
      "_Preview response._",
    ].join("\n");
  }
  if (p.includes("invest") || p.includes("mobility") || p.includes("real estate")) {
    return [
      "Investments on AtlasWallet:",
      "",
      "• **AtlasMobility** — a private mobility opportunity, minimum R$ 25.000, 30-day redemption notice.",
      "• **Atlas Real Estate** — Brazilian private real estate opportunities (e.g. Praia do Lago, Encanto das Águas).",
      "",
      "Both are subject to **eligibility, jurisdiction and legal review**. Public rate/return wording is shown only when supplied by legally approved product configuration.",
      "",
      "Capital is at risk. Returns are not assured. Past performance does not predict future results.",
      "",
      "Atlas AI can explain products and mechanics, but for personalized guidance please speak with an Atlas Advisor.",
      "",
      "_Preview response — investment eligibility comes from the backend._",
    ].join("\n");
  }
  if (p.includes("human") || p.includes("support") || p.includes("contact")) {
    return [
      "I can connect you with a human. AtlasWallet support channels:",
      "",
      "• **Email**: support@atlaswallet.org",
      "• **WhatsApp**: +351 925 386 409",
      "• **Telegram Manager**: @AtlasWallet_Manager",
      "• **Telegram Bot**: @AtlasWallet_TGbot (Coming soon)",
      "",
      "AtlasWallet support will never request passwords, seed phrases or private keys.",
      "",
      "_Preview response._",
    ].join("\n");
  }
  return [
    "I'm Atlas AI, your AtlasWallet assistant. I can help with:",
    "",
    "• Adding money (PIX, Bank Transfer, Crypto, Buy Crypto)",
    "• Wallets and balances",
    "• Exchange and quotes",
    "• Investments (AtlasMobility, Real Estate)",
    "• Your Atlas Black tier and profile",
    "• Connecting you with human support",
    "",
    "What would you like to know more about?",
    "",
    "_Preview response — when the live assistant is connected, responses will be authoritative and personalized to your account._",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRate(ip);
  if (!rate.ok) {
    return new Response(
      JSON.stringify({
        error: "RATE_LIMITED",
        message: atlasAiConfig.errorMessages.RATE_LIMITED,
        retryAfterMs: rate.retryAfterMs,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "BAD_REQUEST", message: "Invalid JSON body." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "BAD_REQUEST",
        message: "Invalid request.",
        details: parsed.error.issues.map((i) => i.message).join("; "),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const lastUser = [...parsed.data.messages].reverse().find((m) => m.role === "user");
  const userPrompt = lastUser?.content || "";

  // Production target: forward to /api/v1/assistant/chat on the backend.
  // For now (Phase 2 preview), generate a deterministic preview response.

  const responseText = previewResponse(userPrompt);
  const requestId = `AW-AI-${Date.now().toString(36).toUpperCase()}`;

  // SSE streaming — token-like chunks.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = responseText.match(/.{1,8}/gs) || [responseText];
      for (const chunk of chunks) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "token", content: chunk })}\n\n`
          )
        );
        // small delay for visible streaming
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "done", requestId, preview: true })}\n\n`
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Request-Id": requestId,
    },
  });
}
