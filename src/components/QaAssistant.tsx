"use client";

import { Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  getAssistantReply,
  getOutroMessage,
  getWelcomeMessage,
  SUGGESTIONS,
  type QaMessage,
} from "@/lib/qaAssistant";

function QaLogo({
  size = 32,
  variant = "default",
}: {
  size?: number;
  variant?: "default" | "fab";
}) {
  const displaySize = variant === "fab" ? undefined : size;
  const renderSize = Math.max(Math.round(size * 3), 256);

  return (
    <span
      className={`qa-logo relative shrink-0 overflow-hidden rounded-full ${
        variant === "fab" ? "qa-logo-fab" : "qa-logo-inline"
      }`}
      style={
        displaySize
          ? { width: displaySize, height: displaySize }
          : undefined
      }
    >
      <Image
        src="/qa-assistant-logo.png"
        alt="QA Assistant"
        width={renderSize}
        height={renderSize}
        className="qa-logo-img h-full w-full"
        quality={100}
        unoptimized
        sizes={
          variant === "fab"
            ? "(max-width: 640px) 72px, (max-width: 768px) 88px, 112px"
            : `${size}px`
        }
        priority={variant === "fab"}
      />
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
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const openChat = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setDoneIds(new Set([welcome.id]));
    setInput("");
    setTyping(false);
    setOpen(true);
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, typing]);

  // Close chat when user clicks a nav link (prevents scroll/hash conflicts)
  useEffect(() => {
    const closeChat = () => setOpen(false);
    window.addEventListener("qa-chat-close", closeChat);
    return () => window.removeEventListener("qa-chat-close", closeChat);
  }, []);

  // Lock background scroll while chat is open (no position:fixed — keeps scroll position stable)
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  const markDone = (id: string) =>
    setDoneIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const sendMessage = async (text: string) => {
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

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => m.id !== "welcome" && !m.id.startsWith("outro"))
      .slice(-8)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (res.ok && res.body) {
        const replyId = crypto.randomUUID();
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: replyId, role: "assistant", text: "", live: true },
        ]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === replyId ? { ...m, text: full } : m))
          );
          scrollToBottom();
        }

        markDone(replyId);
        setMessages((prev) => [...prev, getOutroMessage()]);
        return;
      }
    } catch {
      // fall through to local reply
    }

    window.setTimeout(() => {
      const replyMsg = getAssistantReply(trimmed);
      setTyping(false);
      setMessages((prev) => [...prev, replyMsg]);

      const typingDuration = Math.min(replyMsg.text.length * 6, 3500) + 500;
      window.setTimeout(() => {
        setMessages((prev) => [...prev, getOutroMessage()]);
      }, typingDuration);
    }, 400);
  };

  return (
    <div className="qa-assistant fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <div className="qa-assistant-panel mb-3 flex h-[min(560px,calc(100vh-6rem))] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-card-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative">
                <QaLogo size={34} />
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
                  {!isUser && <QaLogo size={26} />}
                  <div
                    className={`max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line ${
                      isUser
                        ? "bg-primary text-white"
                        : "border border-card-border bg-background/80 text-foreground"
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : msg.live ? (
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
                            onClick={() => {
                              if (link.href.startsWith("#")) {
                                window.dispatchEvent(new CustomEvent("qa-chat-close"));
                              }
                            }}
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
                <QaLogo size={26} />
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

      {!open && (
        <div className="qa-assistant-fab-wrap ml-auto">
          <span className="qa-assistant-wave qa-assistant-wave-1" aria-hidden />
          <span className="qa-assistant-wave qa-assistant-wave-2" aria-hidden />
          <span className="qa-assistant-wave qa-assistant-wave-3" aria-hidden />
          <button
            type="button"
            onClick={openChat}
            className="qa-assistant-fab qa-assistant-fab-intro group relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-visible rounded-full border-0 bg-transparent p-0 shadow-none sm:h-20 sm:w-20 md:h-28 md:w-28"
            aria-label="Open QA Assistant"
          >
            <QaLogo size={112} variant="fab" />
          </button>
        </div>
      )}
    </div>
  );
}
