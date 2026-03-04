import {
  confirmPaymentIntent,
  retrievePaymentIntent,
  toUnifiedPaymentIntent,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const paymentIntentId = getRouterParam(event, 'id');
  const body = await readBody(event);
  const { paymentMethodId, receiptEmail, returnUrl, offSession } = body;

  if (!paymentIntentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment intent ID is required',
    });
  }

  try {
    await confirmPaymentIntent(paymentIntentId, {
      payment_method: paymentMethodId,
      receipt_email: receiptEmail,
      return_url: returnUrl,
      off_session: offSession,
    });

    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    return toUnifiedPaymentIntent(paymentIntent);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to confirm payment',
    });
  }
});
