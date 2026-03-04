import {
  listPaymentMethods,
  toUnifiedPaymentMethod,
  retrieveCustomer,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const customerId = query.customerId as string;

  if (!customerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID is required',
    });
  }

  try {
    const methods = await listPaymentMethods({
      customer: customerId,
      type: 'card',
      limit: 100,
    });

    const customer = await retrieveCustomer(customerId);
    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method as string | undefined;

    return methods.data.map(pm => ({
      ...toUnifiedPaymentMethod(pm),
      isDefault: pm.id === defaultPaymentMethodId,
    }));
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to load payment methods',
    });
  }
});
