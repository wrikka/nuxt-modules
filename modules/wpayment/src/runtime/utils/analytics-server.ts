import Stripe from 'stripe';
import { getStripe } from './stripe-server';
import type { Balance, BalanceTransaction, ListBalanceTransactionsParams } from '#wpayment/types';

export async function retrieveBalance(): Promise<Balance> {
  const stripe = getStripe();
  const balance = await stripe.balance.retrieve();
  return balance as unknown as Balance;
}

export async function listBalanceTransactions(
  params?: ListBalanceTransactionsParams,
): Promise<BalanceTransaction[]> {
  const stripe = getStripe();

  const transactions = await stripe.balanceTransactions.list({
    payout: params?.payout,
    type: params?.type as Stripe.BalanceTransactionsListParams.Type,
    created: params?.created,
    currency: params?.currency,
    ending_before: params?.ending_before,
    limit: params?.limit,
    starting_after: params?.starting_after,
  });

  return transactions.data as unknown as BalanceTransaction[];
}

export async function retrieveBalanceTransaction(
  transactionId: string,
): Promise<BalanceTransaction> {
  const stripe = getStripe();
  const transaction = await stripe.balanceTransactions.retrieve(transactionId);
  return transaction as unknown as BalanceTransaction;
}

// Analytics helpers
export async function getRevenueStats(params: {
  startDate: number;
  endDate: number;
}): Promise<{
  total: number;
  count: number;
  byCurrency: Record<string, { total: number; count: number; }>;
}> {
  const stripe = getStripe();

  const charges = await stripe.charges.list({
    created: {
      gte: params.startDate,
      lte: params.endDate,
    },
    limit: 100,
  });

  const stats = {
    total: 0,
    count: 0,
    byCurrency: {} as Record<string, { total: number; count: number; }>,
  };

  for (const charge of charges.data) {
    if (charge.paid && !charge.refunded) {
      stats.total += charge.amount;
      stats.count += 1;

      if (!stats.byCurrency[charge.currency]) {
        stats.byCurrency[charge.currency] = { total: 0, count: 0 };
      }

      stats.byCurrency[charge.currency].total += charge.amount;
      stats.byCurrency[charge.currency].count += 1;
    }
  }

  return stats;
}

export async function getPaymentStats(params: {
  startDate: number;
  endDate: number;
}): Promise<{
  successful: number;
  failed: number;
  pending: number;
  total: number;
}> {
  const stripe = getStripe();

  const paymentIntents = await stripe.paymentIntents.list({
    created: {
      gte: params.startDate,
      lte: params.endDate,
    },
    limit: 100,
  });

  const stats = {
    successful: 0,
    failed: 0,
    pending: 0,
    total: 0,
  };

  for (const intent of paymentIntents.data) {
    stats.total += 1;

    switch (intent.status) {
      case 'succeeded':
        stats.successful += 1;
        break;
      case 'canceled':
      case 'requires_payment_method':
        stats.failed += 1;
        break;
      default:
        stats.pending += 1;
    }
  }

  return stats;
}

export async function getSubscriptionStats(): Promise<{
  active: number;
  pastDue: number;
  canceled: number;
  trialing: number;
  total: number;
}> {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    limit: 100,
  });

  const stats = {
    active: 0,
    pastDue: 0,
    canceled: 0,
    trialing: 0,
    total: subscriptions.data.length,
  };

  for (const sub of subscriptions.data) {
    switch (sub.status) {
      case 'active':
        stats.active += 1;
        break;
      case 'past_due':
        stats.pastDue += 1;
        break;
      case 'canceled':
        stats.canceled += 1;
        break;
      case 'trialing':
        stats.trialing += 1;
        break;
    }
  }

  return stats;
}

export async function getCustomerStats(): Promise<{
  total: number;
  newThisMonth: number;
}> {
  const stripe = getStripe();

  const customers = await stripe.customers.list({
    limit: 100,
  });

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

  let newThisMonth = 0;

  for (const customer of customers.data) {
    if (customer.created >= thirtyDaysAgo) {
      newThisMonth += 1;
    }
  }

  return {
    total: customers.data.length,
    newThisMonth,
  };
}
