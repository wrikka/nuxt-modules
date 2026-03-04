import {
  updateCustomer,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { paymentMethodId } = body;

  try {
    // Note: This sets the default payment method for the authenticated user's customer
    // In a real implementation, you'd get the customer ID from the authenticated session
    const customerId = 'cus_default'; // Placeholder - should come from auth context

    await updateCustomer(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return { success: true };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to set default payment method',
    });
  }
});
