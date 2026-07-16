"use client";

import { useEffect, useRef, useState } from "react";

/** Small pointer-fine cursor: scales up over interactive elements. Touch devices: off. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return Boolean(
        el.closest(
          "a, button, [role='button'], input, textarea, select, label, .cursor-pointer"
        )
      );
    };

    const onOver = (e: MouseEvent) => setHovering(isInteractive(e.target));
    const onOut = (e: MouseEvent) => {
      if (!isInteractive(e.relatedTarget)) setHovering(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-[100] hidden mix-blend-difference md:block ${
        hovering ? "h-8 w-8" : "h-2.5 w-2.5"
      } rounded-full bg-white transition-[width,height] duration-200 ease-out`}
      style={{ willChange: "transform" }}
    />
  );
}
