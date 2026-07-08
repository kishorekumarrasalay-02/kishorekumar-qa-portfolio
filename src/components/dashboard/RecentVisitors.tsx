"use client";

import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/lib/analytics/types";
import { Download, Eye, MousePointerClick } from "lucide-react";

interface RecentVisitorsProps {
  items: ActivityItem[];
}

const iconMap = {
  visit: Eye,
  click: MousePointerClick,
  download: Download,
  section: Eye,
};

export default function RecentVisitors({ items }: RecentVisitorsProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="py-8 text-center text-sm text-[#94a3b8]">
          Waiting for real-time activity…
        </p>
      )}
      {items.map((item) => {
        const Icon = iconMap[item.type] ?? Eye;
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-[#3b82f6]/30"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/15 text-[#38bdf8]">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.message}</p>
              <p className="mt-0.5 text-xs text-[#94a3b8]">
                {item.browser} · {item.device} · {item.country}
              </p>
            </div>
            <span className="shrink-0 text-xs text-[#94a3b8]">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
