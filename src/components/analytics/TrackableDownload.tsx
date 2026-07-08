"use client";

import { Download } from "lucide-react";
import { useAnalyticsContext } from "@/components/analytics/AnalyticsProvider";

interface TrackableDownloadProps {
  href: string;
  label: string;
  variant?: "primary" | "outline";
}

export default function TrackableDownload({
  href,
  label,
  variant = "primary",
}: TrackableDownloadProps) {
  const { trackDownload } = useAnalyticsContext();
  const fileName = href.split("/").pop() ?? label;

  return (
    <a
      href={href}
      download
      onClick={() => trackDownload(fileName)}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 sm:w-auto ${
        variant === "primary"
          ? "bg-primary text-white"
          : "border border-primary text-primary hover:bg-primary/10"
      }`}
    >
      <Download size={16} />
      {label}
    </a>
  );
}
