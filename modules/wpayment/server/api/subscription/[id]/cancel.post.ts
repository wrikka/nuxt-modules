import {
  cancelSubscription,
  toUnifiedSubscription,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const subscriptionId = getRouterParam(event, 'id');
  const body = await readBody(event);
  const { invoiceNow, prorate } = body;

  if (!subscriptionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Subscription ID is required',
    });
  }

  try {
    const subscription = await cancelSubscription(subscriptionId, {
      invoice_now: invoiceNow,
      prorate,
    });

    return toUnifiedSubscription(subscription);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to cancel subscription',
    });
  }
});
