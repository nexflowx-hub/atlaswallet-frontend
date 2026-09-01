/**
 * Atlas AI — Configuration.
 *
 * The AtlasWallet AI assistant.
 *
 * CRITICAL BOUNDARIES:
 * - Frontend NEVER calls LLM providers directly with secret API keys.
 * - All requests go through POST /api/v1/assistant/chat (or /api/ai/chat fallback).
 * - Backend routes through AtlasWallet AI Gateway → LLM provider (OpenRouter/OpenAI/Anthropic).
 * - Provider/model/temperature are backend-configurable, never hardcoded in frontend.
 * - AI never executes financial operations directly (withdrawal/exchange/investment).
 *   It can only prepare actions that require explicit user confirmation.
 *
 * Default personality: professional, calm, precise, premium, international, concise, helpful.
 * Never: aggressive selling, investment pressure, false guarantee, fabricated financial data.
 */

export const atlasAiConfig = {
  name: "Atlas AI",
  tagline: "Your AtlasWallet assistant",
  greeting: "Hello. How can I help you with AtlasWallet?",
  placeholder: "Ask Atlas AI anything about AtlasWallet…",
  /**
   * Suggested quick prompts shown on the empty chat state.
   * These are user-facing labels and never include sensitive data.
   */
  quickPrompts: [
    "How do I add money?",
    "How does PIX work?",
    "How do I buy USDT?",
    "Explain my Atlas Black tier",
    "How can I complete my profile?",
    "How do investments work?",
    "Talk to a human",
  ],
  /**
   * Disclaimers displayed alongside AI responses.
   * Atlas AI may explain products/terms/mechanics, but is NOT personalized financial advice.
   */
  disclaimers: {
    general:
      "Atlas AI provides general information about AtlasWallet. It is not personalized financial advice.",
    investment:
      "Investment opportunities are subject to eligibility, jurisdiction and legal review. Capital is at risk and returns are not assured. Speak with an Atlas Advisor for personalized guidance.",
  },
  /**
   * Escalation channels — surfaced when user requests "Talk to a human".
   */
  escalation: {
    email: "support@atlaswallet.org",
    whatsapp: "+351 925 386 409",
    telegram: "@AtlasWallet_Manager",
    telegramBotStatus: "COMING_SOON",
  },
  /**
   * Error mapping — never expose raw LLM provider errors.
   */
  errorMessages: {
    RATE_LIMITED: "Atlas AI is receiving many requests. Please try again in a moment.",
    ASSISTANT_UNAVAILABLE: "Atlas AI is temporarily unavailable. Please try again later.",
    MODEL_UNAVAILABLE: "Atlas AI is being updated. Please try again in a moment.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    NETWORK: "Atlas AI couldn't be reached. Please check your connection.",
    DEFAULT: "Atlas AI couldn't process your request. Please try again or contact support.",
  },
  /**
   * Hard limits enforced by backend (mirror here for UX).
   */
  limits: {
    maxPromptLength: 2000,
    minPromptLength: 1,
    messagesPerConversation: 50,
  },
  /**
   * Streaming config — SSE from /api/ai/chat.
   */
  streaming: {
    enabled: true,
    typingIndicatorMs: 400,
  },
  /**
   * Conversation UX — history stored locally (no sensitive data).
   * For authenticated users, future backend sync is supported via /api/v1/assistant/conversations.
   */
  history: {
    localStorageKey: "atlaswallet.ai.conversations",
    maxConversations: 5,
    maxMessagesPerConversation: 50,
    clearable: true,
  },
} as const;

export type AtlasAiConfig = typeof atlasAiConfig;
