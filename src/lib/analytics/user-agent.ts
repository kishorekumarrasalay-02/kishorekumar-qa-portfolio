export function parseUserAgent(ua: string) {
  const lower = ua.toLowerCase();

  let browser = "Unknown";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/")) browser = "Chrome";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("opera") || lower.includes("opr/")) browser = "Opera";

  let os = "Unknown";
  if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("mac os")) os = "macOS";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "iOS";
  else if (lower.includes("linux")) os = "Linux";

  let device = "Desktop";
  if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android"))
    device = "Mobile";
  else if (lower.includes("ipad") || lower.includes("tablet")) device = "Tablet";

  return { browser, os, device };
}
