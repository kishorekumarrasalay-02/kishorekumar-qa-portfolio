export type SectionName =
  | "home"
  | "about"
  | "experience"
  | "skills"
  | "portfolio"
  | "personal-projects"
  | "contact";

export type ClickButtonName =
  | "github"
  | "linkedin"
  | "email"
  | "phone"
  | "resume_download"
  | "cover_letter_download"
  | "contact_button"
  | "copy_email"
  | "project_demo"
  | "project_github";

export interface VisitorPayload {
  visitorKey: string;
  sessionKey: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  referrer?: string;
}

export interface EventPayload {
  visitorKey: string;
  sessionKey: string;
  eventType: string;
  eventName: string;
  page?: string;
  metadata?: Record<string, unknown>;
}

export interface ClickPayload {
  visitorKey: string;
  sessionKey: string;
  buttonName: ClickButtonName | string;
  page?: string;
}

export interface DownloadPayload {
  visitorKey: string;
  sessionKey: string;
  fileName: string;
}

export interface SectionPayload {
  visitorKey: string;
  sessionKey: string;
  section: SectionName;
  timeSpentSeconds?: number;
  scrollDepth?: number;
}

export interface DashboardMetrics {
  totalVisitors: number;
  todayVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  uniqueUsers: number;
  returningUsers: number;
  newUsers: number;
  totalDownloads: number;
  resumeDownloads: number;
  githubClicks: number;
  linkedinClicks: number;
  emailClicks: number;
  phoneClicks: number;
  contactButtonClicks: number;
  bounceRate: number;
  avgScrollDepth: number;
  avgSessionDuration: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: "visit" | "click" | "download" | "section";
  message: string;
  detail: string;
  country: string;
  browser: string;
  device: string;
  createdAt: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  dailyVisitors: ChartPoint[];
  weeklyVisitors: ChartPoint[];
  monthlyVisitors: ChartPoint[];
  countryDistribution: ChartPoint[];
  browserDistribution: ChartPoint[];
  deviceDistribution: ChartPoint[];
  osDistribution: ChartPoint[];
  topButtons: ChartPoint[];
  trafficSources: ChartPoint[];
  scrollDepth: ChartPoint[];
  recentActivity: ActivityItem[];
}
