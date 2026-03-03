import type { WebhookProvider } from './event';

export interface WebhookProviderConfig {
  enabled: boolean;
  secret?: string;
}

export interface WebhookVerifier {
  provider: WebhookProvider;
  verify: (payload: string, signature: string, secret: string) => boolean;
}

export interface StripeWebhookEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: Record<string, unknown>;
    previous_attributes?: Record<string, unknown>;
  };
  created: number;
  livemode: boolean;
}

export interface GitHubWebhookEvent {
  action?: string;
  ref?: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
  sender: {
    login: string;
    type: string;
  };
}

export interface SlackWebhookEvent {
  type: string;
  team?: string;
  user?: string;
  channel?: string;
  ts?: string;
  event?: Record<string, unknown>;
}
