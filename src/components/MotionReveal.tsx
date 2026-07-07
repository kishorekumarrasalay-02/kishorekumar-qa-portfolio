"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  defaultTransition,
  motionVariants,
  reducedMotionVariants,
  type MotionVariant,
} from "./motion/variants";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: MotionVariant;
  delay?: number;
}

export default function MotionReveal({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "-40px" }}
      variants={shouldReduceMotion ? reducedMotionVariants : motionVariants[variant]}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
