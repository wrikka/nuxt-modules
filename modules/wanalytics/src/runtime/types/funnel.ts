import type { DateRange } from './common';

export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  name: string;
  type: FunnelStepType;
  target: string;
  order: number;
}

export type FunnelStepType = 'pageview' | 'event' | 'custom';

export interface FunnelData {
  funnelId: string;
  period: DateRange;
  steps: FunnelStepData[];
  totalVisitors: number;
  conversionRate: number;
  averageTime: number;
}

export interface FunnelStepData {
  stepId: string;
  stepName: string;
  visitors: number;
  dropOff: number;
  dropOffRate: number;
  conversionRate: number;
  averageTimeToComplete: number;
  previousStepVisitors: number;
}

export interface FunnelComparison {
  current: FunnelData;
  previous: FunnelData;
  change: FunnelChangeMetrics;
}

export interface FunnelChangeMetrics {
  conversionRateChange: number;
  visitorsChange: number;
  dropOffChange: number;
}

export interface FunnelConfig {
  enabled: boolean;
  autoTrack: boolean;
  defaultSteps: FunnelStep[];
}
