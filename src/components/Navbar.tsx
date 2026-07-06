"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
  const { navLinks, site } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

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

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    setActiveSection(id);
  };

  const linkClass = (isActive: boolean) =>
    `relative block px-1 py-1.5 text-center text-[11px] leading-tight font-medium tracking-wide transition-colors md:whitespace-nowrap md:px-0 md:py-2 md:text-sm ${
      isActive ? "text-foreground" : "text-muted hover:text-foreground"
    }`;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-card-border/60 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 py-2.5 md:px-6 md:py-4 lg:px-8">
        {/* Mobile: logo + toggle */}
        <div className="flex items-center justify-between md:hidden">
          <a
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="font-serif text-lg font-bold text-primary"
          >
            {site.logo}
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: nav links */}
        <ul className="mt-2 grid grid-cols-3 gap-x-1 gap-y-0.5 md:hidden">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            const mobileLabel =
              "mobileLabel" in link ? link.mobileLabel : link.label;

            return (
              <li key={link.href} className="flex justify-center">
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={linkClass(isActive)}
                >
                  {mobileLabel}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 bg-primary" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop: logo | links | toggle */}
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="shrink-0 font-serif text-2xl font-bold text-primary"
          >
            {site.logo}
          </a>

          <ul className="flex flex-1 items-center justify-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={linkClass(isActive)}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
