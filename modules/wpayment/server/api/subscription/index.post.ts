import {
  createSubscription,
  toUnifiedSubscription,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const {
    customerId,
    priceId,
    quantity,
    trialDays,
    defaultPaymentMethodId,
    metadata,
    cancelAtPeriodEnd,
    prorationBehavior,
  } = body;

  try {
    const subscription = await createSubscription({
      customer: customerId,
      price: priceId,
      quantity,
      trial_period_days: trialDays,
      default_payment_method: defaultPaymentMethodId,
      metadata,
      cancel_at_period_end: cancelAtPeriodEnd,
      proration_behavior: prorationBehavior,
    });

    return toUnifiedSubscription(subscription);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to create subscription',
    });
  }
});
