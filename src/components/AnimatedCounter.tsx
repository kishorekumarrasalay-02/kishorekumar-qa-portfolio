"use client";

import { useEffect, useMemo, useState } from "react";

function formatNumber(value: number) {
  return value.toLocaleString();
}

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  durationMs = 900,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const formattedTarget = useMemo(() => value, [value]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDisplay(formattedTarget);
      return;
    }

    const start = performance.now();
    const from = 0;
    const to = formattedTarget;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;

      const factor = Math.pow(10, decimals);
      setDisplay(Math.round(next * factor) / factor);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [formattedTarget, durationMs, decimals]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? display.toFixed(decimals) : formatNumber(display)}
      {suffix}
    </span>
  );
}

