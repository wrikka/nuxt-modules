import { listEvents } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  try {
    const events = await listEvents({
      limit: 100,
    });

    return {
      totalRevenue: 0,
      totalTransactions: events.data.length,
      successfulTransactions: events.data.filter(e => e.type === 'payment_intent.succeeded').length,
      failedTransactions: events.data.filter(e => e.type === 'payment_intent.payment_failed').length,
      refundedAmount: 0,
      averageTransactionValue: 0,
      conversionRate: 0,
      mrr: 0,
      arr: 0,
    };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to load stats',
    });
  }
});
