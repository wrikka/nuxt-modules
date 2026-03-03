import type { DateRange } from './common';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  schedule?: ReportSchedule;
  recipients: ReportRecipient[];
  filters?: ReportFilter[];
  format: ReportFormat;
  period?: DateRange;
  enabled: boolean;
  lastSent?: Date;
  lastGenerated?: Date;
  nextSend?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export type ReportStatus = 'active' | 'paused' | 'draft' | 'archived' | 'generating' | 'completed' | 'failed';

export type ReportType =
  | 'overview'
  | 'traffic'
  | 'conversion'
  | 'revenue'
  | 'performance'
  | 'custom';

export type ReportFormat = 'pdf' | 'csv' | 'json' | 'html';

export interface ReportSchedule {
  id: string;
  reportId?: string;
  frequency: ReportFrequency;
  day?: number;
  hour?: number;
  minute?: number;
  timezone?: string;
  active: boolean;
  nextRun?: Date;
  recipients?: ReportRecipient[];
}

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ReportRecipient {
  id: string;
  email: string;
  name?: string;
  active: boolean;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: unknown;
}

export interface ReportData {
  reportId: string;
  period: DateRange;
  generatedAt: Date;
  metrics: ReportMetric[];
  charts: ReportChart[];
  insights: string[];
  comparison?: ReportComparison;
}

export interface ReportMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  visitors?: number;
  sessions?: number;
  pageViews?: number;
  bounceRate?: number;
  conversionRate?: number;
  total?: number;
  unique?: number;
  new?: number;
  returning?: number;
  avgDuration?: number;
  rate?: number;
}

export interface ReportChart {
  type: 'line' | 'bar' | 'pie' | 'area' | 'table';
  title: string;
  data: ChartDataPoint[];
  labels?: string[];
}

export interface ChartDataPoint {
  label?: string;
  value?: number;
  data?: number[];
  [key: string]: unknown;
}

export interface ReportComparison {
  period: DateRange;
  metrics: ReportMetric[];
}

export interface ReportHistory {
  reportId: string;
  sends: ReportSend[];
}

export interface ReportSend {
  id: string;
  sentAt: Date;
  recipients: string[];
  status: 'sent' | 'failed' | 'bounced';
  opens: number;
  clicks: number;
}

export interface ReportConfig {
  enabled: boolean;
  defaultTimezone: string;
  maxRecipients: number;
  retentionDays: number;
  branding: ReportBranding;
}

export interface ReportBranding {
  logo?: string;
  primaryColor?: string;
  companyName?: string;
  footerText?: string;
}
