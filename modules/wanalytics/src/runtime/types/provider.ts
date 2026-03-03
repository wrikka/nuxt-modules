export interface AnalyticsProvider {
  name: string;
  init: (config: Record<string, unknown>) => void | Promise<void>;
  trackPageView: (data: PageViewData) => void;
  trackEvent: (data: EventData) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  reset: () => void;
}

export interface PageViewData {
  url: string;
  title?: string;
  referrer?: string;
}

export interface EventData {
  name: string;
  properties?: Record<string, unknown>;
}

export interface PlausibleConfig {
  domain: string;
  apiHost?: string;
}

export interface UmamiConfig {
  websiteId: string;
  apiHost?: string;
}

export interface PostHogConfig {
  apiKey: string;
  apiHost?: string;
}

export interface CustomProviderConfig {
  endpoint: string;
}
