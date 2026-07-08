import { NextRequest } from "next/server";
import { getClientIp, getGeoFromHeaders } from "@/lib/analytics/geo";
import { hashIp } from "@/lib/analytics/hash";
import { rateLimit } from "@/lib/analytics/rate-limit";
import { parseUserAgent } from "@/lib/analytics/user-agent";
import type { DownloadPayload } from "@/lib/analytics/types";
import { getRequestMeta, jsonError, jsonOk } from "@/lib/analytics/api-helpers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

async function resolveIds(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  visitorKey: string,
  sessionKey: string
) {
  const { data: visitor } = await supabase
    .from("visitors")
    .select("id")
    .eq("visitor_key", visitorKey)
    .maybeSingle();
  const { data: session } = await supabase
    .from("sessions")
    .select("id")
    .eq("session_key", sessionKey)
    .maybeSingle();
  return { visitorId: visitor?.id, sessionId: session?.id };
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return jsonOk({ skipped: true });

  try {
    const { headers: h, userAgent } = await getRequestMeta();
    const ipHash = hashIp(getClientIp(h));
    const limit = rateLimit(`download:${ipHash}`);
    if (!limit.allowed) return jsonError("Rate limit exceeded", 429);

    const body = (await request.json()) as DownloadPayload;
    if (!body.visitorKey || !body.sessionKey || !body.fileName) {
      return jsonError("Invalid download payload");
    }

    const { browser, device } = parseUserAgent(userAgent);
    const { country } = await getGeoFromHeaders();
    const supabase = getSupabaseAdmin();
    const { visitorId, sessionId } = await resolveIds(
      supabase,
      body.visitorKey,
      body.sessionKey
    );

    if (visitorId && sessionId) {
      await supabase.from("downloads").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        file_name: body.fileName,
        browser,
        device,
        country,
      });

      await supabase.from("click_events").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        button_name: body.fileName.toLowerCase().includes("cv")
          ? "resume_download"
          : "cover_letter_download",
        page: "/",
        browser,
        device,
        country,
      });
    }

    return jsonOk({});
  } catch {
    return jsonError("Internal server error", 500);
  }
}
