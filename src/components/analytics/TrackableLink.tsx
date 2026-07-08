"use client";

import type { ComponentProps } from "react";
import type { ClickButtonName } from "@/lib/analytics/types";
import { useAnalyticsContext } from "./AnalyticsProvider";

interface TrackableLinkProps extends ComponentProps<"a"> {
  trackAs: ClickButtonName | string;
}

export default function TrackableLink({
  trackAs,
  onClick,
  children,
  ...props
}: TrackableLinkProps) {
  const { trackClick } = useAnalyticsContext();

  return (
    <a
      {...props}
      onClick={(e) => {
        trackClick(trackAs);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
