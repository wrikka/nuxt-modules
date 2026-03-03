// Base Webhook Event Interface
// Core webhook event structure shared across all event types

import type { WebhookEventType } from './event-types';
import type { PaymentIntent } from './payment-intent';
import type { CheckoutSession } from './checkout-session';
import type { Customer } from './customer';
import type { Invoice } from './invoice';
import type { Charge } from './charge';
import type { Refund } from './refund';
import type { Subscription } from './subscription';

export interface WebhookEvent {
  id: string;
  object: 'event';
  api_version?: string;
  created: number;
  data: {
    object: unknown;
    previous_attributes?: Record<string, unknown>;
  };
  livemode: boolean;
  pending_webhooks?: number;
  request?: {
    id?: string;
    idempotency_key?: string;
  };
  type: WebhookEventType;
}

// Specific Event Types
export interface PaymentIntentEvent extends WebhookEvent {
  type:
    | 'payment_intent.amount_capturable_updated'
    | 'payment_intent.canceled'
    | 'payment_intent.created'
    | 'payment_intent.partially_funded'
    | 'payment_intent.payment_failed'
    | 'payment_intent.processing'
    | 'payment_intent.requires_action'
    | 'payment_intent.succeeded';
  data: {
    object: PaymentIntent;
    previous_attributes?: Partial<PaymentIntent>;
  };
}

export interface CheckoutSessionEvent extends WebhookEvent {
  type:
    | 'checkout.session.async_payment_failed'
    | 'checkout.session.async_payment_succeeded'
    | 'checkout.session.completed'
    | 'checkout.session.expired';
  data: {
    object: CheckoutSession;
    previous_attributes?: Partial<CheckoutSession>;
  };
}

export interface CustomerEvent extends WebhookEvent {
  type:
    | 'customer.created'
    | 'customer.deleted'
    | 'customer.updated';
  data: {
    object: Customer;
    previous_attributes?: Partial<Customer>;
  };
}

export interface InvoiceEvent extends WebhookEvent {
  type:
    | 'invoice.created'
    | 'invoice.deleted'
    | 'invoice.finalization_failed'
    | 'invoice.finalized'
    | 'invoice.marked_uncollectible'
    | 'invoice.overdue'
    | 'invoice.paid'
    | 'invoice.payment_action_required'
    | 'invoice.payment_failed'
    | 'invoice.payment_succeeded'
    | 'invoice.sent'
    | 'invoice.tax_amounts_updated'
    | 'invoice.upcoming'
    | 'invoice.updated'
    | 'invoice.voided'
    | 'invoice.will_be_due';
  data: {
    object: Invoice;
    previous_attributes?: Partial<Invoice>;
  };
}

export interface SubscriptionEvent extends WebhookEvent {
  type:
    | 'customer.subscription.created'
    | 'customer.subscription.deleted'
    | 'customer.subscription.paused'
    | 'customer.subscription.resumed'
    | 'customer.subscription.trial_will_end'
    | 'customer.subscription.updated';
  data: {
    object: Subscription;
    previous_attributes?: Partial<Subscription>;
  };
}

export interface ChargeEvent extends WebhookEvent {
  type:
    | 'charge.captured'
    | 'charge.expired'
    | 'charge.failed'
    | 'charge.pending'
    | 'charge.refundable'
    | 'charge.refunded'
    | 'charge.succeeded'
    | 'charge.updated';
  data: {
    object: Charge;
    previous_attributes?: Partial<Charge>;
  };
}

export interface RefundEvent extends WebhookEvent {
  type:
    | 'refund.canceled'
    | 'refund.created'
    | 'refund.updated';
  data: {
    object: Refund;
    previous_attributes?: Partial<Refund>;
  };
}

// Webhook Handler Types
export interface WebhookHandlerOptions {
  secret?: string;
  tolerance?: number;
  rawBody?: string;
}

export interface WebhookHandlerResult {
  received: boolean;
  event?: WebhookEvent;
  error?: string;
}

export interface WebhookEventHandler {
  event: WebhookEventType;
  handler: (event: WebhookEvent) => Promise<void> | void;
}
