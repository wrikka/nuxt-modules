import type { NotificationPriority, NotificationType } from './notification';

export interface FilterOptions {
  searchQuery?: string;
  type?: NotificationType | 'all';
  priority?: NotificationPriority | 'all';
  unreadOnly?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
  category?: string | 'all';
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: Date;
}

export interface QuickFilterPreset {
  id: string;
  name: string;
  icon: string;
  filters: FilterOptions;
}
