"use client";

import { Bug, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getAssistantReply,
  getWelcomeMessage,
  QUICK_PROMPTS,
  type QaMessage,
} from "@/lib/qaAssistant";

export default function QaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<QaMessage[]>([getWelcomeMessage()]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, typing]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: QaMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const reply = getAssistantReply(trimmed);
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 500);
  };

  return (
    <div className="qa-assistant fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <div className="qa-assistant-panel mb-3 flex h-[min(520px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-card-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                <Bug size={16} />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  QA Assistant
                </p>
                <p className="text-[11px] text-muted">Ask about Kishore</p>
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

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "border border-card-border bg-background/80 text-foreground"
                  }`}
                >
                  {msg.text}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {msg.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel="noopener noreferrer"
                          download={
                            link.href.endsWith(".pdf") ? true : undefined
                          }
                          className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary-light transition hover:bg-primary/20"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-card-border bg-background/80 px-3.5 py-2.5">
                  <span className="qa-typing-dots inline-flex gap-1">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-card-border px-3 py-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-card-border bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted transition hover:border-primary/40 hover:text-primary-light"
                >
                  {prompt}
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
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
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

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="qa-assistant-fab group flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-card/90 text-primary-light shadow-lg backdrop-blur-xl transition hover:scale-105 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.35)]"
        aria-label={open ? "Close QA Assistant" : "Open QA Assistant"}
      >
        {open ? <X size={22} /> : <Bug size={22} />}
        {!open && (
          <span className="qa-assistant-pulse absolute inset-0 rounded-full border border-primary/40" />
        )}
      </button>
    </div>
  );
}
