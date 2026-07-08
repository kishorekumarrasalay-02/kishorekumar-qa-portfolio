"use client";

import { useEffect, useRef } from "react";
import type { SectionName } from "@/lib/analytics/types";
import { useAnalyticsContext } from "./AnalyticsProvider";

const SECTIONS: { id: SectionName; selector: string }[] = [
  { id: "home", selector: "#home" },
  { id: "about", selector: "#about" },
  { id: "experience", selector: "#experience" },
  { id: "skills", selector: "#skills" },
  { id: "portfolio", selector: "#portfolio" },
  { id: "personal-projects", selector: "#personal-projects" },
  { id: "contact", selector: "#contact" },
];

const SCROLL_MILESTONES = [25, 50, 75, 100];

export default function SectionTracker() {
  const { trackSection } = useAnalyticsContext();
  const viewedRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<Set<number>>(new Set());
  const enterTimeRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const { id, selector } of SECTIONS) {
      const el = document.querySelector(selector);
      if (!el) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !viewedRef.current.has(id)) {
              viewedRef.current.add(id);
              enterTimeRef.current.set(id, Date.now());
              trackSection(id);
            } else if (!entry.isIntersecting && viewedRef.current.has(id)) {
              const start = enterTimeRef.current.get(id);
              if (start) {
                const seconds = Math.round((Date.now() - start) / 1000);
                trackSection(id, seconds);
              }
            }
          }
        },
        { threshold: 0.35 }
      );

      observer.observe(el);
      observers.push(observer);
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !scrollRef.current.has(milestone)) {
          scrollRef.current.add(milestone);
          trackSection("home", undefined, milestone);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [trackSection]);

  return null;
}
