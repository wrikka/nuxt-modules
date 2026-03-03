import type { Notification } from './notification';

export interface NotificationChannelConfig {
  enabled: boolean;
}

export interface InAppChannelConfig extends NotificationChannelConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible: number;
}

export interface EmailChannelConfig extends NotificationChannelConfig {
  provider?: 'resend' | 'sendgrid' | 'postmark' | 'custom';
}

export interface PushChannelConfig extends NotificationChannelConfig {
  vapidPublicKey?: string;
}

export interface NotificationSender {
  send: (notification: Notification, recipient: NotificationRecipient) => Promise<void>;
}

export interface NotificationRecipient {
  id: string;
  email?: string;
  pushToken?: string;
  preferences?: Record<string, unknown>;
}
