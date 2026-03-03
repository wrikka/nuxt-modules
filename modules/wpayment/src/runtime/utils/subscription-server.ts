import Stripe from 'stripe';
import { getStripe } from './stripe-server';
import type {
  CancelSubscriptionParams,
  CreateSubscriptionParams,
  PauseSubscriptionParams,
  ResumeSubscriptionParams,
  Subscription,
  UpdateSubscriptionParams,
} from '#wpayment/types';

export async function createSubscription(params: CreateSubscriptionParams): Promise<Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.create({
    customer: params.customer,
    items: params.items,
    coupon: params.coupon,
    promotion_code: params.promotion_code,
    default_payment_method: params.default_payment_method,
    trial_period_days: params.trial_period_days,
    trial_end: params.trial_end,
    backdate_start_date: params.backdate_start_date,
    billing_cycle_anchor: params.billing_cycle_anchor,
    billing_thresholds: params.billing_thresholds,
    cancel_at: params.cancel_at,
    cancel_at_period_end: params.cancel_at_period_end,
    collection_method: params.collection_method,
    days_until_due: params.days_until_due,
    default_source: params.default_source,
    default_tax_rates: params.default_tax_rates,
    description: params.description,
    metadata: params.metadata,
    payment_settings: params.payment_settings,
    proration_behavior: params.proration_behavior,
    transfer_data: params.transfer_data,
    trial_from_plan: params.trial_from_plan,
  });

  return subscription as unknown as Subscription;
}

export async function retrieveSubscription(subscriptionId: string): Promise<Subscription> {
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription as unknown as Subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  params: UpdateSubscriptionParams,
): Promise<Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    coupon: params.coupon,
    promotion_code: params.promotion_code,
    default_payment_method: params.default_payment_method,
    items: params.items,
    billing_cycle_anchor: params.billing_cycle_anchor,
    cancel_at: params.cancel_at,
    cancel_at_period_end: params.cancel_at_period_end,
    collection_method: params.collection_method,
    days_until_due: params.days_until_due,
    default_source: params.default_source,
    default_tax_rates: params.default_tax_rates,
    description: params.description,
    metadata: params.metadata,
    payment_settings: params.payment_settings,
    proration_behavior: params.proration_behavior,
    proration_date: params.proration_date,
    transfer_data: params.transfer_data,
    trial_end: params.trial_end,
  });

  return subscription as unknown as Subscription;
}

export async function cancelSubscription(
  subscriptionId: string,
  params?: CancelSubscriptionParams,
): Promise<Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.cancel(subscriptionId, {
    cancellation_details: params?.cancellation_details,
    invoice_now: params?.invoice_now,
    prorate: params?.prorate,
  });

  return subscription as unknown as Subscription;
}

export async function pauseSubscription(
  subscriptionId: string,
  params: PauseSubscriptionParams,
): Promise<Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    pause_collection: {
      behavior: params.behavior,
      resumes_at: params.resumes_at,
    },
  });

  return subscription as unknown as Subscription;
}

export async function resumeSubscription(
  subscriptionId: string,
  params?: ResumeSubscriptionParams,
): Promise<Subscription> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    pause_collection: '',
    billing_cycle_anchor: params?.billing_cycle_anchor,
    proration_behavior: params?.proration_behavior,
  });

  return subscription as unknown as Subscription;
}

export async function listSubscriptions(customerId: string): Promise<Subscription[]> {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  return subscriptions.data as unknown as Subscription[];
}

export async function listAllSubscriptions(params?: {
  status?: string;
  limit?: number;
  starting_after?: string;
}): Promise<Subscription[]> {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    status: params?.status as Stripe.Subscriptions.Status,
    limit: params?.limit,
    starting_after: params?.starting_after,
  });

  return subscriptions.data as unknown as Subscription[];
}

export async function getSubscriptionUsage(
  subscriptionId: string,
): Promise<{
  subscription: Subscription;
  usageRecords: Stripe.ApiList<Stripe.UsageRecordSummary>;
}> {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product'],
  });

  const usageRecords = await stripe.subscriptionItems.listUsageRecordSummaries(
    subscription.items.data[0].id,
  );

  return {
    subscription: subscription as unknown as Subscription,
    usageRecords,
  };
}

export async function reportUsage(params: {
  subscriptionItemId: string;
  quantity: number;
  timestamp?: number;
  action?: 'increment' | 'set';
}): Promise<Stripe.UsageRecord> {
  const stripe = getStripe();

  return await stripe.subscriptionItems.createUsageRecord(params.subscriptionItemId, {
    quantity: params.quantity,
    timestamp: params.timestamp || Math.floor(Date.now() / 1000),
    action: params.action || 'increment',
  });
}
