import type { Metadata } from "next";
import AuthSessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <div className="dashboard-shell">
        <div className="mx-auto flex max-w-[1600px] gap-6 p-4 sm:p-6 lg:p-8">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
