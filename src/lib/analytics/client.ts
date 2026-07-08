const VISITOR_KEY = "pa_visitor_key";
const SESSION_KEY = "pa_session_key";
const SESSION_START = "pa_session_start";

function generateId() {
  return crypto.randomUUID();
}

export function getAnalyticsIds() {
  if (typeof window === "undefined") {
    return { visitorKey: "", sessionKey: "", sessionStart: 0 };
  }

  let visitorKey = localStorage.getItem(VISITOR_KEY) ?? "";
  let sessionKey = sessionStorage.getItem(SESSION_KEY) ?? "";
  let sessionStart = Number(sessionStorage.getItem(SESSION_START) ?? "0");

  if (!sessionKey) {
    sessionKey = generateId();
    sessionStorage.setItem(SESSION_KEY, sessionKey);
    sessionStart = Date.now();
    sessionStorage.setItem(SESSION_START, String(sessionStart));
  }

  return { visitorKey, sessionKey, sessionStart };
}

export function setVisitorKey(key: string) {
  localStorage.setItem(VISITOR_KEY, key);
}

export function getSessionDuration(): number {
  const { sessionStart } = getAnalyticsIds();
  if (!sessionStart) return 0;
  return Math.round((Date.now() - sessionStart) / 1000);
}

export function getClientContext() {
  if (typeof window === "undefined") return {};
  return {
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer || "Direct",
  };
}
