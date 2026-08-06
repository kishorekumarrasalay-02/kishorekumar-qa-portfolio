"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedUnderlineProps {
  className?: string;
}

/** SVG path draw animation — used under section titles */
export default function AnimatedUnderline({
  className = "",
}: AnimatedUnderlineProps) {
  const reduce = useReducedMotion();

  return (
    <svg
      className={`mx-auto mt-3 block h-2 w-16 overflow-visible text-foreground sm:mt-4 sm:w-20 ${className}`}
      viewBox="0 0 80 8"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M2 5 C 18 1, 32 9, 40 4 C 50 -1, 62 10, 78 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
