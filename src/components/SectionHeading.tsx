"use client";

import { motion, useReducedMotion } from "framer-motion";
import AnimatedUnderline from "./AnimatedUnderline";
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
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={defaultTransition}
    >
      <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
        <span
          className={`gradient-text ${shouldReduceMotion ? "" : "gradient-text-animate"}`}
        >
          {title}
        </span>
      </h2>
      <AnimatedUnderline />
      {subtitle && (
        <p className="text-subtitle mx-auto mt-4 max-w-2xl px-2 text-sm text-muted sm:mt-5 sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
