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

  return (
    <header className="fixed top-0 z-50 w-full border-b border-card-border/60 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-4 lg:px-8">
        <div className="flex w-full items-center justify-between md:w-auto">
          <a
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="font-serif text-lg font-bold text-primary md:text-2xl"
          >
            {site.logo}
          </a>
          <ThemeToggle />
        </div>

        <ul className="grid w-full grid-cols-3 gap-x-1 gap-y-0.5 md:flex md:w-auto md:items-center md:justify-end md:gap-5 lg:gap-7">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            const mobileLabel =
              "mobileLabel" in link ? link.mobileLabel : link.label;

            return (
              <li key={link.href} className="flex justify-center md:block">
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative block px-1 py-1.5 text-center text-[11px] leading-tight font-medium tracking-wide transition-colors md:whitespace-nowrap md:px-0 md:py-2 md:text-sm ${
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="md:hidden">{mobileLabel}</span>
                  <span className="hidden md:inline">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 bg-primary md:left-0 md:w-full md:translate-x-0" />
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
