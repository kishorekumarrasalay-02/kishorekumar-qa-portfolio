import { NextRequest } from "next/server";
import { getClientIp, getGeoFromHeaders } from "@/lib/analytics/geo";
import { hashIp, hashVisitorKey } from "@/lib/analytics/hash";
import { rateLimit } from "@/lib/analytics/rate-limit";
import { parseUserAgent } from "@/lib/analytics/user-agent";
import type { VisitorPayload } from "@/lib/analytics/types";
import { getRequestMeta, jsonError, jsonOk } from "@/lib/analytics/api-helpers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonOk({ visitorId: null, sessionId: null, skipped: true });
  }

  try {
    const { headers: h, userAgent, referrer } = await getRequestMeta();
    const ip = getClientIp(h);
    const ipHash = hashIp(ip);
    const limit = rateLimit(`visit:${ipHash}`);
    if (!limit.allowed) return jsonError("Rate limit exceeded", 429);

    const body = (await request.json()) as VisitorPayload;
    if (!body.visitorKey || !body.sessionKey) {
      return jsonError("Missing visitor or session key");
    }

    const { browser, device, os } = parseUserAgent(userAgent);
    const { country, city } = await getGeoFromHeaders();
    const visitorKey = hashVisitorKey(ipHash, userAgent);

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("visitors")
      .select("id, visit_count")
      .eq("visitor_key", visitorKey)
      .maybeSingle();

    let visitorId: string;
    const isReturning = Boolean(existing);

    if (existing) {
      visitorId = existing.id;
      await supabase
        .from("visitors")
        .update({
          last_seen_at: new Date().toISOString(),
          visit_count: (existing.visit_count ?? 0) + 1,
          is_returning: true,
          browser,
          device,
          os,
          screen_resolution: body.screenResolution,
          timezone: body.timezone,
          language: body.language,
          country,
          city,
        })
        .eq("id", visitorId);
    } else {
      const { data: created, error } = await supabase
        .from("visitors")
        .insert({
          visitor_key: visitorKey,
          ip_hash: ipHash,
          browser,
          device,
          os,
          screen_resolution: body.screenResolution,
          timezone: body.timezone,
          language: body.language,
          country,
          city,
          referrer: body.referrer || referrer || "Direct",
          is_returning: false,
        })
        .select("id")
        .single();

      if (error || !created) return jsonError("Failed to create visitor", 500);
      visitorId = created.id;
    }

    const { data: session } = await supabase
      .from("sessions")
      .select("id")
      .eq("session_key", body.sessionKey)
      .maybeSingle();

    let sessionId = session?.id;
    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          session_key: body.sessionKey,
          visitor_id: visitorId,
          entry_page: "/",
        })
        .select("id")
        .single();

      if (sessionError || !newSession) {
        return jsonError("Failed to create session", 500);
      }
      sessionId = newSession.id;
    }

    await supabase.from("page_views").insert({
      session_id: sessionId,
      visitor_id: visitorId,
      page: "/",
      section: "home",
    });

    return jsonOk({
      visitorId,
      sessionId,
      visitorKey,
      isReturning,
    });
  } catch {
    return jsonError("Internal server error", 500);
  }
}
