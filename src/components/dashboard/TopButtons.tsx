"use client";

import type { ChartPoint } from "@/lib/analytics/types";

interface TopButtonsProps {
  data: ChartPoint[];
}

export default function TopButtons({ data }: TopButtonsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-xs text-[#94a3b8] uppercase">
            <th className="pb-3 font-medium">Button</th>
            <th className="pb-3 text-right font-medium">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={2} className="py-6 text-center text-[#94a3b8]">
                No clicks tracked yet
              </td>
            </tr>
          )}
          {data.map((item) => (
            <tr
              key={item.label}
              className="border-b border-white/[0.03] transition hover:bg-white/[0.02]"
            >
              <td className="py-3 capitalize">
                {item.label.replace(/_/g, " ")}
              </td>
              <td className="py-3 text-right font-semibold tabular-nums text-[#38bdf8]">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
