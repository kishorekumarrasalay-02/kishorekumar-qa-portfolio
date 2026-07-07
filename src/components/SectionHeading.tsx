"use client";

import { motion, useReducedMotion } from "framer-motion";
import { defaultTransition } from "./motion/variants";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-8 text-center sm:mb-10 lg:mb-12"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={defaultTransition}
    >
      <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-primary sm:mt-4 sm:h-1 sm:w-14" />
      {subtitle && (
        <p className="text-subtitle mx-auto mt-4 max-w-2xl px-2 text-sm text-muted sm:mt-5 sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
