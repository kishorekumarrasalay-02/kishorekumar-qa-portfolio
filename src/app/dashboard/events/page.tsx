"use client";

import Header from "@/components/dashboard/Header";
import TopButtons from "@/components/dashboard/TopButtons";
import RecentVisitors from "@/components/dashboard/RecentVisitors";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function EventsPage() {
  const { data, loading } = useDashboardData();

  return (
    <>
      <Header title="Events" subtitle="Clicks, section views, and user interactions" />
      {loading || !data ? (
        <div className="dash-skeleton h-80" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Top Clicked Buttons</h3>
            <TopButtons data={data.topButtons} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Recent Events</h3>
            <RecentVisitors
              items={data.recentActivity.filter((a) => a.type !== "visit")}
            />
          </div>
        </div>
      )}
    </>
  );
}
