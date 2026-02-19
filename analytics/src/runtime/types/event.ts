export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface PageViewEvent {
  url: string;
  title?: string;
  referrer?: string;
  timestamp?: Date;
}

export interface UserEvent {
  userId: string;
  traits?: Record<string, unknown>;
  timestamp?: Date;
}

export type EventCategory =
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'error'
  | 'user'
  | 'system'
  | 'custom';

export const EventCategories = {
  NAVIGATION: 'navigation' as const,
  ENGAGEMENT: 'engagement' as const,
  CONVERSION: 'conversion' as const,
  ERROR: 'error' as const,
  USER: 'user' as const,
  SYSTEM: 'system' as const,
  CUSTOM: 'custom' as const,
};
