import { headers } from "next/headers";

export async function getGeoFromHeaders() {
  const h = await headers();
  const country =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    h.get("x-country-code") ??
    "Unknown";
  const city =
    h.get("x-vercel-ip-city") ??
    h.get("cf-ipcity") ??
    h.get("x-city") ??
    "Unknown";

  return { country, city };
}

export function getClientIp(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "0.0.0.0"
  );
}
