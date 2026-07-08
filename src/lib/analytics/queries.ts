import {
  format,
  subDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import type {
  ActivityItem,
  ChartPoint,
  DashboardData,
  DashboardMetrics,
} from "./types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function countBy<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T
): ChartPoint[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const val = String(row[key] ?? "Unknown");
    map.set(val, (map.get(val) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

function timeSeries(
  rows: { created_at?: string; first_seen_at?: string; viewed_at?: string }[],
  dateKey: "created_at" | "first_seen_at" | "viewed_at",
  interval: "day" | "week" | "month",
  rangeDays: number
): ChartPoint[] {
  const now = new Date();
  const start =
    interval === "month"
      ? startOfMonth(subMonths(now, rangeDays))
      : startOfDay(subDays(now, rangeDays));

  const intervals =
    interval === "day"
      ? eachDayOfInterval({ start, end: now })
      : interval === "week"
        ? eachWeekOfInterval({ start, end: now })
        : eachMonthOfInterval({ start, end: now });

  const fmt =
    interval === "day"
      ? "MMM d"
      : interval === "week"
        ? "MMM d"
        : "MMM yyyy";

  const counts = new Map<string, number>();
  for (const d of intervals) {
    counts.set(format(d, fmt), 0);
  }

  for (const row of rows) {
    const raw = row[dateKey];
    if (!raw) continue;
    const d = new Date(raw);
    const label = format(
      interval === "week" ? startOfWeek(d) : interval === "month" ? startOfMonth(d) : startOfDay(d),
      fmt
    );
    if (counts.has(label)) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts.entries()].map(([label, value]) => ({ label, value }));
}

export async function getDashboardData(
  from?: string,
  to?: string
): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();
  const fromDate = from ? new Date(from) : subDays(new Date(), 30);
  const toDate = to ? new Date(to) : new Date();
  const fromIso = fromDate.toISOString();
  const toIso = toDate.toISOString();

  const todayStart = startOfDay(new Date()).toISOString();
  const weekStart = startOfWeek(new Date()).toISOString();
  const monthStart = startOfMonth(new Date()).toISOString();

  const [
    visitorsRes,
    sessionsRes,
    clicksRes,
    downloadsRes,
    eventsRes,
    pageViewsRes,
  ] = await Promise.all([
    supabase.from("visitors").select("*").gte("first_seen_at", fromIso).lte("first_seen_at", toIso),
    supabase.from("sessions").select("*").gte("started_at", fromIso).lte("started_at", toIso),
    supabase.from("click_events").select("*").gte("created_at", fromIso).lte("created_at", toIso),
    supabase.from("downloads").select("*").gte("created_at", fromIso).lte("created_at", toIso),
    supabase.from("events").select("*").gte("created_at", fromIso).lte("created_at", toIso),
    supabase.from("page_views").select("*").gte("viewed_at", fromIso).lte("viewed_at", toIso),
  ]);

  const visitors = visitorsRes.data ?? [];
  const sessions = sessionsRes.data ?? [];
  const clicks = clicksRes.data ?? [];
  const downloads = downloadsRes.data ?? [];
  const events = eventsRes.data ?? [];
  const pageViews = pageViewsRes.data ?? [];

  const allVisitorsRes = await supabase.from("visitors").select("id, is_returning, first_seen_at, last_seen_at");
  const allVisitors = allVisitorsRes.data ?? [];

  const metrics: DashboardMetrics = {
    totalVisitors: allVisitors.length,
    todayVisitors: allVisitors.filter((v) => v.first_seen_at >= todayStart || v.last_seen_at >= todayStart).length,
    weeklyVisitors: allVisitors.filter((v) => v.first_seen_at >= weekStart || v.last_seen_at >= weekStart).length,
    monthlyVisitors: allVisitors.filter((v) => v.first_seen_at >= monthStart || v.last_seen_at >= monthStart).length,
    uniqueUsers: allVisitors.length,
    returningUsers: allVisitors.filter((v) => v.is_returning).length,
    newUsers: allVisitors.filter((v) => !v.is_returning).length,
    totalDownloads: downloads.length,
    resumeDownloads: downloads.filter((d) => d.file_name.toLowerCase().includes("cv")).length,
    githubClicks: clicks.filter((c) => c.button_name === "github").length,
    linkedinClicks: clicks.filter((c) => c.button_name === "linkedin").length,
    emailClicks: clicks.filter((c) => c.button_name === "email").length,
    phoneClicks: clicks.filter((c) => c.button_name === "phone").length,
    contactButtonClicks: clicks.filter((c) => c.button_name === "contact_button" || c.button_name === "copy_email").length,
    bounceRate:
      sessions.length > 0
        ? Math.round((sessions.filter((s) => s.bounce).length / sessions.length) * 100)
        : 0,
    avgScrollDepth:
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.max_scroll_depth ?? 0), 0) / sessions.length
          )
        : 0,
    avgSessionDuration:
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0) / sessions.length
          )
        : 0,
  };

  const scrollEvents = events.filter((e) => e.event_type === "scroll_depth");
  const scrollBuckets = [25, 50, 75, 100].map((depth) => ({
    label: `${depth}%`,
    value: scrollEvents.filter((e) => (e.metadata as { depth?: number })?.depth === depth).length,
  }));

  const recentActivity: ActivityItem[] = [];

  for (const v of visitors.slice(-20).reverse()) {
    recentActivity.push({
      id: `visit-${v.id}`,
      type: "visit",
      message: `Visitor from ${v.country ?? "Unknown"}`,
      detail: `Opened portfolio`,
      country: v.country ?? "Unknown",
      browser: v.browser ?? "Unknown",
      device: v.device ?? "Unknown",
      createdAt: v.last_seen_at ?? v.first_seen_at,
    });
  }

  for (const c of clicks.slice(-15).reverse()) {
    recentActivity.push({
      id: `click-${c.id}`,
      type: "click",
      message: `Clicked ${c.button_name.replace(/_/g, " ")}`,
      detail: c.page ?? "/",
      country: c.country ?? "Unknown",
      browser: c.browser ?? "Unknown",
      device: c.device ?? "Unknown",
      createdAt: c.created_at,
    });
  }

  for (const d of downloads.slice(-10).reverse()) {
    recentActivity.push({
      id: `dl-${d.id}`,
      type: "download",
      message: `Downloaded ${d.file_name}`,
      detail: d.browser ?? "Unknown",
      country: d.country ?? "Unknown",
      browser: d.browser ?? "Unknown",
      device: d.device ?? "Unknown",
      createdAt: d.created_at,
    });
  }

  recentActivity.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    metrics,
    dailyVisitors: timeSeries(visitors, "first_seen_at", "day", 14),
    weeklyVisitors: timeSeries(visitors, "first_seen_at", "week", 56),
    monthlyVisitors: timeSeries(visitors, "first_seen_at", "month", 180),
    countryDistribution: countBy(visitors, "country"),
    browserDistribution: countBy(visitors, "browser"),
    deviceDistribution: countBy(visitors, "device"),
    osDistribution: countBy(visitors, "os"),
    topButtons: countBy(clicks, "button_name"),
    trafficSources: countBy(
      visitors.map((v) => {
        let source = "Direct";
        if (v.referrer && v.referrer !== "Direct") {
          try {
            source = new URL(v.referrer).hostname;
          } catch {
            source = v.referrer;
          }
        }
        return { source };
      }),
      "source"
    ),
    scrollDepth: scrollBuckets,
    recentActivity: recentActivity.slice(0, 25),
  };
}
