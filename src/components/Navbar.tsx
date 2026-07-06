"use client";

import { useEffect, useState } from "react";
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

  return (
    <header className="fixed top-0 z-50 w-full border-b border-card-border/60 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <a
          href="#home"
          onClick={() => handleNavClick("#home")}
          className="shrink-0 font-serif text-xl font-bold text-primary sm:text-2xl"
        >
          {site.logo}
        </a>

        <ul className="scrollbar-hide flex flex-1 items-center justify-end gap-3 overflow-x-auto sm:gap-5 lg:gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative block whitespace-nowrap px-1 py-2 text-xs tracking-wide text-muted transition-colors hover:text-foreground sm:text-sm ${
                    isActive ? "text-foreground" : ""
                  }`}
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
      </nav>
    </header>
  );
}
