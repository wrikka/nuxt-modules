// Common types used across analytics module

export interface DateRange {
  start: Date;
  end: Date;
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'smarttv' | 'console' | 'wearable' | 'unknown';

export type PrivacyMode = 'strict' | 'balanced' | 'open';

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
