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
    <header className="fixed top-0 z-50 w-full border-b border-card-border/60 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 sm:py-5 md:px-8">
        <a
          href="#home"
          onClick={() => handleNavClick("#home")}
          className="font-serif text-2xl font-bold text-primary"
        >
          {site.logo}
        </a>

        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 md:gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative text-xs tracking-wide text-muted transition-colors hover:text-foreground sm:text-sm ${
                    isActive ? "text-foreground" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary" />
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
