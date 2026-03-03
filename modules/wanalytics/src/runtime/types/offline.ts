import type { DateRange } from './common';

export interface OfflineConfig {
  enabled: boolean;
  storageType: OfflineStorageType;
  maxSize: number;
  maxEvents: number;
  retryStrategy: RetryStrategy;
  syncOnReconnect: boolean;
}

export type OfflineStorageType =
  | 'indexeddb'
  | 'localstorage'
  | 'memory';

export interface RetryStrategy {
  maxRetries: number;
  backoff: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  jitter: boolean;
}

export interface OfflineEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  storedAt: Date;
  syncAttempts: number;
  retryCount: number;
  lastAttempt?: Date;
  lastRetry?: Date;
  status: OfflineEventStatus;
}

export type OfflineEventStatus =
  | 'pending'
  | 'syncing'
  | 'synced'
  | 'failed'
  | 'discarded'
  | 'partial'
  | 'idle';

export type SyncStatus = OfflineEventStatus;

export interface OfflineQueue {
  events: OfflineEvent[];
  size: number;
  oldestEvent?: Date;
  newestEvent?: Date;
  pendingCount: number;
  failedCount: number;
}

export interface SyncResult {
  totalEvents: number;
  syncedEvents: number;
  failedEvents: number;
  discardedEvents: number;
  duration: number;
  errors: SyncError[];
}

export interface SyncError {
  eventId: string;
  error: string;
  timestamp: Date;
  willRetry: boolean;
}

export interface OfflineStatus {
  isOnline: boolean;
  lastOnline?: Date;
  lastOffline?: Date;
  queueSize: number;
  storageUsed: number;
  storageAvailable: number;
}

export interface OfflineAnalytics {
  period: DateRange;
  totalOfflineEvents: number;
  avgOfflineDuration: number;
  offlineSessions: number;
  syncSuccessRate: number;
  dataLossRate: number;
  offlineByPage: OfflinePageData[];
}

export interface OfflinePageData {
  url: string;
  offlineEvents: number;
  avgOfflineDuration: number;
  syncSuccessRate: number;
}
