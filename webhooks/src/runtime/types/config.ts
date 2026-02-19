import type { WebhookProviderConfig } from './provider';

export interface WebhooksConfig {
  enabled: boolean;
  retryAttempts: number;
  retryDelay: number;
  debug: boolean;
}

export interface WebhooksRuntimeConfig {
  public: {
    webhooks: WebhooksConfig;
  };
  private: {
    webhooksSecret?: string;
    webhooksProviders?: {
      stripe?: WebhookProviderConfig;
      github?: WebhookProviderConfig;
      slack?: WebhookProviderConfig;
      custom?: WebhookProviderConfig;
    };
  };
}

declare module 'nuxt/schema' {
  interface RuntimeConfig extends WebhooksRuntimeConfig {}
}
