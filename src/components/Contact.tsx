"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState, type MouseEvent } from "react";
import MotionReveal from "./MotionReveal";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import SocialIcons from "./SocialIcons";
import { portfolioData } from "@/data/portfolio";
import { useAnalyticsContext } from "@/components/analytics/AnalyticsProvider";

const TRACK_MAP: Record<string, string> = {
  email: "email",
  phone: "phone",
  linkedin: "linkedin",
  github: "github",
};

export default function Contact() {
  const { contact, social } = portfolioData;
  const { trackClick } = useAnalyticsContext();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    trackClick("copy_email");
    try {
      await navigator.clipboard.writeText(social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCardMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    event.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  const cardClass =
    "contact-card group flex h-full min-h-[168px] w-full min-w-0 flex-col items-center justify-center rounded-2xl border border-card-border bg-card p-4 text-center sm:min-h-[180px] sm:p-5";

  const valueClass = (type: string) => {
    if (type === "email") {
      return "mt-2 w-full max-w-full px-1 text-[10px] leading-snug font-medium break-all text-foreground sm:text-xs";
    }
    if (type === "location") {
      return "mt-2 w-full max-w-full px-0.5 text-[9px] leading-tight font-medium text-foreground sm:text-[10px] lg:text-[11px] break-words hyphens-auto";
    }
    return "text-body mt-2 w-full max-w-full px-1 text-sm font-medium break-words text-foreground";
  };

  return (
    <section id="contact" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title={contact.sectionTitle}
          subtitle={contact.subtitle}
        />

        <MotionStagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 [&>*]:min-w-0">
          {contact.items.map((item) => {
            const content = (
              <>
                <span className="contact-card-edge" aria-hidden />
                <span
                  className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110 sm:text-4xl"
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase transition-colors duration-300 group-hover:text-primary-light">
                  {item.label}
                </p>
                <p className={valueClass(item.type)}>{item.value}</p>
              </>
            );

            return (
              <MotionItem
                key={item.label}
                variant="fadeUp"
                className="h-full"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className={cardClass}
                    onMouseMove={handleCardMouseMove}
                    onClick={() => {
                      const track = TRACK_MAP[item.type];
                      if (track) trackClick(track);
                    }}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    className={cardClass}
                    onMouseMove={handleCardMouseMove}
                  >
                    {content}
                  </div>
                )}
              </MotionItem>
            );
          })}
        </MotionStagger>

        <MotionReveal variant="fadeUp" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={copyEmail}
            className="contact-glow inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-8 py-3.5 text-sm font-semibold text-primary transition-all sm:w-auto sm:px-10"
          >
            {copied ? (
              <>
                <Check size={18} />
                {contact.copyEmailSuccess}
              </>
            ) : (
              <>
                <Copy size={18} />
                {contact.copyEmailLabel}
              </>
            )}
          </button>

          <a
            href={`mailto:${social.email}`}
            onClick={() => trackClick("contact_button")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
          >
            <Mail size={18} />
            {contact.emailCta}
          </a>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.1} className="mt-12">
          <SocialIcons size="sm" />
        </MotionReveal>
      </div>
    </section>
  );
}
