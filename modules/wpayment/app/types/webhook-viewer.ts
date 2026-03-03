// Webhook Event Viewer Types
export interface WebhookEvent {
  id: string;
  object: 'event';
  api_version?: string;
  created: number;
  data: WebhookEventData;
  livemode: boolean;
  pending_webhooks?: number;
  request?: WebhookRequest;
  type: string;
  status?: WebhookEventStatus;
  receivedAt?: number;
}

export interface WebhookEventData {
  object: Record<string, any>;
  previous_attributes?: Record<string, any>;
}

export interface WebhookRequest {
  id?: string;
  idempotency_key?: string;
}

export type WebhookEventStatus = 'succeeded' | 'failed' | 'pending' | 'retrying';

export interface WebhookEndpoint {
  id: string;
  object: 'webhook_endpoint';
  api_version?: string;
  application?: string;
  created: number;
  description?: string;
  enabled_events: string[];
  livemode: boolean;
  metadata?: Record<string, string>;
  status: 'enabled' | 'disabled';
  url: string;
}

export interface WebhookDelivery {
  id: string;
  object: 'webhook_endpoint';
  created: number;
  event: string;
  http_status?: number;
  next_response?: WebhookResponse;
  response?: WebhookResponse;
  status: WebhookDeliveryStatus;
  webhook_endpoint: string;
}

export type WebhookDeliveryStatus = 'failed' | 'succeeded' | 'pending';

export interface WebhookResponse {
  body?: string;
  code: number;
  headers?: Record<string, string>;
}

export interface WebhookLog {
  id: string;
  eventId: string;
  endpoint: string;
  status: WebhookDeliveryStatus;
  httpStatus?: number;
  duration?: number;
  attempts: number;
  lastAttemptAt: number;
  nextRetryAt?: number;
}

export interface WebhookEventFilter {
  type?: string;
  status?: WebhookEventStatus;
  dateRange?: '1h' | '24h' | '7d' | '30d' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  search?: string;
}

export interface WebhookEventType {
  type: string;
  category: WebhookEventCategory;
  description: string;
}

export type WebhookEventCategory =
  | 'payment'
  | 'subscription'
  | 'customer'
  | 'invoice'
  | 'connect'
  | 'checkout'
  | 'dispute'
  | 'payout'
  | 'other';

export interface WebhookTestPayload {
  type: string;
  data: Record<string, any>;
}

export interface WebhookRetryConfig {
  maxAttempts: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed';
  initialDelay: number;
  maxDelay: number;
}
