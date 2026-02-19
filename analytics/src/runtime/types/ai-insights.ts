import type { DateRange } from './common';

export interface AIInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  recommendation: string;
  impact: InsightImpact;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
}

export type InsightType =
  | 'performance'
  | 'traffic'
  | 'conversion'
  | 'engagement'
  | 'error'
  | 'trend'
  | 'anomaly'
  | 'opportunity';

export type InsightSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface InsightImpact {
  affectedUsers: number;
  affectedRevenue: number;
  affectedConversionRate: number;
  affectedSessions: number;
}

export interface AIInsightsReport {
  period: DateRange;
  insights: AIInsight[];
  summary: InsightsSummary;
  recommendations: PrioritizedRecommendation[];
}

export interface InsightsSummary {
  totalInsights: number;
  criticalCount: number;
  warningCount: number;
  opportunitiesCount: number;
  potentialImpact: number;
}

export interface PrioritizedRecommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export interface AIQueryResult {
  query: string;
  answer: string;
  data: Record<string, unknown>;
  chartData?: ChartData[];
  followUpQuestions: string[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

export interface AIInsightsConfig {
  enabled: boolean;
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  autoGenerate: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}
