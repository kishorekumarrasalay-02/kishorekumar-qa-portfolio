"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function Header({ title, subtitle, children }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="dash-glass flex h-10 w-10 items-center justify-center lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[#94a3b8]">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <button
          type="button"
          className="dash-glass flex h-10 w-10 items-center justify-center text-[#94a3b8] transition hover:text-[#f8fafc]"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="dash-glass inline-flex items-center gap-2 px-4 py-2 text-sm text-[#94a3b8] transition hover:text-[#f8fafc]"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
      {mobileOpen && (
        <nav className="dash-glass flex flex-wrap gap-2 p-3 lg:hidden">
          {[
            "/dashboard",
            "/dashboard/visitors",
            "/dashboard/events",
            "/dashboard/downloads",
            "/dashboard/countries",
            "/dashboard/devices",
            "/dashboard/settings",
          ].map((href) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-[#94a3b8] hover:bg-white/5"
            >
              {href.split("/").pop()}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
