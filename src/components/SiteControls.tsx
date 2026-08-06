"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

const MENU_LINKS = [
  { label: "Experience", href: "/#experience" },
  { label: "Certifications", href: "/#certifications" },
  { label: "Contact", href: "/#contact" },
  { label: "Projects", href: "/#portfolio" },
  { label: "About", href: "/#about" },
  { label: "Home", href: "/#home" },
] as const;

export default function SiteControls() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("qa-chat-close"));

    if (!href.startsWith("/#")) return;

    const id = href.slice(2);
    const onHome = pathname === "/";

    if (onHome) {
      event.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <div
      ref={panelRef}
      className="pointer-events-none fixed top-0 right-0 z-[60] p-3 sm:p-4"
    >
      <div className="pointer-events-auto relative flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          disabled={!mounted}
          aria-label={
            !mounted
              ? "Toggle theme"
              : isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
          }
          className="flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary active:scale-95 disabled:opacity-70 sm:h-12 sm:w-12"
        >
          {!mounted ? (
            <Sun size={18} className="opacity-40" />
          ) : isDark ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-quick-menu"
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary active:scale-95 sm:h-12 sm:w-12 ${
            menuOpen ? "border-primary/50 bg-primary/10 text-primary" : ""
          }`}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {menuOpen && (
          <nav
            id="site-quick-menu"
            className="absolute top-[calc(100%+0.5rem)] right-0 w-[min(16.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl"
          >
            <ul className="flex flex-col p-1.5">
              {MENU_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleNav(event, link.href)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
