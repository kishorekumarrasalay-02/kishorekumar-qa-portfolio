"use client";

import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export default function TypewriterStatus() {
  const lines = portfolioData.hero.typewriterLines;
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentLine = lines[lineIndex];
    let charIndex = 0;
    setDisplayed("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      charIndex += 1;
      setDisplayed(currentLine.slice(0, charIndex));

      if (charIndex >= currentLine.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [lineIndex, lines]);

  useEffect(() => {
    if (isTyping) return;

    const pause = setTimeout(() => {
      setLineIndex((prev) => (prev + 1) % lines.length);
    }, 2600);

    return () => clearTimeout(pause);
  }, [isTyping, lineIndex, lines.length]);

  return (
    <div className="mt-5 w-full max-w-md px-2 sm:mt-6">
      <div className="rounded-lg border border-card-border bg-card/80 px-4 py-3 text-left font-mono text-xs text-accent sm:text-sm">
        <span className="text-muted">$ </span>
        <span className="text-foreground">{displayed}</span>
        <span
          className={`ml-0.5 inline-block h-4 w-2 bg-accent align-middle ${
            isTyping ? "opacity-100" : "opacity-60"
          }`}
        />
      </div>
    </div>
  );
}
