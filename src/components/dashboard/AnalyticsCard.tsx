"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  trend?: string;
}

export default function AnalyticsCard({
  title,
  value,
  icon: Icon,
  suffix = "",
  trend,
}: AnalyticsCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const duration = 800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="dash-glass group p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-[#94a3b8] uppercase">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {display.toLocaleString()}
            {suffix}
          </p>
          {trend && (
            <p className="mt-2 text-xs text-[#38bdf8]">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/15 text-[#38bdf8] transition group-hover:bg-[#3b82f6]/25">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
