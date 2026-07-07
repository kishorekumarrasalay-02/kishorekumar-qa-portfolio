"use client";

import { useEffect, useState } from "react";

const PARTICLES = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 11) % 100}%`,
  top: `${(index * 23 + 7) % 100}%`,
  size: 2 + (index % 3),
  delay: `${(index % 10) * 0.7}s`,
  duration: `${14 + (index % 6) * 2}s`,
}));

export default function AnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#050816]" />

      <div
        className={`aurora-orb aurora-orb-purple ${reduceMotion ? "aurora-static" : ""}`}
      />
      <div
        className={`aurora-orb aurora-orb-blue ${reduceMotion ? "aurora-static" : ""}`}
      />
      <div
        className={`aurora-orb aurora-orb-cyan ${reduceMotion ? "aurora-static" : ""}`}
      />
      <div
        className={`aurora-orb aurora-orb-mesh ${reduceMotion ? "aurora-static" : ""}`}
      />

      <div className="absolute inset-0 bg-mesh-gradient opacity-60" />

      {!reduceMotion &&
        PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}

      <div className="absolute inset-0 bg-vignette" />
    </div>
  );
}
