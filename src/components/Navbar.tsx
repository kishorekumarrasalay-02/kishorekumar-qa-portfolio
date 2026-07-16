"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
  const { navLinks } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.replace(/^\/?#/, "").split("#").pop() ?? "")
      .filter((id) => id && !id.includes("/"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    const id = href.includes("#")
      ? (href.split("#")[1] ?? "")
      : href.replace(/^\//, "");
    if (id) setActiveSection(id);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("qa-chat-close"));
  };

  const linkClass = (isActive: boolean) =>
    `nav-menu-link block rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all duration-200 sm:text-base ${
      isActive
        ? "bg-primary/15 text-primary-light shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        : "text-muted hover:bg-white/[0.06] hover:text-foreground"
    }`;

  return (
    <header className="glass-nav fixed top-0 right-0 left-0 z-50 w-full border-b border-card-border/60">
      <nav className="flex w-full items-center justify-end gap-2 px-3 py-2.5 sm:gap-2.5 sm:px-4 sm:py-3 md:px-5 lg:px-6">
        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`nav-hamburger flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-card-border bg-card text-foreground transition-colors active:scale-95 hover:border-primary/50 hover:text-primary-light sm:h-11 sm:w-11 ${
              menuOpen ? "nav-hamburger-open border-primary/50 bg-primary/10 text-primary-light" : ""
            }`}
          >
            <span className="nav-hamburger-lines" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="nav-menu-backdrop fixed inset-0 top-[57px] z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="site-nav-menu"
            className="nav-menu-panel absolute top-full right-0 left-0 z-50 border-b border-card-border/60 bg-[color-mix(in_srgb,var(--background)_92%,transparent)] px-4 py-4 shadow-2xl backdrop-blur-xl sm:px-6 lg:px-8"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {navLinks.map((link) => {
                const id = link.href.includes("#")
                  ? (link.href.split("#")[1] ?? "")
                  : link.href.replace(/^\//, "");
                const isActive = activeSection === id;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={linkClass(isActive)}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
