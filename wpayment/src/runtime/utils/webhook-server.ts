import Stripe from 'stripe';
import { getStripe } from './stripe-server';
import type { WebhookEvent, WebhookEventHandler, WebhookHandlerResult } from '#wpayment/types';

const registeredHandlers: Map<string, WebhookEventHandler[]> = new Map();

export function registerWebhookHandler(handler: WebhookEventHandler): void {
  const handlers = registeredHandlers.get(handler.event) || [];
  handlers.push(handler);
  registeredHandlers.set(handler.event, handlers);
}

export function clearWebhookHandlers(): void {
  registeredHandlers.clear();
}

export async function handleWebhook(
  payload: string | Buffer,
  signature: string,
  secret?: string,
): Promise<WebhookHandlerResult> {
  const stripe = getStripe();
  const webhookSecret = secret || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return {
      received: false,
      error: 'Webhook secret is not configured',
    };
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    return {
      received: false,
      error: `Webhook signature verification failed: ${error.message}`,
    };
  }

  try {
    await processWebhookEvent(event as unknown as WebhookEvent);
    return {
      received: true,
      event: event as unknown as WebhookEvent,
    };
  } catch (err) {
    const error = err as Error;
    return {
      received: false,
      error: `Failed to process webhook: ${error.message}`,
      event: event as unknown as WebhookEvent,
    };
  }
}

async function processWebhookEvent(event: WebhookEvent): Promise<void> {
  const handlers = registeredHandlers.get(event.type) || [];

  for (const handler of handlers) {
    await handler.handler(event);
  }

  // Handle common events with default behavior
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(event);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionEvent(event);
      break;
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event);
      break;
  }
}

async function handlePaymentIntentSucceeded(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

async function handlePaymentIntentFailed(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

async function handleInvoicePaid(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

async function handleInvoicePaymentFailed(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

async function handleSubscriptionEvent(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

async function handleCheckoutSessionCompleted(_event: WebhookEvent): Promise<void> {
  // Override this function in your application
}

export function createWebhookEndpoint(params: {
  url: string;
  enabled_events?: string[];
  description?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.WebhookEndpoint> {
  const stripe = getStripe();

  return stripe.webhookEndpoints.create({
    url: params.url,
    enabled_events: (params.enabled_events || ['*']) as Stripe.WebhookEndpointCreateParams.EnabledEvent[],
    description: params.description,
    metadata: params.metadata,
  });
}

export function listWebhookEndpoints(): Promise<Stripe.ApiList<Stripe.WebhookEndpoint>> {
  const stripe = getStripe();
  return stripe.webhookEndpoints.list();
}

export function retrieveWebhookEndpoint(endpointId: string): Promise<Stripe.WebhookEndpoint> {
  const stripe = getStripe();
  return stripe.webhookEndpoints.retrieve(endpointId);
}

export function updateWebhookEndpoint(
  endpointId: string,
  params: {
    url?: string;
    enabled_events?: string[];
    description?: string;
    metadata?: Record<string, string>;
  },
): Promise<Stripe.WebhookEndpoint> {
  const stripe = getStripe();

  return stripe.webhookEndpoints.update(endpointId, {
    url: params.url,
    enabled_events: params.enabled_events as Stripe.WebhookEndpointUpdateParams.EnabledEvent[] | undefined,
    description: params.description,
    metadata: params.metadata,
  });
}

export function deleteWebhookEndpoint(endpointId: string): Promise<Stripe.DeletedWebhookEndpoint> {
  const stripe = getStripe();
  return stripe.webhookEndpoints.del(endpointId);
}
