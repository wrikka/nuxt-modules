import {
  retrieveBalance,
} from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  try {
    const balance = await retrieveBalance();
    return {
      available: balance.available.map(b => ({
        amount: b.amount,
        currency: b.currency.toUpperCase(),
        sourceTypes: b.source_types,
      })),
      pending: balance.pending.map(b => ({
        amount: b.amount,
        currency: b.currency.toUpperCase(),
        sourceTypes: b.source_types,
      })),
      instantAvailable: balance.instant_available?.map(b => ({
        amount: b.amount,
        currency: b.currency.toUpperCase(),
        sourceTypes: b.source_types,
      })),
    };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to retrieve balance',
    });
  }
});
