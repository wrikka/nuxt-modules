import {
  listSubscriptions,
  toUnifiedSubscription,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const customerId = query.customer as string;

  if (!customerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID is required',
    });
  }

  try {
    const subscriptions = await listSubscriptions({
      customer: customerId,
      limit: 100,
    });

    return subscriptions.data.map(toUnifiedSubscription);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to list subscriptions',
    });
  }
});
