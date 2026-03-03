export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  url?: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  data?: Record<string, unknown>;
  priority: NotificationPriority;
  channel: NotificationChannel;
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'message';

export type NotificationPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export type NotificationChannel =
  | 'in-app'
  | 'email'
  | 'push'
  | 'sms';

export interface NotificationPreferences {
  enabled: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  types: Partial<Record<NotificationType, boolean>>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  digest?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
  };
}
