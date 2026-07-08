"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Download,
  Globe,
  LayoutDashboard,
  Monitor,
  MousePointerClick,
  Settings,
  Users,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/visitors", label: "Visitors", icon: Users },
  { href: "/dashboard/events", label: "Events", icon: MousePointerClick },
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
  { href: "/dashboard/countries", label: "Countries", icon: Globe },
  { href: "/dashboard/devices", label: "Devices", icon: Monitor },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dash-glass hidden h-fit w-56 shrink-0 p-4 lg:block">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold tracking-widest text-[#38bdf8] uppercase">
          Analytics
        </p>
        <p className="mt-1 text-lg font-bold">Portfolio</p>
      </div>
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`dash-sidebar-link ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-white/5 bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <BarChart3 size={14} className="text-[#3b82f6]" />
          Enterprise Analytics
        </div>
      </div>
    </aside>
  );
}
