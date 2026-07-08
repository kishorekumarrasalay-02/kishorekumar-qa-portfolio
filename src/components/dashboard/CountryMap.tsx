"use client";

import type { ChartPoint } from "@/lib/analytics/types";

interface CountryMapProps {
  data: ChartPoint[];
}

export default function CountryMap({ data }: CountryMapProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.length === 0 && (
        <p className="py-8 text-center text-sm text-[#94a3b8]">No country data yet</p>
      )}
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="tabular-nums text-[#94a3b8]">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#38bdf8] transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
