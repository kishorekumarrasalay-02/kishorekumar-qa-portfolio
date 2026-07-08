"use client";

import Header from "@/components/dashboard/Header";
import { LineVisitorsChart } from "@/components/dashboard/Charts";
import CountryMap from "@/components/dashboard/CountryMap";
import RecentVisitors from "@/components/dashboard/RecentVisitors";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function VisitorsPage() {
  const { data, loading } = useDashboardData();

  return (
    <>
      <Header title="Visitors" subtitle="Unique, returning, and new visitor trends" />
      {loading || !data ? (
        <div className="dash-skeleton h-80" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="dash-glass p-5 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold">Visitor Trends</h3>
            <LineVisitorsChart data={data.dailyVisitors} height={320} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">By Country</h3>
            <CountryMap data={data.countryDistribution} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Recent Visitors</h3>
            <RecentVisitors
              items={data.recentActivity.filter((a) => a.type === "visit")}
            />
          </div>
        </div>
      )}
    </>
  );
}
