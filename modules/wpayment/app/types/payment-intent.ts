import type { StripeShipping, StripeTransferData, StripeAddress } from './stripe-config';

export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  client_secret?: string;
  customer?: string;
  payment_method?: string;
  payment_method_types?: string[];
  confirmation_method?: 'automatic' | 'manual';
  created: number;
  description?: string;
  metadata?: Record<string, string>;
  receipt_email?: string;
  shipping?: StripeShipping;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  transfer_data?: StripeTransferData;
  transfer_group?: string;
  last_payment_error?: StripeError;
  next_action?: StripeNextAction;
  processing?: boolean;
  cancellation_reason?: PaymentIntentCancellationReason;
}

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled'
  | 'requires_capture';

export type PaymentIntentCancellationReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'abandoned'
  | 'failed_invoice'
  | 'void_invoice'
  | 'automatic';

export interface StripeNextAction {
  type: string;
  redirect_to_url?: {
    url: string;
    return_url?: string;
  };
  use_stripe_sdk?: {
    type: string;
    merchant_country?: string;
  };
  verify_with_microdeposits?: {
    amounts?: number[];
    verification_method?: string;
    arrival_date?: number;
  };
  offline_redirect_to_url?: {
    url: string;
    return_url?: string;
  };
}

export interface StripeError {
  type: StripeErrorType;
  charge?: string;
  code?: string;
  decline_code?: string;
  doc_url?: string;
  message: string;
  param?: string;
  payment_intent?: string;
  payment_method?: string;
  setup_intent?: string;
  source?: string;
}

export type StripeErrorType =
  | 'api_connection_error'
  | 'api_error'
  | 'authentication_error'
  | 'card_error'
  | 'idempotency_error'
  | 'invalid_request_error'
  | 'rate_limit_error';
