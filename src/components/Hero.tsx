"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import SocialIcons from "./SocialIcons";
import TypewriterStatus from "./TypewriterStatus";
import RoleCycler from "./RoleCycler";
import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { site, hero } = portfolioData;
  const reduce = useReducedMotion();

  const enter = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 28 };

  const visible = { opacity: 1, y: 0 };
  const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="home"
      className="hero-section relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 text-center sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="hero-conic-bg pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <motion.div
        className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-card-border shadow-sm sm:mb-8 sm:h-36 sm:w-36 md:h-44 md:w-44"
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: 0 }}
      >
        <Image
          src={site.profileImage}
          alt={`${site.name} — Quality Analyst profile photo`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 144px, 176px"
        />
      </motion.div>

      <motion.h1
        className="font-heading text-2xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
      >
        {site.name}
      </motion.h1>

      <motion.div
        className="mt-2 sm:mt-3"
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: reduce ? 0 : 0.16 }}
      >
        <RoleCycler />
      </motion.div>

      <motion.div
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: reduce ? 0 : 0.24 }}
      >
        <TypewriterStatus />
      </motion.div>

      <motion.p
        className="text-body mt-6 max-w-2xl px-2 text-sm text-muted sm:mt-8 sm:text-base md:text-lg"
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: reduce ? 0 : 0.32 }}
      >
        {hero.bio}
      </motion.p>

      <motion.div
        className="mt-8 sm:mt-10"
        initial={enter}
        animate={visible}
        transition={{ ...transition, delay: reduce ? 0 : 0.4 }}
      >
        <SocialIcons />
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-muted transition hover:text-primary-light"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown
          size={22}
          className={reduce ? "" : "hero-scroll-chevron"}
          aria-hidden
        />
      </a>
    </section>
  );
}
