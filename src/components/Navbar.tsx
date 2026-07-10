"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
  const { navLinks } = portfolioData;
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
    window.dispatchEvent(new CustomEvent("qa-chat-close"));
  };

  const linkClass = (isActive: boolean) =>
    `relative shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-wide transition-all duration-200 sm:px-3 sm:text-xs md:px-3.5 md:py-2 md:text-sm lg:px-4 ${
      isActive
        ? "bg-primary/15 text-primary-light shadow-[0_0_18px_rgba(59,130,246,0.2)]"
        : "text-muted hover:bg-white/[0.06] hover:text-foreground"
    }`;

  return (
    <header className="glass-nav fixed top-0 z-50 w-full border-b border-card-border/60">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 md:px-6 md:py-3 lg:px-8">
        <ul className="scrollbar-hide flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1 md:gap-2 lg:gap-3">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;

            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={linkClass(isActive)}
                >
                  {"mobileLabel" in link ? (
                    <>
                      <span className="whitespace-nowrap md:hidden">
                        {link.mobileLabel}
                      </span>
                      <span className="hidden whitespace-nowrap md:inline">
                        {link.label}
                      </span>
                    </>
                  ) : (
                    <span className="whitespace-nowrap">{link.label}</span>
                  )}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0.5 hidden h-px bg-gradient-to-r from-transparent via-primary-light to-transparent md:block" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="shrink-0 pl-1 sm:pl-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
