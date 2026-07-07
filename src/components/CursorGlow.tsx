"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReduced || !hasFinePointer) return;

    setEnabled(true);
    let visible = false;

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (!visible && glowRef.current) {
        visible = true;
        glowRef.current.style.opacity = "1";
      }
    };

    const onLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
      visible = false;
    };

    let frameId = 0;

    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * 0.14;
      position.current.y += (target.current.y - position.current.y) * 0.14;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        ref={glowRef}
        className="absolute top-0 left-0 h-[28rem] w-[28rem] rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.08) 35%, transparent 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
