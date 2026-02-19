import type { AnalyticsConfig } from './config';

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    public: {
      analytics: AnalyticsConfig;
    };
  }
}

declare module '#imports' {
  const useRuntimeConfig: () => {
    public: {
      analytics: AnalyticsConfig;
    };
  };
}
