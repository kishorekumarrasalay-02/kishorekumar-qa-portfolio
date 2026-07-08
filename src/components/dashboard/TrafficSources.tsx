"use client";

import type { ChartPoint } from "@/lib/analytics/types";

interface TrafficSourcesProps {
  data: ChartPoint[];
}

export default function TrafficSources({ data }: TrafficSourcesProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.label}</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-[#3b82f6]"
                style={{ width: `${(item.value / total) * 100}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-sm tabular-nums text-[#94a3b8]">
            {Math.round((item.value / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}
