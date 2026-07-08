"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Globe,
  Link2,
  Mail,
  MousePointerClick,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import {
  BarVisitorsChart,
  LineVisitorsChart,
  PieDistributionChart,
} from "@/components/dashboard/Charts";
import CountryMap from "@/components/dashboard/CountryMap";
import RecentVisitors from "@/components/dashboard/RecentVisitors";
import TopButtons from "@/components/dashboard/TopButtons";
import TrafficSources from "@/components/dashboard/TrafficSources";
import { useDashboardData } from "@/hooks/useDashboardData";

function Skeleton({ className }: { className?: string }) {
  return <div className={`dash-skeleton ${className ?? ""}`} />;
}

export default function DashboardOverview() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data, loading, error } = useDashboardData(from || undefined, to || undefined);

  if (error) {
    return (
      <div className="dash-glass p-8 text-center text-sm text-red-400">
        {error}. Check Supabase env variables.
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DateRangeFilter
          from={from}
          to={to}
          onChange={(f, t) => {
            setFrom(f);
            setTo(t);
          }}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard title="Total Visitors" value={metrics.totalVisitors} icon={Users} />
        <AnalyticsCard title="Today's Visitors" value={metrics.todayVisitors} icon={TrendingUp} />
        <AnalyticsCard title="Weekly Visitors" value={metrics.weeklyVisitors} icon={BarChart3} />
        <AnalyticsCard title="Monthly Visitors" value={metrics.monthlyVisitors} icon={Users} />
        <AnalyticsCard title="Unique Users" value={metrics.uniqueUsers} icon={Users} />
        <AnalyticsCard title="Returning Users" value={metrics.returningUsers} icon={Users} />
        <AnalyticsCard title="New Users" value={metrics.newUsers} icon={Users} />
        <AnalyticsCard title="Bounce Rate" value={metrics.bounceRate} icon={TrendingUp} suffix="%" />
        <AnalyticsCard title="Resume Downloads" value={metrics.resumeDownloads} icon={Download} />
        <AnalyticsCard title="GitHub Clicks" value={metrics.githubClicks} icon={Link2} />
        <AnalyticsCard title="LinkedIn Clicks" value={metrics.linkedinClicks} icon={Globe} />
        <AnalyticsCard title="Email Clicks" value={metrics.emailClicks} icon={Mail} />
        <AnalyticsCard title="Phone Clicks" value={metrics.phoneClicks} icon={Phone} />
        <AnalyticsCard
          title="Contact Clicks"
          value={metrics.contactButtonClicks}
          icon={MousePointerClick}
        />
        <AnalyticsCard
          title="Avg Scroll"
          value={metrics.avgScrollDepth}
          icon={BarChart3}
          suffix="%"
        />
        <AnalyticsCard
          title="Avg Session"
          value={metrics.avgSessionDuration}
          icon={TrendingUp}
          suffix="s"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Daily Visitors</h3>
          <LineVisitorsChart data={data.dailyVisitors} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Weekly Visitors</h3>
          <BarVisitorsChart data={data.weeklyVisitors} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Monthly Visitors</h3>
          <LineVisitorsChart data={data.monthlyVisitors} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Scroll Depth Heatmap</h3>
          <BarVisitorsChart data={data.scrollDepth} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Country Distribution</h3>
          <CountryMap data={data.countryDistribution} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Browser Distribution</h3>
          <PieDistributionChart data={data.browserDistribution} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Device Distribution</h3>
          <PieDistributionChart data={data.deviceDistribution} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">OS Distribution</h3>
          <PieDistributionChart data={data.osDistribution} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Most Clicked Buttons</h3>
          <TopButtons data={data.topButtons} />
        </div>
        <div className="dash-glass p-5">
          <h3 className="mb-4 text-sm font-semibold">Traffic Sources</h3>
          <TrafficSources data={data.trafficSources} />
        </div>
      </div>

      <div className="dash-glass p-5">
        <h3 className="mb-4 text-sm font-semibold">Real-time Activity Feed</h3>
        <RecentVisitors items={data.recentActivity} />
      </div>
    </div>
  );
}
