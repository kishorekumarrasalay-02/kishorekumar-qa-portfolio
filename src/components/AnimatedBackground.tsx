"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PARTICLE_COUNT = 28;
const BINARY_COLUMNS = 10;
const NEURAL_NODES = [
  { x: 12, y: 18 },
  { x: 28, y: 32 },
  { x: 18, y: 55 },
  { x: 42, y: 22 },
  { x: 55, y: 48 },
  { x: 68, y: 28 },
  { x: 78, y: 58 },
  { x: 88, y: 38 },
  { x: 35, y: 72 },
  { x: 62, y: 78 },
  { x: 48, y: 58 },
  { x: 22, y: 82 },
];

const NEURAL_LINKS = [
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 4],
  [2, 11],
  [3, 5],
  [4, 6],
  [4, 10],
  [5, 7],
  [6, 9],
  [8, 10],
  [8, 11],
  [9, 10],
  [3, 4],
  [5, 4],
];

function binaryChunk(seed: number) {
  let n = seed;
  let out = "";
  for (let i = 0; i < 18; i++) {
    n = (n * 16807 + 7) % 2147483647;
    out += n % 2 === 0 ? "0" : "1";
    if (i % 4 === 3) out += " ";
  }
  return out.trim();
}

export default function AnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 50, y: 40 });
  const smooth = useRef({ x: 50, y: 40 });

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    let raf = 0;
    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(420px circle at ${smooth.current.x}% ${smooth.current.y}%, rgba(59,130,246,0.16), rgba(139,92,246,0.08) 35%, transparent 65%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
        id: index,
        left: `${(index * 19 + 9) % 100}%`,
        top: `${(index * 29 + 13) % 100}%`,
        size: 1.5 + (index % 4) * 0.7,
        delay: `${(index % 12) * 0.55}s`,
        duration: `${16 + (index % 7) * 2.2}s`,
      })),
    []
  );

  const binaryCols = useMemo(
    () =>
      Array.from({ length: BINARY_COLUMNS }, (_, index) => ({
        id: index,
        left: `${6 + index * 9.5}%`,
        delay: `${index * 0.85}s`,
        duration: `${18 + (index % 5) * 3}s`,
        text: `${binaryChunk(index * 97 + 3)}\n${binaryChunk(index * 41 + 11)}\n${binaryChunk(index * 13 + 29)}\n${binaryChunk(index * 7 + 53)}`,
      })),
    []
  );

  const motionOff = reduceMotion ? " bg-tech-static" : "";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />

      <div className={`absolute inset-0 opacity-70 dark:opacity-100${motionOff}`}>
        <div className={`aurora-orb aurora-orb-purple ${reduceMotion ? "aurora-static" : ""}`} />
        <div className={`aurora-orb aurora-orb-blue ${reduceMotion ? "aurora-static" : ""}`} />
        <div className={`aurora-orb aurora-orb-cyan ${reduceMotion ? "aurora-static" : ""}`} />
        <div className={`aurora-orb aurora-orb-mesh ${reduceMotion ? "aurora-static" : ""}`} />
        <div className="absolute inset-0 bg-mesh-gradient opacity-50 dark:opacity-65" />
        <div className="bg-tech-glow-blur absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30" />
        <div className="bg-tech-glow-blur absolute right-0 bottom-10 h-80 w-80 rounded-full bg-primary-light/15 blur-3xl dark:bg-cyan-400/20" />
      </div>

      {!reduceMotion && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 transition-[background] duration-75"
        />
      )}

      <div className="bg-grid-mesh absolute inset-0 opacity-[0.12] dark:opacity-[0.22]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.28] dark:opacity-[0.45]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="tech-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="50%" stopColor="rgba(6,182,212,0.85)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
          <linearGradient id="wave-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6,182,212,0)" />
            <stop offset="40%" stopColor="rgba(59,130,246,0.55)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
          <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          className={reduceMotion ? undefined : "bg-circuit-layer"}
          fill="none"
          stroke="url(#tech-line)"
          strokeWidth="1.2"
          filter="url(#soft-glow)"
        >
          <path d="M40 120 H180 V220 H320 V160 H460" />
          <path d="M80 420 H220 V340 H360 V480 H520" />
          <path d="M620 80 V200 H760 V140 H920" />
          <path d="M700 520 H860 V400 H980" />
          <path d="M200 600 H360 V700 H500" />
          <path d="M520 260 H640 V320 H780 V240" />
          <circle cx="180" cy="120" r="3.5" fill="rgba(6,182,212,0.8)" stroke="none" />
          <circle cx="320" cy="220" r="3" fill="rgba(59,130,246,0.75)" stroke="none" />
          <circle cx="460" cy="160" r="3.5" fill="rgba(139,92,246,0.8)" stroke="none" />
          <circle cx="360" cy="340" r="3" fill="rgba(6,182,212,0.7)" stroke="none" />
          <circle cx="760" cy="200" r="3.5" fill="rgba(59,130,246,0.75)" stroke="none" />
          <circle cx="860" cy="520" r="3" fill="rgba(96,165,250,0.7)" stroke="none" />
          <rect x="210" y="330" width="22" height="14" rx="2" fill="rgba(59,130,246,0.25)" stroke="rgba(6,182,212,0.55)" />
          <rect x="630" y="310" width="26" height="16" rx="2" fill="rgba(139,92,246,0.2)" stroke="rgba(6,182,212,0.5)" />
        </g>

        <g
          fill="none"
          stroke="url(#wave-stroke)"
          strokeWidth="1.5"
          className={reduceMotion ? undefined : "bg-wave-layer"}
        >
          <path d="M0 640 Q160 600 320 640 T640 640 T960 640 T1280 640" />
          <path d="M0 680 Q180 720 360 680 T720 680 T1080 680 T1440 680" opacity="0.7" />
          <path d="M0 560 Q140 520 280 560 T560 560 T840 560 T1120 560" opacity="0.45" />
        </g>

        <g className={reduceMotion ? undefined : "bg-neural-layer"}>
          {NEURAL_LINKS.map(([a, b], i) => {
            const from = NEURAL_NODES[a];
            const to = NEURAL_NODES[b];
            return (
              <line
                key={`link-${i}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(6,182,212,0.28)"
                strokeWidth="1"
              />
            );
          })}
          {NEURAL_NODES.map((node, i) => (
            <g key={`node-${i}`}>
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="3.2"
                fill="rgba(59,130,246,0.55)"
                className={reduceMotion ? undefined : "bg-neural-node"}
                style={{ animationDelay: `${i * 0.35}s` }}
              />
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="7"
                fill="none"
                stroke="rgba(139,92,246,0.25)"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>
      </svg>

      {!reduceMotion && (
        <div className="bg-binary-wrap absolute inset-0 overflow-hidden opacity-[0.12] dark:opacity-[0.2]">
          {binaryCols.map((col) => (
            <pre
              key={col.id}
              className="bg-binary-stream absolute top-[-40%] font-mono text-[10px] leading-4 text-primary-light/80 whitespace-pre"
              style={{
                left: col.left,
                animationDelay: col.delay,
                animationDuration: col.duration,
              }}
            >
              {col.text}
              {"\n"}
              {col.text}
            </pre>
          ))}
        </div>
      )}

      {!reduceMotion &&
        particles.map((particle) => (
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

      <div className="absolute inset-0 bg-vignette opacity-80 dark:opacity-100" />
      <div className="bg-soft-blur absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}
