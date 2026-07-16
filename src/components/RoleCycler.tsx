"use client";

import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export default function RoleCycler() {
  const roles = portfolioData.hero.roleCycle;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reduce || roles.length <= 1) return;

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setVisible(true);
      }, 320);
    }, 2800);

    return () => clearInterval(id);
  }, [reduce, roles.length]);

  return (
    <p
      className={`text-subtitle text-base text-primary sm:text-xl md:text-2xl transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-live="polite"
    >
      {roles[index]}
    </p>
  );
}
