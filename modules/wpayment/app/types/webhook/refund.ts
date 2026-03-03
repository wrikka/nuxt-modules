// Refund Types
// Stripe-compatible refund interfaces

export interface Refund {
  id: string;
  object: 'refund';
  amount?: number;
  balance_transaction?: string;
  charge: string;
  created: number;
  currency?: string;
  description?: string;
  destination_details?: RefundDestinationDetails;
  failure_balance_transaction?: string;
  failure_reason?: RefundFailureReason;
  instructions_email?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_pending_charge?: string;
  origin?: 'customer_balance' | 'stripe_connect' | 'stripe_fee';
  payment_intent?: string;
  reason?: RefundReason;
  receipt_number?: string;
  source_transfer_reversal?: string;
  status: RefundStatus;
  transfer_reversal?: string;
}

export type RefundFailureReason =
  | 'expired_or_canceled_card'
  | 'lost_or_stolen_card'
  | 'unknown';

export type RefundReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'expired_uncaptured_charge';

export type RefundStatus =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface RefundDestinationDetails {
  card?: RefundCardDetails;
  type?: string;
}

export interface RefundCardDetails {
  reference?: string;
  reference_status?: 'pending' | 'available';
  reference_type?: 'acquirer_reference_number' | 'transaction_id';
}
