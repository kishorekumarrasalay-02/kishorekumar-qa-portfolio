"use client";

import { Send, X, Volume2, VolumeX, Copy, Check, ThumbsUp, Code } from "lucide-react";
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
  return (
    <span
      className={`qa-logo relative shrink-0 overflow-hidden rounded-full ${
        variant === "fab" ? "qa-logo-fab" : "qa-logo-inline"
      }`}
      style={
        variant === "fab"
          ? undefined
          : { width: size, height: size, minWidth: size, minHeight: size }
      }
    >
      <Image
        src="/qa-assistant-logo.png?v=2"
        alt="QA Assistant"
        fill
        className="qa-logo-img"
        quality={100}
        unoptimized
        sizes={
          variant === "fab"
            ? "(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
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
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [likedMsgIds, setLikedMsgIds] = useState<Set<string>>(new Set());

  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Speak text using Web Speech API if enabled
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
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

  useEffect(() => {
    const closeChat = () => setOpen(false);
    window.addEventListener("qa-chat-close", closeChat);
    return () => window.removeEventListener("qa-chat-close", closeChat);
  }, []);

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

  const markDone = (id: string, textToSpeak?: string) => {
    setDoneIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (textToSpeak) speakText(textToSpeak);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleLikeMessage = (id: string) => {
    setLikedMsgIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

        markDone(replyId, full);
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
    }, 350);
  };

  return (
    <div
      className={`qa-assistant fixed z-50 transition-all ${
        open
          ? "inset-0 sm:inset-auto sm:right-6 sm:bottom-6"
          : "right-4 bottom-4 sm:right-6 sm:bottom-6"
      }`}
    >
      {open && (
        <div className="qa-assistant-panel flex h-[100dvh] w-full sm:h-[580px] sm:w-[380px] flex-col overflow-hidden bg-card/95 sm:rounded-2xl border-0 sm:border sm:border-card-border shadow-2xl backdrop-blur-xl transition-all sm:mb-3">
          {/* Fixed Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-card-border px-4 py-3 bg-card/95 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <span className="relative shrink-0">
                <QaLogo size={36} />
                <span className="qa-status-dot absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-400" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Kishore Kumar
                </p>
                <p className="text-[11px] text-muted">Online · QA AI Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  ttsEnabled ? "bg-primary/20 text-primary-light" : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
                aria-label={ttsEnabled ? "Disable Text to Speech" : "Enable Text to Speech"}
                title={ttsEnabled ? "Voice Speech ON" : "Voice Speech OFF"}
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-foreground"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* Messages Feed */}
          <div
            ref={listRef}
            className="flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-3.5 py-4"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isDone = doneIds.has(msg.id);
              const isLiked = likedMsgIds.has(msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && <QaLogo size={26} />}
                  <div
                    className={`max-w-[86%] min-w-0 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line shadow-sm ${
                      isUser
                        ? "bg-primary text-white"
                        : "border border-card-border bg-background/90 text-foreground"
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
                        onDone={() => markDone(msg.id, msg.text)}
                      />
                    )}

                    {/* Code Snippet Box */}
                    {!isUser && isDone && msg.codeSnippet && (
                      <div className="mt-2.5 overflow-hidden rounded-xl border border-card-border bg-black/90 p-2.5 font-mono text-[11px] text-emerald-400">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 text-[10px] text-muted">
                          <span className="flex items-center gap-1"><Code size={12} /> QA Code Spec</span>
                          <button
                            onClick={() => copyToClipboard(msg.codeSnippet!, msg.id)}
                            className="flex items-center gap-1 rounded px-1.5 py-0.5 bg-white/10 text-white hover:bg-white/20 transition"
                          >
                            {copiedCodeId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                            {copiedCodeId === msg.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Project Cards */}
                    {!isUser && isDone && msg.cards && msg.cards.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.cards.map((card) => (
                          <div
                            key={card.title}
                            className="rounded-xl border border-card-border bg-card/80 p-2.5"
                          >
                            <p className="font-heading text-xs font-semibold text-foreground">
                              {card.title}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
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
                              className="mt-2 inline-flex text-[11px] font-semibold text-primary-light hover:underline"
                            >
                              {card.hrefLabel} →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    {!isUser && isDone && msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
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

                    {/* Interactive Like/Reaction Footer */}
                    {!isUser && isDone && (
                      <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-card-border/30 pt-1.5 text-[10px] text-muted">
                        <button
                          onClick={() => toggleLikeMessage(msg.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                            isLiked ? "text-primary-light bg-primary/10" : "hover:text-foreground"
                          }`}
                          title="Was this helpful?"
                        >
                          <ThumbsUp size={11} /> {isLiked ? "Helpful" : ""}
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:text-foreground transition"
                          title="Copy reply text"
                        >
                          {copiedCodeId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                        </button>
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

          {/* Fixed Bottom Input Bar & Suggestions */}
          <div className="shrink-0 border-t border-card-border px-3 py-2.5 bg-card/95 backdrop-blur-md sticky bottom-0 z-20">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => sendMessage(s.query)}
                  className="shrink-0 rounded-full border border-card-border bg-background/80 px-2.5 py-1 text-[10px] font-medium text-muted transition hover:border-primary/50 hover:text-primary-light hover:bg-primary/5"
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
                placeholder="Ask about Playwright, API testing, CV..."
                className="flex-1 rounded-xl border border-card-border bg-background/90 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted focus:border-primary/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:opacity-90 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={14} />
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
            className="qa-assistant-fab qa-assistant-fab-intro group relative flex h-14 w-14 items-center justify-center overflow-visible rounded-full border-0 bg-transparent p-0 shadow-none sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
            aria-label="Open QA Assistant"
          >
            <QaLogo size={72} variant="fab" />
          </button>
        </div>
      )}
    </div>
  );
}
