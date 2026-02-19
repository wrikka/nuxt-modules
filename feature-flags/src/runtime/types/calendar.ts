export interface ScheduledEvent {
  id: string;
  flagKey: string;
  action: ScheduledAction;
  scheduledAt: number;
  executedAt?: number;
  status: ScheduleStatus;
  createdBy: string;
  environment: string;
  notification?: NotificationConfig;
}

import type { ScheduledAction } from './schedule';

export type ScheduleStatus = 'pending' | 'executed' | 'failed' | 'cancelled';

export interface NotificationConfig {
  enabled: boolean;
  channels: NotificationChannel[];
  recipients: string[];
  leadTime: number;
}

export type NotificationChannel = 'email' | 'slack' | 'webhook';

export interface CalendarView {
  year: number;
  month: number;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  date: number;
  events: ScheduledEvent[];
  hasConflict: boolean;
}

export interface ScheduleConflict {
  flagKey: string;
  events: ScheduledEvent[];
  type: 'overlap' | 'same-action' | 'opposite-action';
  severity: 'warning' | 'error';
}

export interface ScheduleCalendarConfig {
  view: 'month' | 'week' | 'day';
  showPastEvents: boolean;
  showCancelled: boolean;
  timezone: string;
}
