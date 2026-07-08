"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

type AnalyticsContextValue = ReturnType<typeof useAnalytics>;

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const analytics = useAnalytics();
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalyticsContext must be used within AnalyticsProvider");
  }
  return ctx;
}
