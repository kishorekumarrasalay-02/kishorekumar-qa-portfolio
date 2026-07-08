"use client";

import Header from "@/components/dashboard/Header";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import RecentVisitors from "@/components/dashboard/RecentVisitors";
import { Download } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DownloadsPage() {
  const { data, loading } = useDashboardData();

  return (
    <>
      <Header title="Downloads" subtitle="Resume and document download analytics" />
      {loading || !data ? (
        <div className="dash-skeleton h-40" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <AnalyticsCard
              title="Total Downloads"
              value={data.metrics.totalDownloads}
              icon={Download}
            />
            <AnalyticsCard
              title="Resume Downloads"
              value={data.metrics.resumeDownloads}
              icon={Download}
            />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Recent Downloads</h3>
            <RecentVisitors
              items={data.recentActivity.filter((a) => a.type === "download")}
            />
          </div>
        </div>
      )}
    </>
  );
}
