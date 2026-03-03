// Invoice Types
// Stripe-compatible invoice interfaces

import type { Address } from './customer';

export interface Invoice {
  id: string;
  object: 'invoice';
  account_country?: string;
  account_name?: string;
  account_tax_ids?: string[];
  amount_due?: number;
  amount_paid?: number;
  amount_remaining?: number;
  amount_shipping?: number;
  application?: string;
  application_fee_amount?: number;
  attempt_count?: number;
  attempted?: boolean;
  auto_advance?: boolean;
  automatic_tax?: InvoiceAutomaticTax;
  billing_reason?: string;
  collection_method?: 'charge_automatically' | 'send_invoice';
  created: number;
  currency?: string;
  custom_fields?: InvoiceCustomField[];
  customer?: string;
  customer_address?: Address;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_shipping?: InvoiceShipping;
  customer_tax_exempt?: 'none' | 'exempt' | 'reverse';
  customer_tax_ids?: InvoiceCustomerTaxId[];
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discount?: InvoiceDiscount;
  discounts?: string[];
  due_date?: number;
  effective_at?: number;
  ending_balance?: number;
  footer?: string;
  from_invoice?: InvoiceFromInvoice;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  last_finalization_error?: InvoiceError;
  latest_revision?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_payment_attempt?: number;
  number?: string;
  on_behalf_of?: string;
  paid?: boolean;
  paid_out_of_band?: boolean;
  payment_intent?: string;
  payment_settings?: InvoicePaymentSettings;
  period_end?: number;
  period_start?: number;
  post_payment_credit_notes_amount?: number;
  pre_payment_credit_notes_amount?: number;
  quote?: string;
  receipt_number?: string;
  rendering_options?: InvoiceRenderingOptions;
  shipping?: InvoiceShipping;
  starting_balance?: number;
  statement_descriptor?: string;
  status?: InvoiceStatus;
  status_transitions?: InvoiceStatusTransitions;
  subscription?: string;
  subscription_details?: InvoiceSubscriptionDetails;
  subtotal?: number;
  tax?: number;
  test_clock?: string;
  total?: number;
  total_discount_amounts?: InvoiceDiscountAmount[];
  total_tax_amounts?: InvoiceTaxAmount[];
  transfer_data?: InvoiceTransferData;
  webhooks_delivered_at?: number;
}

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void';

export interface InvoiceAutomaticTax {
  enabled: boolean;
  status?: 'pending' | 'complete' | 'failed' | 'requires_location_inputs';
}

export interface InvoiceCustomField {
  name: string;
  value: string;
}

export interface InvoiceCustomerTaxId {
  type: string;
  value: string;
}

export interface InvoiceDiscount {
  coupon?: InvoiceCoupon;
}

export interface InvoiceCoupon {
  id: string;
  object: 'coupon';
  amount_off?: number;
  created?: number;
  currency?: string;
  duration: 'forever' | 'once' | 'repeating';
  duration_in_months?: number;
  livemode?: boolean;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  name?: string;
  percent_off?: number;
  redeem_by?: number;
  times_redeemed?: number;
  valid?: boolean;
}

export interface InvoiceDiscountAmount {
  amount: number;
  discount: string;
}

export interface InvoiceFromInvoice {
  invoice?: string;
  action: 'revision';
}

export interface InvoiceError {
  code?: string;
  decline_code?: string;
  doc_url?: string;
  message?: string;
  payment_intent?: string;
  payment_method?: PaymentMethod;
  type?: string;
}

export interface PaymentMethod {
  id: string;
  object: 'payment_method';
  billing_details?: BillingDetails;
  card?: Card;
  created?: number;
  customer?: string;
  livemode?: boolean;
  metadata?: Record<string, string>;
  type: string;
}

export interface BillingDetails {
  address?: Address;
  email?: string;
  name?: string;
  phone?: string;
}

export interface Card {
  brand: string;
  checks?: CardChecks;
  country?: string;
  exp_month?: number;
  exp_year?: number;
  fingerprint?: string;
  funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
  last4: string;
  network?: string;
  three_d_secure_usage?: ThreeDSecureUsage;
  wallet?: Wallet;
}

export interface CardChecks {
  address_line1_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  address_postal_code_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface ThreeDSecureUsage {
  supported: boolean;
}

export interface Wallet {
  type: 'apple_pay' | 'google_pay' | 'link' | 'samsung_pay';
}

export interface InvoicePaymentSettings {
  default_mandate?: string;
  payment_method_options?: InvoicePaymentMethodOptions;
  payment_method_types?: string[];
}

export interface InvoicePaymentMethodOptions {
  acss_debit?: InvoiceAcssDebitOptions;
  bancontact?: InvoiceBancontactOptions;
  card?: InvoiceCardOptions;
  customer_balance?: InvoiceCustomerBalanceOptions;
  konbini?: InvoiceKonbiniOptions;
  sepa_debit?: InvoiceSepaDebitOptions;
  us_bank_account?: InvoiceUsBankAccountOptions;
}

export interface InvoiceAcssDebitOptions {}
export interface InvoiceBancontactOptions {}
export interface InvoiceCardOptions {}
export interface InvoiceCustomerBalanceOptions {}
export interface InvoiceKonbiniOptions {}
export interface InvoiceSepaDebitOptions {}
export interface InvoiceUsBankAccountOptions {}

export interface InvoiceRenderingOptions {
  amount_tax_display?: 'exclude_tax' | 'include_tax';
}

export interface InvoiceShipping {
  address?: Address;
  name?: string;
  phone?: string;
}

export interface InvoiceStatusTransitions {
  finalized_at?: number;
  marked_uncollectible_at?: number;
  paid_at?: number;
  voided_at?: number;
}

export interface InvoiceSubscriptionDetails {
  metadata?: Record<string, string>;
}

export interface InvoiceTaxAmount {
  amount: number;
  inclusive?: boolean;
  tax_rate?: string;
  tax_behavior?: 'inclusive' | 'exclusive';
}

export interface InvoiceTransferData {
  destination: string;
  amount?: number;
}
