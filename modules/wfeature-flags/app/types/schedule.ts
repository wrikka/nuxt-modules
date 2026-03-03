export interface ScheduledChange {
  id: string;
  flagKey: string;
  action: ScheduledAction;
  scheduledAt: number;
  executedAt?: number;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  previousValue?: unknown;
  newValue?: unknown;
  createdBy?: string;
  createdAt: number;
}

export interface ScheduledAction {
  type: 'enable' | 'disable' | 'set_percentage' | 'add_targeting' | 'remove_targeting';
  payload?: unknown;
}

export interface ScheduleConfig {
  enabled: boolean;
  checkInterval: number;
  maxRetries: number;
}

export interface ScheduleFilter {
  flagKey?: string;
  status?: ScheduledChange['status'];
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
}
