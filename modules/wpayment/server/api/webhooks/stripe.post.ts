import { constructWebhookEvent } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event);
  const body = await readRawBody(event);
  const signature = getHeader(event, 'stripe-signature');

  if (!signature) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing stripe-signature header',
    });
  }

  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];

  if (!webhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe webhook secret is not configured',
    });
  }

  try {
    const stripeEvent = await constructWebhookEvent(body || '', signature, webhookSecret);

    // Handle different event types
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        // Payment succeeded - update order status, send confirmation email, etc.
        break;
      case 'payment_intent.payment_failed':
        // Payment failed - handle failure, notify customer, etc.
        break;
      case 'customer.subscription.created':
        // Subscription created
        break;
      case 'customer.subscription.updated':
        // Subscription updated
        break;
      case 'customer.subscription.deleted':
        // Subscription canceled
        break;
      case 'invoice.payment_succeeded':
        // Invoice payment succeeded
        break;
      case 'invoice.payment_failed':
        // Invoice payment failed
        break;
      case 'charge.refunded':
        // Refund processed
        break;
      case 'payment_method.attached':
        // Payment method attached to customer
        break;
      case 'payment_method.detached':
        // Payment method detached from customer
        break;
    }

    return { received: true, type: stripeEvent.type };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Webhook error',
    });
  }
});
