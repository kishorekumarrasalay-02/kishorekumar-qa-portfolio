import { createHash } from "crypto";

export function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_SALT ?? "portfolio-analytics-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function hashVisitorKey(ipHash: string, userAgent: string): string {
  const salt = process.env.ANALYTICS_SALT ?? "portfolio-analytics-salt";
  return createHash("sha256")
    .update(`${salt}:visitor:${ipHash}:${userAgent.slice(0, 120)}`)
    .digest("hex")
    .slice(0, 32);
}
