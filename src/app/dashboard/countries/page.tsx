"use client";

import Header from "@/components/dashboard/Header";
import CountryMap from "@/components/dashboard/CountryMap";
import { PieDistributionChart } from "@/components/dashboard/Charts";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function CountriesPage() {
  const { data, loading } = useDashboardData();

  return (
    <>
      <Header title="Countries" subtitle="Geographic distribution of visitors" />
      {loading || !data ? (
        <div className="dash-skeleton h-80" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Country Map</h3>
            <CountryMap data={data.countryDistribution} />
          </div>
          <div className="dash-glass p-5">
            <h3 className="mb-4 text-sm font-semibold">Distribution Chart</h3>
            <PieDistributionChart data={data.countryDistribution} />
          </div>
        </div>
      )}
    </>
  );
}
