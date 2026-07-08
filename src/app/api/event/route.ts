import { NextRequest } from "next/server";
import { getClientIp } from "@/lib/analytics/geo";
import { hashIp } from "@/lib/analytics/hash";
import { rateLimit } from "@/lib/analytics/rate-limit";
import type { EventPayload, SectionPayload } from "@/lib/analytics/types";
import { jsonError, jsonOk } from "@/lib/analytics/api-helpers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

async function resolveIds(supabase: ReturnType<typeof getSupabaseAdmin>, visitorKey: string, sessionKey: string) {
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
    const h = request.headers;
    const ipHash = hashIp(getClientIp(h));
    const limit = rateLimit(`event:${ipHash}`);
    if (!limit.allowed) return jsonError("Rate limit exceeded", 429);

    const body = await request.json();
    const supabase = getSupabaseAdmin();

    if ("section" in body) {
      const payload = body as SectionPayload;
      const { visitorId, sessionId } = await resolveIds(
        supabase,
        payload.visitorKey,
        payload.sessionKey
      );

      if (visitorId && sessionId) {
        await supabase.from("page_views").insert({
          session_id: sessionId,
          visitor_id: visitorId,
          page: "/",
          section: payload.section,
          time_spent_seconds: payload.timeSpentSeconds ?? 0,
        });

        await supabase.from("events").insert({
          session_id: sessionId,
          visitor_id: visitorId,
          event_type: "section_view",
          event_name: `${payload.section}_viewed`,
          page: "/",
          metadata: { section: payload.section },
        });

        if (payload.scrollDepth !== undefined) {
          await supabase.from("events").insert({
            session_id: sessionId,
            visitor_id: visitorId,
            event_type: "scroll_depth",
            event_name: `scroll_${payload.scrollDepth}`,
            page: "/",
            metadata: { depth: payload.scrollDepth },
          });

          const { data: session } = await supabase
            .from("sessions")
            .select("max_scroll_depth")
            .eq("id", sessionId)
            .single();

          const current = session?.max_scroll_depth ?? 0;
          if ((payload.scrollDepth ?? 0) > current) {
            await supabase
              .from("sessions")
              .update({
                max_scroll_depth: payload.scrollDepth,
                bounce: payload.scrollDepth < 25,
              })
              .eq("id", sessionId);
          }
        }
      }

      return jsonOk({});
    }

    const payload = body as EventPayload;
    if (!payload.visitorKey || !payload.sessionKey || !payload.eventType) {
      return jsonError("Invalid event payload");
    }

    const { visitorId, sessionId } = await resolveIds(
      supabase,
      payload.visitorKey,
      payload.sessionKey
    );

    if (visitorId && sessionId) {
      await supabase.from("events").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        event_type: payload.eventType,
        event_name: payload.eventName,
        page: payload.page ?? "/",
        metadata: payload.metadata ?? {},
      });

      if (payload.eventType === "session_end" && payload.metadata?.duration) {
        await supabase
          .from("sessions")
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: Number(payload.metadata.duration),
            bounce: Number(payload.metadata.duration) < 10,
          })
          .eq("id", sessionId);
      }
    }

    return jsonOk({});
  } catch {
    return jsonError("Internal server error", 500);
  }
}
