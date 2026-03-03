import type { DateRange } from './common';

export interface WebVitalsMetric {
  name: WebVitalName;
  value: number;
  rating: MetricRating;
  delta: number;
  id: string;
  timestamp: Date;
  url: string;
}

export type WebVitalName = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';

export type MetricRating = 'good' | 'needs-improvement' | 'poor';

export interface WebVitalsThresholds {
  LCP: { good: number; poor: number; };
  FID: { good: number; poor: number; };
  CLS: { good: number; poor: number; };
  FCP: { good: number; poor: number; };
  TTFB: { good: number; poor: number; };
  INP: { good: number; poor: number; };
}

export const WEB_VITALS_THRESHOLDS: WebVitalsThresholds = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

export interface WebVitalsSummary {
  period: DateRange;
  metrics: Record<WebVitalName, MetricSummary>;
  trends: Record<WebVitalName, MetricTrend>;
  pageMetrics: PageWebVitals[];
}

export interface MetricSummary {
  name: WebVitalName;
  avg: number;
  median: number;
  p75: number;
  p95: number;
  p99: number;
  good: number;
  needsImprovement: number;
  poor: number;
  rating: MetricRating;
}

export interface MetricTrend {
  name: WebVitalName;
  change: number;
  direction: 'up' | 'down' | 'stable';
  isPositive: boolean;
}

export interface PageWebVitals {
  url: string;
  title: string;
  views: number;
  metrics: Record<WebVitalName, number>;
  ratings: Record<WebVitalName, MetricRating>;
}

export interface WebVitalsConfig {
  enabled: boolean;
  reportAllChanges: boolean;
  sampleRate: number;
  debug: boolean;
}
