import type { NotificationType } from './notification';

export interface NotificationCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  types?: NotificationType[];
  priority?: string;
  description?: string;
}

export interface CategoryConfig {
  enabled: boolean;
  categories: NotificationCategory[];
  defaultCategory?: string;
}
