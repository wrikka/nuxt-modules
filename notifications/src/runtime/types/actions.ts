import type { Notification } from './notification';

export interface NotificationAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  url?: string;
  onClick?: (notification: Notification) => void | Promise<void>;
  closeOnClick?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface NotificationActionConfig {
  maxActions: number;
  showIcons: boolean;
  closeOnAction: boolean;
}

export type NotificationActionHandler = (
  action: NotificationAction,
  notification: Notification,
) => void | Promise<void>;
