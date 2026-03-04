import {
  retrievePaymentIntent,
  toUnifiedPaymentIntent,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const paymentIntentId = getRouterParam(event, 'id');

  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment intent ID is required',
    });
  }

  try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    return toUnifiedPaymentIntent(paymentIntent);
  } catch (err) {
    throw createError({
      statusCode: 404,
      statusMessage: err instanceof Error ? err.message : 'Payment not found',
    });
  }
});
