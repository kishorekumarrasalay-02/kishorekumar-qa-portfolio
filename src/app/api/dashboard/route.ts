import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDashboardData } from "@/lib/analytics/queries";
import { jsonError, jsonOk } from "@/lib/analytics/api-helpers";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return jsonError("Unauthorized", 401);

  if (!isSupabaseConfigured()) {
    return jsonError("Supabase not configured", 503);
  }

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const data = await getDashboardData(from, to);
    return jsonOk({ data });
  } catch {
    return jsonError("Failed to fetch dashboard data", 500);
  }
}
