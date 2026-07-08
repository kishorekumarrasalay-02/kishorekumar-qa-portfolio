import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getRequestMeta() {
  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  const referrer = h.get("referer") ?? "";
  return { headers: h, userAgent, referrer };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function jsonOk<T extends Record<string, unknown>>(data: T) {
  return NextResponse.json({ ok: true, ...data });
}
