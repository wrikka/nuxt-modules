import {
  attachPaymentMethod,
  toUnifiedPaymentMethod,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { customerId, paymentMethodId } = body;

  if (!customerId || !paymentMethodId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID and Payment Method ID are required',
    });
  }

  try {
    const method = await attachPaymentMethod(paymentMethodId, customerId);
    return toUnifiedPaymentMethod(method);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to attach payment method',
    });
  }
});
