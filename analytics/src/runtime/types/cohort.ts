import type { DateRange } from './common';

export interface Cohort {
  id: string;
  name: string;
  type: CohortType;
  criteria: CohortCriteria;
  size: number;
  createdAt: Date;
}

export type CohortType =
  | 'signup_date'
  | 'first_purchase'
  | 'user_segment'
  | 'behavior'
  | 'custom';

export interface CohortCriteria {
  field: string;
  operator: 'equals' | 'between' | 'in' | 'gt' | 'lt' | 'gte' | 'lte';
  value: unknown;
}

export interface CohortAnalysis {
  cohortId: string;
  period: DateRange;
  granularity: 'day' | 'week' | 'month';
  data: CohortDataPoint[];
  retention: RetentionData;
  metrics: CohortMetrics;
}

export interface CohortDataPoint {
  period: number;
  users: number;
  percentage: number;
  revenue?: number;
  events?: number;
}

export interface RetentionData {
  day1: number;
  day7: number;
  day14: number;
  day30: number;
  day60: number;
  day90: number;
}

export interface CohortMetrics {
  avgLifetimeValue: number;
  avgSessionCount: number;
  avgSessionDuration: number;
  churnRate: number;
  growthRate: number;
}

export interface CohortComparison {
  cohorts: Cohort[];
  comparison: CohortComparisonData[];
  insights: CohortInsight[];
}

export interface CohortComparisonData {
  period: number;
  values: Record<string, number>;
}

export interface CohortInsight {
  type: 'improvement' | 'decline' | 'stable';
  description: string;
  cohortA: string;
  cohortB: string;
  change: number;
}

export interface CohortConfig {
  enabled: boolean;
  autoCreate: boolean;
  defaultCohorts: CohortType[];
  retentionPeriods: number[];
}
