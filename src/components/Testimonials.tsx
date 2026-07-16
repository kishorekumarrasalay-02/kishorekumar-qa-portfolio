"use client";

import { useEffect, useRef } from "react";
import MotionReveal from "./MotionReveal";
import SectionHeading from "./SectionHeading";
import { portfolioData } from "@/data/portfolio";

export default function Testimonials() {
  const { testimonials } = portfolioData;
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let offset = 0;

    const tick = () => {
      if (!paused.current && track) {
        offset += 0.35;
        const half = track.scrollWidth / 2;
        if (offset >= half) offset = 0;
        track.style.transform = `translateX(-${offset}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...testimonials.items, ...testimonials.items];

  return (
    <section
      id="testimonials"
      className="overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={testimonials.sectionTitle} />
        <MotionReveal>
          <div
            className="relative"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
          >
            <div
              ref={trackRef}
              className="flex w-max gap-4 will-change-transform"
              aria-label="Testimonials carousel"
            >
              {items.map((item, i) => (
                <blockquote
                  key={`${item.name}-${i}`}
                  className="w-[min(320px,80vw)] shrink-0 rounded-2xl border border-card-border bg-card p-5 sm:w-[360px] sm:p-6"
                >
                  <p className="text-body text-sm text-muted">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-4">
                    <cite className="not-italic">
                      <span className="font-heading text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {item.role}
                      </span>
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
