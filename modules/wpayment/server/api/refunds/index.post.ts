import {
  refundPaymentIntent,
  retrievePaymentIntent,
  toUnifiedPaymentIntent,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { paymentIntentId, amount, reason, metadata } = body;

  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment intent ID is required',
    });
  }

  try {
    await refundPaymentIntent(paymentIntentId, {
      amount,
      reason,
      metadata,
    });

    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    return toUnifiedPaymentIntent(paymentIntent);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to process refund',
    });
  }
});
