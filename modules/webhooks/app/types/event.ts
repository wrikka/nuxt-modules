export interface WebhookEvent {
  id: string;
  provider: WebhookProvider;
  type: string;
  timestamp: Date;
  data: Record<string, unknown>;
  raw: string;
  signature?: string;
  processed: boolean;
  error?: string;
  retryCount: number;
}

export interface WebhookEventLog {
  id: string;
  eventId: string;
  timestamp: Date;
  status: 'received' | 'processing' | 'success' | 'failed';
  message?: string;
  duration?: number;
}

export type WebhookProvider = 'stripe' | 'github' | 'slack' | 'custom';

export interface WebhookHandler {
  provider: WebhookProvider;
  eventTypes: string[];
  handler: (event: WebhookEvent) => Promise<void>;
}

export interface WebhookRetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: 'fixed' | 'exponential';
}
