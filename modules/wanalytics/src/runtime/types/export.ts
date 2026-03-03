import type { DateRange } from './common';

export interface DataExport {
  id: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  filters: ExportFilter[];
  dateRange: DateRange;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  fileUrl?: string;
  expiresAt?: Date;
  fileSize?: number;
  recordCount?: number;
  data?: Record<string, unknown>[];
}

export type ExportType =
  | 'pageviews'
  | 'events'
  | 'sessions'
  | 'users'
  | 'revenue'
  | 'errors'
  | 'custom';

export type ExportFormat = 'csv' | 'json' | 'parquet' | 'xlsx';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled';

export interface ExportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
  value: unknown;
}

export interface ExportSchedule {
  id: string;
  name: string;
  type: ExportType;
  format: ExportFormat;
  filters: ExportFilter[];
  schedule: ExportScheduleConfig;
  destination: ExportDestination;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface ExportScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  day?: number;
  hour: number;
  timezone: string;
}

export interface ExportDestination {
  type: 'email' | 's3' | 'gcs' | 'azure' | 'sftp' | 'webhook';
  config: Record<string, unknown>;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: APIKeyPermission[];
  rateLimit?: number;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  active?: boolean;
  status?: 'active' | 'revoked' | 'expired';
}

export interface APIPermission {
  resource: APIResource;
  actions: APIAction[];
}

export type APIResource =
  | 'events'
  | 'pageviews'
  | 'sessions'
  | 'users'
  | 'revenue'
  | 'reports'
  | 'exports'
  | 'settings';

export type APIAction = 'read' | 'write' | 'delete';

export interface APIUsage {
  keyId: string;
  period: DateRange;
  totalRequests: number;
  requestsByEndpoint: Record<string, number>;
  errors: number;
  avgResponseTime: number;
}

export interface ExportConfig {
  enabled: boolean;
  maxExports: number;
  maxFileSize: number;
  retentionDays: number;
  allowedFormats: ExportFormat[];
}

export interface ExportProgress {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

export type APIKeyPermission = 'read' | 'write' | 'delete' | 'admin';
