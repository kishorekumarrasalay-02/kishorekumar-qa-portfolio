import Header from "@/components/dashboard/Header";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Portfolio analytics overview — visitors, clicks, and engagement"
      />
      <DashboardOverview />
    </>
  );
}