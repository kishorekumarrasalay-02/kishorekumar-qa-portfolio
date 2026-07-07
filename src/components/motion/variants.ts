import type { Variants } from "framer-motion";

export type MotionVariant = "fadeUp" | "scale" | "rotate" | "slide" | "slideRight";

export const motionVariants: Record<MotionVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -8, y: 24 },
    visible: { opacity: 1, rotate: 0, y: 0 },
  },
  slide: {
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0 },
  },
};

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export const defaultTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};
