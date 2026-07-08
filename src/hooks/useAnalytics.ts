"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ClickButtonName, SectionName } from "@/lib/analytics/types";
import {
  getAnalyticsIds,
  getClientContext,
  getSessionDuration,
  setVisitorKey,
} from "@/lib/analytics/client";

type QueuedEvent =
  | { type: "event"; payload: Record<string, unknown> }
  | { type: "section"; payload: Record<string, unknown> }
  | { type: "click"; payload: Record<string, unknown> }
  | { type: "download"; payload: Record<string, unknown> };

const FLUSH_MS = 2000;

async function postJson(url: string, body: unknown) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Silent fail — analytics should never break UX
  }
}

export function useAnalytics() {
  const queueRef = useRef<QueuedEvent[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  const flush = useCallback(async () => {
    const batch = [...queueRef.current];
    queueRef.current = [];
    if (batch.length === 0) return;

    for (const item of batch) {
      if (item.type === "click") await postJson("/api/contact", item.payload);
      else if (item.type === "download") await postJson("/api/download", item.payload);
      else await postJson("/api/event", item.payload);
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(() => {
      void flush();
    }, FLUSH_MS);
  }, [flush]);

  const enqueue = useCallback(
    (event: QueuedEvent) => {
      queueRef.current.push(event);
      scheduleFlush();
    },
    [scheduleFlush]
  );

  const trackPage = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const { sessionKey } = getAnalyticsIds();
    const ctx = getClientContext();

    const res = await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorKey: "pending", sessionKey, ...ctx }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.visitorKey) setVisitorKey(data.visitorKey);
    }
  }, []);

  const trackClick = useCallback(
    (buttonName: ClickButtonName | string, page = "/") => {
      const { visitorKey, sessionKey } = getAnalyticsIds();
      if (!visitorKey) return;
      enqueue({
        type: "click",
        payload: { visitorKey, sessionKey, buttonName, page },
      });
    },
    [enqueue]
  );

  const trackDownload = useCallback(
    (fileName: string) => {
      const { visitorKey, sessionKey } = getAnalyticsIds();
      if (!visitorKey) return;
      enqueue({
        type: "download",
        payload: { visitorKey, sessionKey, fileName },
      });
    },
    [enqueue]
  );

  const trackContact = useCallback(
    (buttonName: ClickButtonName) => {
      trackClick(buttonName);
    },
    [trackClick]
  );

  const trackSection = useCallback(
    (section: SectionName, timeSpentSeconds?: number, scrollDepth?: number) => {
      const { visitorKey, sessionKey } = getAnalyticsIds();
      if (!visitorKey) return;
      enqueue({
        type: "section",
        payload: { visitorKey, sessionKey, section, timeSpentSeconds, scrollDepth },
      });
    },
    [enqueue]
  );

  const trackEvent = useCallback(
    (eventType: string, eventName: string, metadata?: Record<string, unknown>) => {
      const { visitorKey, sessionKey } = getAnalyticsIds();
      if (!visitorKey) return;
      enqueue({
        type: "event",
        payload: {
          visitorKey,
          sessionKey,
          eventType,
          eventName,
          page: "/",
          metadata,
        },
      });
    },
    [enqueue]
  );

  useEffect(() => {
    void trackPage();

    const onUnload = () => {
      const duration = getSessionDuration();
      trackEvent("session_end", "session_ended", { duration });
      void flush();
    };

    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      void flush();
    };
  }, [trackPage, trackEvent, flush]);

  return {
    trackPage,
    trackClick,
    trackDownload,
    trackContact,
    trackSection,
    trackEvent,
  };
}
