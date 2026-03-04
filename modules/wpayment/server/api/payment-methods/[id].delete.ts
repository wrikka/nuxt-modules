import {
  detachPaymentMethod,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const paymentMethodId = getRouterParam(event, 'id');

  if (!paymentMethodId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment method ID is required',
    });
  }

  try {
    await detachPaymentMethod(paymentMethodId);
    return { success: true };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to detach payment method',
    });
  }
});
