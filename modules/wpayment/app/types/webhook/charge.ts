// Charge Types
// Stripe-compatible charge interfaces

import type { Address } from './customer';

export interface Charge {
  id: string;
  object: 'charge';
  amount: number;
  amount_captured?: number;
  amount_refunded?: number;
  application?: string;
  application_fee?: string;
  application_fee_amount?: number;
  balance_transaction?: string;
  billing_details?: BillingDetails;
  calculated_statement_descriptor?: string;
  captured?: boolean;
  created: number;
  currency: string;
  customer?: string;
  description?: string;
  destination?: string;
  dispute?: string;
  disputed?: boolean;
  failure_balance_transaction?: string;
  failure_code?: string;
  failure_message?: string;
  fraud_details?: ChargeFraudDetails;
  invoice?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  on_behalf_of?: string;
  order?: string;
  outcome?: ChargeOutcome;
  paid?: boolean;
  payment_intent?: string;
  payment_method?: string;
  payment_method_details?: ChargePaymentMethodDetails;
  radar_options?: ChargeRadarOptions;
  receipt_email?: string;
  receipt_number?: string;
  receipt_url?: string;
  refunded?: boolean;
  review?: string;
  shipping?: Shipping;
  source?: string;
  source_transfer?: string;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status: ChargeStatus;
  transfer?: string;
  transfer_data?: ChargeTransferData;
  transfer_group?: string;
}

export type ChargeStatus =
  | 'succeeded'
  | 'pending'
  | 'failed';

export interface BillingDetails {
  address?: Address;
  email?: string;
  name?: string;
  phone?: string;
}

export interface Shipping {
  address: Address;
  carrier?: string;
  name: string;
  phone?: string;
  tracking_number?: string;
}

export interface ChargeFraudDetails {
  stripe_report?: 'fraudulent' | 'safe';
  user_report?: 'fraudulent' | 'safe';
}

export interface ChargeOutcome {
  network_status?: 'approved_by_network' | 'declined_by_network' | 'not_sent_to_network' | 'reversed_after_approval';
  reason?: string;
  risk_level?: 'normal' | 'elevated' | 'highest' | 'not_assessed' | 'unknown';
  risk_score?: number;
  rule?: string;
  seller_message?: string;
  type?: 'authorized' | 'manual_review' | 'issuer_declined' | 'blocked' | 'invalid';
}

export interface ChargePaymentMethodDetails {
  card?: ChargeCardDetails;
  type: string;
}

export interface ChargeCardDetails {
  brand: string;
  checks?: ChargeCardChecks;
  country?: string;
  exp_month?: number;
  exp_year?: number;
  fingerprint?: string;
  funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
  installments?: ChargeCardInstallments;
  last4?: string;
  mandate?: string;
  network?: string;
  three_d_secure?: ChargeCardThreeDSecure;
  wallet?: ChargeCardWallet;
}

export interface ChargeCardChecks {
  address_line1_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  address_postal_code_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface ChargeCardInstallments {
  plan?: ChargeCardInstallmentPlan;
}

export interface ChargeCardInstallmentPlan {
  count?: number;
  interval?: 'month';
  type?: 'fixed_count';
}

export interface ChargeCardThreeDSecure {
  authentication_flow?: 'challenge' | 'frictionless';
  result?: 'authenticated' | 'attempt_acknowledged' | 'failed' | 'not_supported';
  result_reason?: string;
  version?: string;
}

export interface ChargeCardWallet {
  type?: 'apple_pay' | 'google_pay' | 'link' | 'samsung_pay';
}

export interface ChargeRadarOptions {}

export interface ChargeTransferData {
  destination: string;
  amount?: number;
}
