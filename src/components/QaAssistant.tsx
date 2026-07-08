"use client";

import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getAssistantReply,
  getOutroMessage,
  getWelcomeMessage,
  SUGGESTIONS,
  type QaMessage,
} from "@/lib/qaAssistant";

function Avatar({ size = 32, round = false }: { size?: number; round?: boolean }) {
  return (
    <span
      className={`qa-avatar flex shrink-0 items-center justify-center font-heading font-bold text-white ${
        round ? "rounded-full" : "rounded-lg"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      KK
    </span>
  );
}

function TypedText({
  text,
  onUpdate,
  onDone,
}: {
  text: string;
  onUpdate?: () => void;
  onDone?: () => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setCount(text.length);
      onUpdate?.();
      onDone?.();
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setCount(Math.min(i, text.length));
      onUpdate?.();
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, 12);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <>{text.slice(0, count)}</>;
}

export default function QaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<QaMessage[]>([getWelcomeMessage()]);
  const [typing, setTyping] = useState(false);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(["welcome"]));
  const [showNudge, setShowNudge] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const openChat = () => {
    openedRef.current = true;
    setShowNudge(false);
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setDoneIds(new Set([welcome.id]));
    setInput("");
    setTyping(false);
    setOpen(true);
  };

  // Auto-open once per session after 2.5s, plus a delayed nudge if still closed
  useEffect(() => {
    const seen = sessionStorage.getItem("qa_seen");
    let openTimer: ReturnType<typeof setTimeout> | undefined;

    if (!seen) {
      openTimer = setTimeout(() => {
        sessionStorage.setItem("qa_seen", "1");
        if (!openedRef.current) openChat();
      }, 2500);
    }

    const nudgeTimer = setTimeout(() => {
      if (!openedRef.current) setShowNudge(true);
    }, 15000);

    return () => {
      if (openTimer) clearTimeout(openTimer);
      clearTimeout(nudgeTimer);
    };
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, typing]);

  // Lock background page scroll on mobile while the chat is open
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (!isMobile) return;

    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const markDone = (id: string) =>
    setDoneIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: QaMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    markDone(userMsg.id);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const replyMsg = getAssistantReply(trimmed);
      setTyping(false);
      setMessages((prev) => [...prev, replyMsg]);

      const typingDuration = Math.min(replyMsg.text.length * 6, 3500) + 500;
      window.setTimeout(() => {
        setMessages((prev) => [...prev, getOutroMessage()]);
      }, typingDuration);
    }, 700);
  };

  return (
    <div className="qa-assistant fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <div className="qa-assistant-panel mb-3 flex h-[min(560px,calc(100vh-6rem))] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-card-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative">
                <Avatar size={34} />
                <span className="qa-status-dot absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-400" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Kishore Kumar
                </p>
                <p className="text-[11px] text-muted">Online · QA Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-foreground"
              aria-label="Close assistant"
            >
              <X size={16} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isDone = doneIds.has(msg.id);
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && <Avatar size={26} />}
                  <div
                    className={`max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line ${
                      isUser
                        ? "bg-primary text-white"
                        : "border border-card-border bg-background/80 text-foreground"
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : (
                      <TypedText
                        text={msg.text}
                        onUpdate={scrollToBottom}
                        onDone={() => markDone(msg.id)}
                      />
                    )}

                    {!isUser && isDone && msg.cards && msg.cards.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.cards.map((card) => (
                          <div
                            key={card.title}
                            className="rounded-xl border border-card-border bg-card/80 p-3"
                          >
                            <p className="font-heading text-sm font-semibold text-foreground">
                              {card.title}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {card.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary-light"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <a
                              href={card.href}
                              target={card.href.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex text-[11px] font-semibold text-primary-light hover:underline"
                            >
                              {card.hrefLabel} →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {!isUser && isDone && msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {msg.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            download={link.download ? true : undefined}
                            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary-light transition hover:bg-primary/20"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex items-end gap-2">
                <Avatar size={26} />
                <div className="rounded-2xl border border-card-border bg-background/80 px-3.5 py-3">
                  <span className="qa-typing-dots inline-flex gap-1">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-card-border px-3 py-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => sendMessage(s.query)}
                  className="rounded-full border border-card-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted transition hover:border-primary/40 hover:text-primary-light"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="send"
                name="qa-assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 rounded-xl border border-card-border bg-background/80 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:opacity-90 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {!open && showNudge && (
        <div className="qa-nudge mb-3 w-[min(260px,calc(100vw-2rem))] rounded-2xl border border-card-border bg-card/95 p-3.5 shadow-xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setShowNudge(false)}
            className="absolute right-2 top-2 text-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
          <div className="flex items-start gap-2.5">
            <span className="text-lg">👋</span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Need help finding something?
              </p>
              <button
                type="button"
                onClick={openChat}
                className="mt-1 text-[11px] font-medium text-primary-light hover:underline"
              >
                Ask me anything about Kishore&apos;s portfolio →
              </button>
            </div>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={openChat}
          className="qa-assistant-fab group relative ml-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
          aria-label="Open QA Assistant"
        >
          <Avatar size={56} round />
          <span className="qa-assistant-pulse absolute inset-0 rounded-full border-2 border-primary/40" />
        </button>
      )}
    </div>
  );
}
