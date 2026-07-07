"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  defaultTransition,
  motionVariants,
  reducedMotionVariants,
  staggerContainer,
  type MotionVariant,
} from "./motion/variants";

interface MotionStaggerProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionStagger({ children, className = "" }: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "-40px" }}
      variants={shouldReduceMotion ? reducedMotionVariants : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

interface MotionItemProps {
  children: React.ReactNode;
  className?: string;
  variant?: MotionVariant;
}

export function MotionItem({
  children,
  className = "",
  variant = "fadeUp",
}: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? reducedMotionVariants : motionVariants[variant]}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  );
}
