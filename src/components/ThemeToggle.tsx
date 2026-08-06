"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card/80 text-muted backdrop-blur-sm sm:h-11 sm:w-11"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-card-border bg-card/80 text-muted shadow-sm backdrop-blur-sm transition-colors hover:border-primary hover:text-primary sm:h-11 sm:w-11"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
