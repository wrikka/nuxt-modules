import {
  createPaymentIntent,
  confirmPaymentIntent,
  retrievePaymentIntent,
  refundPaymentIntent,
  toUnifiedPaymentIntent,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const {
    amount,
    currency,
    customerId,
    customerEmail,
    description,
    metadata,
    paymentMethodId,
    savePaymentMethod,
    confirm,
  } = body;

  try {
    // Create customer if needed
    let customer = customerId;
    if (!customer && customerEmail) {
      const { createCustomer } = await import('../../../app/utils/stripe-server');
      const newCustomer = await createCustomer({ email: customerEmail });
      customer = newCustomer.id;
    }

    const paymentIntent = await createPaymentIntent({
      amount,
      currency: currency.toLowerCase(),
      customer,
      payment_method: paymentMethodId,
      metadata: {
        ...metadata,
        description: description || '',
      },
    });

    // Confirm immediately if requested
    if (confirm && paymentMethodId) {
      await confirmPaymentIntent(paymentIntent.id);
    }

    const retrieved = await retrievePaymentIntent(paymentIntent.id);
    return toUnifiedPaymentIntent(retrieved);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to create payment',
    });
  }
});
