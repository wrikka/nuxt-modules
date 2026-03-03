import type { DateRange } from './common';

export interface TrackedErrorEvent {
  id: string;
  type: ErrorType;
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
  browser: string;
  os: string;
  device: string;
  context: Record<string, unknown>;
}

export type ErrorType =
  | 'javascript'
  | 'network'
  | 'resource'
  | 'render'
  | 'hydration'
  | 'api'
  | 'custom';

export interface ErrorSummary {
  period: DateRange;
  totalErrors: number;
  affectedUsers: number;
  affectedSessions: number;
  errorRate: number;
  errorsByType: Record<ErrorType, number>;
  topErrors: ErrorOccurrence[];
  trends: ErrorTrend[];
}

export interface ErrorOccurrence {
  fingerprint: string;
  message: string;
  type: ErrorType;
  count: number;
  affectedUsers: number;
  firstSeen: Date;
  lastSeen: Date;
  url: string;
  stack?: string;
}

export interface ErrorTrend {
  date: Date;
  count: number;
  errorRate: number;
}

export interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  duration: number;
  timestamp: Date;
  requestBody?: string;
  responseBody?: string;
}

export interface PerformanceIssue {
  type: 'slow_api' | 'slow_render' | 'memory_leak' | 'large_bundle' | 'long_task';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  value: number;
  threshold: number;
  url: string;
  timestamp: Date;
}

export interface ErrorTrackingConfig {
  enabled: boolean;
  captureStackTrace: boolean;
  captureSessionReplay: boolean;
  ignoreErrors: string[];
  ignoreUrls: string[];
  sampleRate: number;
  beforeSend?: (error: TrackedErrorEvent) => TrackedErrorEvent | null;
}
