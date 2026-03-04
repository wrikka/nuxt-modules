import { createCustomerPortalSession } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { customerId, returnUrl } = body;

  if (!customerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID is required',
    });
  }

  try {
    const session = await createCustomerPortalSession({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to create portal session',
    });
  }
});
