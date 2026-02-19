import type { Ref } from 'vue';

// Create Refund Params
export interface CreateRefundParams {
  charge?: string;
  payment_intent?: string;
  amount?: number;
  currency?: string;
  description?: string;
  destination?: {
    account?: string;
    type?: 'card_or_bank_account';
  };
  instructions_email?: string;
  metadata?: Record<string, string>;
  origin?: 'customer_balance' | 'stripe_connect' | 'stripe_fee';
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  refund_application_fee?: boolean;
  reverse_transfer?: boolean;
}

// Update Refund Params
export interface UpdateRefundParams {
  metadata?: Record<string, string>;
}

// Cancel Refund Params
export interface CancelRefundParams {
  refundId: string;
}

// Composable Return Types
export interface UseRefundReturn {
  refund: Readonly<Ref<import('./webhook').Refund | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateRefundParams) => Promise<import('./webhook').Refund>;
  retrieve: (refundId: string) => Promise<import('./webhook').Refund>;
  update: (refundId: string, params: UpdateRefundParams) => Promise<import('./webhook').Refund>;
  cancel: (refundId: string) => Promise<import('./webhook').Refund>;
  list: (params?: ListRefundsParams) => Promise<import('./webhook').Refund[]>;
}

export interface ListRefundsParams {
  charge?: string;
  payment_intent?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}

// Refund Reason Options for UI
export interface RefundReasonOption {
  value: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  label: string;
  description: string;
}

export const REFUND_REASON_OPTIONS: RefundReasonOption[] = [
  {
    value: 'duplicate',
    label: 'Duplicate',
    description: 'The charge was a duplicate of a previous charge',
  },
  {
    value: 'fraudulent',
    label: 'Fraudulent',
    description: 'The charge was fraudulent',
  },
  {
    value: 'requested_by_customer',
    label: 'Requested by Customer',
    description: 'The customer requested the refund',
  },
  {
    value: 'expired_uncaptured_charge',
    label: 'Expired Uncaptured Charge',
    description: 'The charge expired before it could be captured',
  },
];
