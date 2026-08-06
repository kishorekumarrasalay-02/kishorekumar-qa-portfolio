"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  float?: boolean;
  tilt?: boolean;
}

export default function FloatingCard({
  children,
  className = "",
  float = true,
  tilt = true,
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
  });

  const onMove = (e: MouseEvent) => {
    if (reduce || !tilt) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 10;

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`,
      transition: "transform 0.12s ease-out",
    });
  };

  const onLeave = () => {
    setTiltStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.35s ease",
    });
  };

  return (
    <motion.div
      ref={ref}
      className={`floating-card h-full ${float && !reduce ? "floating-card-bob" : ""} ${className}`}
      style={tiltStyle}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
