import { getStripe } from './stripe-server';
import type { CreateRefundParams, ListRefundsParams, Refund, UpdateRefundParams } from '#wpayment/types';

export async function createRefund(params: CreateRefundParams): Promise<Refund> {
  const stripe = getStripe();

  const refund = await stripe.refunds.create({
    charge: params.charge,
    payment_intent: params.payment_intent,
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    destination: params.destination,
    instructions_email: params.instructions_email,
    metadata: params.metadata,
    origin: params.origin,
    reason: params.reason,
    refund_application_fee: params.refund_application_fee,
    reverse_transfer: params.reverse_transfer,
  });

  return refund as unknown as Refund;
}

export async function retrieveRefund(refundId: string): Promise<Refund> {
  const stripe = getStripe();
  const refund = await stripe.refunds.retrieve(refundId);
  return refund as unknown as Refund;
}

export async function updateRefund(
  refundId: string,
  params: UpdateRefundParams,
): Promise<Refund> {
  const stripe = getStripe();

  const refund = await stripe.refunds.update(refundId, {
    metadata: params.metadata,
  });

  return refund as unknown as Refund;
}

export async function cancelRefund(refundId: string): Promise<Refund> {
  const stripe = getStripe();
  const refund = await stripe.refunds.cancel(refundId);
  return refund as unknown as Refund;
}

export async function listRefunds(params?: ListRefundsParams): Promise<Refund[]> {
  const stripe = getStripe();

  const refunds = await stripe.refunds.list({
    charge: params?.charge,
    payment_intent: params?.payment_intent,
    limit: params?.limit,
    starting_after: params?.starting_after,
    ending_before: params?.ending_before,
  });

  return refunds.data as unknown as Refund[];
}

export async function calculateRefundAmount(params: {
  chargeId: string;
  amount?: number;
}): Promise<{
  maxRefundAmount: number;
  suggestedAmount: number;
  currency: string;
}> {
  const stripe = getStripe();

  const charge = await stripe.charges.retrieve(params.chargeId);

  const maxRefundAmount = charge.amount - charge.amount_refunded;

  return {
    maxRefundAmount,
    suggestedAmount: params.amount || maxRefundAmount,
    currency: charge.currency,
  };
}
