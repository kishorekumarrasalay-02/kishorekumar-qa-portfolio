import Header from "@/components/dashboard/Header";

export default function SettingsPage() {
  return (
    <>
      <Header
        title="Settings"
        subtitle="Analytics configuration and environment"
      />
      <div className="dash-glass space-y-4 p-6 text-sm">
        <div>
          <p className="font-medium">Database</p>
          <p className="mt-1 text-[#94a3b8]">
            Supabase — configure via environment variables
          </p>
        </div>
        <div>
          <p className="font-medium">Authentication</p>
          <p className="mt-1 text-[#94a3b8]">
            NextAuth credentials — admin only access
          </p>
        </div>
        <div>
          <p className="font-medium">Privacy</p>
          <p className="mt-1 text-[#94a3b8]">
            IP addresses are hashed. No raw PII stored.
          </p>
        </div>
        <div>
          <p className="font-medium">Rate Limiting</p>
          <p className="mt-1 text-[#94a3b8]">
            120 requests per minute per IP hash on analytics APIs
          </p>
        </div>
      </div>
    </>
  );
}
