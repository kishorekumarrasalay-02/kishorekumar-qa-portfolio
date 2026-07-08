"use client";

import Header from "@/components/dashboard/Header";
import { PieDistributionChart } from "@/components/dashboard/Charts";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DevicesPage() {
  const { data, loading } = useDashboardData();

  return (
    <>
      <Header title="Devices" subtitle="Browser, device, and OS breakdown" />
      {loading || !data ? (
        <div className="dash-skeleton h-80" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Browsers</h3>
            <PieDistributionChart data={data.browserDistribution} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Devices</h3>
            <PieDistributionChart data={data.deviceDistribution} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Operating Systems</h3>
            <PieDistributionChart data={data.osDistribution} />
          </div>
        </div>
      )}
    </>
  );
}
