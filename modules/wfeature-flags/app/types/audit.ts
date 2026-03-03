export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: AuditAction;
  flagKey: string;
  previousValue?: unknown;
  newValue?: unknown;
  actor: Actor;
  metadata?: Record<string, unknown>;
}

export type AuditAction =
  | 'flag:created'
  | 'flag:updated'
  | 'flag:deleted'
  | 'flag:enabled'
  | 'flag:disabled'
  | 'flag:targeting_added'
  | 'flag:targeting_removed'
  | 'flag:rollout_changed'
  | 'experiment:created'
  | 'experiment:started'
  | 'experiment:stopped'
  | 'experiment:variant_added';

export interface Actor {
  type: 'user' | 'system' | 'api';
  id?: string;
  name?: string;
  email?: string;
}

export interface AuditLogConfig {
  enabled: boolean;
  retentionDays: number;
  maxEntries: number;
}

export interface AuditLogFilter {
  flagKey?: string;
  action?: AuditAction;
  actorId?: string;
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
}
