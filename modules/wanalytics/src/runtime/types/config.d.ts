import type { AnalyticsConfig } from './config';

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    public: {
      analytics: AnalyticsConfig;
    };
  }
}

export {};
