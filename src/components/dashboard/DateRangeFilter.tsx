"use client";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export default function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onChange(e.target.value, to)}
        className="dash-glass rounded-lg px-3 py-2 text-xs text-[#f8fafc] outline-none"
      />
      <span className="text-xs text-[#94a3b8]">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange(from, e.target.value)}
        className="dash-glass rounded-lg px-3 py-2 text-xs text-[#f8fafc] outline-none"
      />
    </div>
  );
}
