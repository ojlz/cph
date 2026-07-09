export interface AnalyticsEvent {
  event: string;
  label?: string;
  timestamp: number;
}

export interface DailyStats {
  date: string;
  visits: number;
  pageViews: number;
  events: Record<string, number>;
}

export interface AnalyticsData {
  days: DailyStats[];
}
