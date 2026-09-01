"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, User, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Square, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { atlasAiConfig } from "@/config/atlas-ai-config";
import { AuthContext, type AuthContextValue } from "@/lib/auth/auth-context";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
  pending?: boolean;
  feedback?: "up" | "down" | null;
};

type StreamState = "idle" | "streaming" | "done" | "error";

/**
 * AtlasWallet — Atlas AI floating widget.
 *
 * Architecture:
 *   - Floating button bottom-right (desktop) / bottom-right above mobile nav (mobile).
 *   - On open: chat dialog with quick prompts.
 *   - POST /api/ai/chat (SSE streaming).
 *   - Backend will eventually proxy to /api/v1/assistant/chat on the AtlasWallet Backend.
 *
 * Safety:
 *   - Never executes financial operations directly.
 *   - When user asks to "send/withdraw/invest", assistant can prepare but
 *     never execute — that requires explicit UI confirmation.
 *   - Sanitizes markdown before rendering (allow-list: bold, italic, lists, line breaks).
 */
export function AtlasAiWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streamState, setStreamState] = useState<StreamState>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Optional auth context — widget works on public pages too.
  const authCtx = useContext(AuthContext) as AuthContextValue | null;
  const session = authCtx?.session ?? null;

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: `m-welcome-${Date.now()}`,
          role: "assistant",
          content: atlasAiConfig.greeting,
          ts: Date.now(),
        },
      ]);
    }
  }, [open, messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamState]);

  // Cleanup any in-flight stream on unmount/close
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length < atlasAiConfig.limits.minPromptLength) return;
      if (trimmed.length > atlasAiConfig.limits.maxPromptLength) {
        toast.error(`Message too long (max ${atlasAiConfig.limits.maxPromptLength} characters)`);
        return;
      }
      if (streamState === "streaming") return;

      const userMsg: Message = {
        id: `m-u-${Date.now()}`,
        role: "user",
        content: trimmed,
        ts: Date.now(),
      };
      const assistantId = `m-a-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        ts: Date.now(),
        pending: true,
      };
      setMessages((m) => [...m, userMsg, assistantMsg]);
      setInput("");
      setLastError(null);
      setStreamState("streaming");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-Id": `ai-req-${Date.now()}`,
          },
          body: JSON.stringify({
            messages: [
              ...messages.filter((m) => !m.pending).map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: trimmed },
            ],
            language: typeof navigator !== "undefined" ? navigator.language : "en-GB",
          }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "RATE_LIMITED");
        }
        if (!res.ok || !res.body) {
          throw new Error("NETWORK");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "token" && typeof evt.content === "string") {
                acc += evt.content;
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: acc, pending: false }
                      : msg
                  )
                );
              } else if (evt.type === "done") {
                setStreamState("done");
              }
            } catch {
              // ignore malformed chunk
            }
          }
        }
        setStreamState("done");
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          // user stopped — keep partial content
          setStreamState("done");
          return;
        }
        const code = (err as Error)?.message || "DEFAULT";
        const msg =
          atlasAiConfig.errorMessages[code as keyof typeof atlasAiConfig.errorMessages] ||
          atlasAiConfig.errorMessages.DEFAULT;
        setLastError(msg);
        setStreamState("error");
        // Replace pending assistant message with the error
        setMessages((m) =>
          m.map((mm) =>
            mm.id === assistantId
              ? { ...mm, content: msg, pending: false, ts: Date.now() }
              : mm
          )
        );
      } finally {
        abortRef.current = null;
      }
    },
    [messages, streamState]
  );

  const stopGeneration = () => {
    abortRef.current?.abort();
    setStreamState("done");
  };

  const retryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // Remove the failed assistant message and retry
    setMessages((m) => m.filter((mm) => !(mm.role === "assistant" && mm.id > lastUser.id)));
    sendMessage(lastUser.content);
  };

  const clearConversation = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamState("idle");
    setLastError(null);
    setTimeout(() => {
      setMessages([
        {
          id: `m-welcome-${Date.now()}`,
          role: "assistant",
          content: atlasAiConfig.greeting,
          ts: Date.now(),
        },
      ]);
    }, 50);
  };

  const handleQuickPrompt = (p: string) => {
    if (p === "Talk to a human") {
      setOpen(true);
      sendMessage("I want to talk to a human");
      return;
    }
    sendMessage(p);
  };

  const copyMessage = (content: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      toast.success("Copied");
    }
  };

  const setFeedback = (id: string, feedback: "up" | "down") => {
    setMessages((m) =>
      m.map((mm) =>
        mm.id === id
          ? { ...mm, feedback: mm.feedback === feedback ? null : feedback }
          : mm
      )
    );
    if (feedback === "up") toast.success("Thanks for your feedback");
    if (feedback === "down") toast.info("We'll use this to improve Atlas AI");
  };

  // Floating button — bottom-right (above mobile nav when in app)
  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          aria-label="Open Atlas AI assistant"
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-20 lg:bottom-6 right-4 sm:right-6 group"
        >
          <span className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-brand/40 blur-xl animate-pulse" aria-hidden />
            <span className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-brand to-brand-bright flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-background" aria-hidden />
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Atlas AI"
          aria-modal="false"
          className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] lg:w-[460px] max-h-[80vh] sm:max-h-[600px] flex flex-col premium-card rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-background-elevated/50">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-bright flex items-center justify-center text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-background-elevated" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">{atlasAiConfig.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground leading-none">
                  {session ? "Online · preview" : "Online · public preview"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearConversation}
                aria-label="Clear conversation"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Atlas AI"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onCopy={() => copyMessage(m.content)}
                onFeedback={(f) => setFeedback(m.id, f)}
                onRetry={retryLast}
                streamState={streamState}
              />
            ))}
            {streamState === "streaming" && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator />
            )}
          </div>

          {/* Quick prompts (only show when few messages) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {atlasAiConfig.quickPrompts.slice(0, 5).map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickPrompt(p)}
                  className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-brand/40 hover:bg-surface-hover transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border bg-background-elevated/30">
            {lastError && (
              <div className="mb-2 flex items-center justify-between gap-2 text-xs text-danger">
                <span className="truncate">{lastError}</span>
                <Button size="sm" variant="ghost" onClick={retryLast} className="h-6 px-2 text-danger hover:bg-danger/10">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (streamState === "streaming") {
                  stopGeneration();
                } else {
                  sendMessage(input);
                }
              }}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={atlasAiConfig.placeholder}
                rows={1}
                maxLength={atlasAiConfig.limits.maxPromptLength}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (streamState !== "streaming") sendMessage(input);
                  }
                }}
                className="flex-1 resize-none rounded-lg bg-surface/60 border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 max-h-32"
              />
              {streamState === "streaming" ? (
                <Button type="submit" size="icon" variant="outline" className="border-warning/40 text-warning hover:bg-warning/10 h-9 w-9 shrink-0">
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="bg-brand hover:bg-brand-bright text-white h-9 w-9 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                Atlas AI · preview responses
              </span>
              <span>{input.length}/{atlasAiConfig.limits.maxPromptLength}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  message,
  onCopy,
  onFeedback,
  onRetry,
  streamState,
}: {
  message: Message;
  onCopy: () => void;
  onFeedback: (f: "up" | "down") => void;
  onRetry: () => void;
  streamState: StreamState;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isLast = streamState === "error" && !message.pending;

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="shrink-0">
        <div
          className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${
            isUser
              ? "bg-surface-hover text-muted-foreground"
              : "bg-gradient-to-br from-brand to-brand-bright"
          }`}
        >
          {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        </div>
      </div>
      <div className={`flex-1 min-w-0 max-w-[85%] ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-brand text-white rounded-tr-sm"
              : "bg-surface/60 border border-border rounded-tl-sm"
          }`}
        >
          <MarkdownLite content={message.content} />
          {message.pending && streamState === "streaming" && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-brand align-middle animate-pulse" aria-hidden />
          )}
        </div>

        {/* Assistant actions */}
        {!isUser && !message.pending && message.content && streamState !== "streaming" && (
          <div className="mt-1 flex items-center gap-1">
            <button
              onClick={() => {
                onCopy();
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              aria-label="Copy"
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>
            <button
              onClick={() => onFeedback("up")}
              aria-label="Good response"
              className={`p-1 rounded hover:bg-surface-hover ${message.feedback === "up" ? "text-success" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => onFeedback("down")}
              aria-label="Bad response"
              className={`p-1 rounded hover:bg-surface-hover ${message.feedback === "down" ? "text-danger" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ThumbsDown className="h-3 w-3" />
            </button>
            {isLast && (
              <button
                onClick={onRetry}
                aria-label="Retry"
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand to-brand-bright flex items-center justify-center text-white">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-surface/60 border border-border px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * MarkdownLite — strict allow-list renderer.
 *
 * Supported:
 *   - **bold**
 *   - _italic_
 *   - `inline code`
 *   - bullet lists (• or - or *)
 *   - numbered lists (1. 2. 3.)
 *   - line breaks
 *
 * NOT supported (intentionally stripped):
 *   - raw HTML
 *   - images
 *   - links (rendered as plain text to prevent phishing in chat)
 *   - script/style tags
 *
 * Sanitization: escape < > & before applying markdown rules.
 */
function MarkdownLite({ content }: { content: string }) {
  const html = useMemoRenderMarkdown(content);
  return (
    <div
      className="prose-atlas-ai"
      // We escape and only allow a tiny subset of markdown, so this is safe.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function useMemoRenderMarkdown(input: string): string {
  // Escape HTML first
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Apply markdown rules line by line
  const lines = escaped.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    // Bullet item
    if (/^[•\-\*]\s+/.test(trimmed)) {
      if (!inList) {
        out.push('<ul class="ai-list">');
        inList = true;
      }
      out.push(`<li>${inline(trimmed.replace(/^[•\-\*]\s+/, ""))}</li>`);
      continue;
    }
    // Numbered item
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList) {
        out.push('<ol class="ai-list">');
        inList = true;
      }
      out.push(`<li>${inline(trimmed.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    if (trimmed === "") {
      out.push("<br />");
    } else {
      out.push(`<p>${inline(trimmed)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("");

  function inline(s: string): string {
    return s
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>');
  }
}
