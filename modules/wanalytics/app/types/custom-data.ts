import type { DateRange } from './common';

export interface CustomDimension {
  id: string;
  name: string;
  key: string;
  type: DimensionType;
  scope: DimensionScope;
  active: boolean;
  description?: string;
}

export type DimensionType = 'string' | 'number' | 'boolean' | 'date' | 'enum';
export type DimensionScope = 'hit' | 'session' | 'user';

export interface CustomMetric {
  id: string;
  name: string;
  key: string;
  type: MetricType;
  scope: MetricScope;
  unit?: string;
  active: boolean;
  description?: string;
  formatting?: {
    prefix?: string;
    suffix?: string;
    precision?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
    currency?: string;
    currencyPosition?: 'before' | 'after';
  };
}

export type MetricType = 'integer' | 'float' | 'currency' | 'time' | 'percentage';
export type MetricScope = 'hit' | 'session' | 'user' | 'product';

export interface DimensionValue {
  dimensionId: string;
  dimensionKey: string;
  value: unknown;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
}

export interface MetricValue {
  metricId: string;
  metricKey: string;
  value: number;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
}

export interface CustomDataReport {
  period: DateRange;
  dimensions: CustomDimension[];
  metrics: CustomMetric[];
  data: CustomDataRow[];
  totals: Record<string, number>;
}

export interface CustomDataRow {
  dimensions: Record<string, unknown>;
  metrics: Record<string, number>;
}

export interface CustomDataConfig {
  enabled: boolean;
  maxDimensions: number;
  maxMetrics: number;
  autoTrack: string[];
}
