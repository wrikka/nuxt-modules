// Payment Intent Types
// Stripe-compatible payment intent interfaces

export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable?: number;
  amount_received?: number;
  application?: string;
  application_fee_amount?: number;
  automatic_payment_methods?: AutomaticPaymentMethods;
  canceled_at?: number;
  cancellation_reason?: CancellationReason;
  capture_method: 'automatic' | 'automatic_async' | 'manual';
  client_secret?: string;
  confirmation_method: 'automatic' | 'manual';
  created: number;
  currency: string;
  customer?: string;
  description?: string;
  invoice?: string;
  last_payment_error?: PaymentError;
  latest_charge?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_action?: NextAction;
  on_behalf_of?: string;
  payment_method?: string;
  payment_method_configuration_details?: PaymentMethodConfig;
  payment_method_options?: PaymentMethodOptions;
  payment_method_types: string[];
  processing?: Processing;
  receipt_email?: string;
  review?: string;
  setup_future_usage?: 'on_session' | 'off_session';
  shipping?: Shipping;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status: PaymentIntentStatus;
  transfer_data?: TransferData;
  transfer_group?: string;
}

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export type CancellationReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'abandoned'
  | 'auto_incomplete';

export interface AutomaticPaymentMethods {
  allow_redirects?: 'always' | 'never';
  enabled: boolean;
}

export interface PaymentError {
  code?: string;
  decline_code?: string;
  message?: string;
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

export interface Address {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface Card {
  brand: string;
  checks?: CardChecks;
  country?: string;
  exp_month: number;
  exp_year: number;
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

export interface NextAction {
  type: 'use_stripe_sdk' | 'alipay_handle_redirect' | 'oxxo_display_details' | 'verify_with_microdeposits';
  use_stripe_sdk?: StripeSDK;
  alipay_handle_redirect?: AlipayRedirect;
}

export interface StripeSDK {
  type: 'three_d_secure_redirect' | 'three_d_secure_redirect_app';
  stripe_js?: string;
}

export interface AlipayRedirect {
  native_url?: string;
  return_url?: string;
  url?: string;
}

export interface PaymentMethodConfig {
  id?: string;
  parent?: string;
}

export interface PaymentMethodOptions {
  acss_debit?: PaymentMethodOption;
  affirm?: PaymentMethodOption;
  afterpay_clearpay?: PaymentMethodOption;
  alipay?: PaymentMethodOption;
  au_becs_debit?: PaymentMethodOption;
  bacs_debit?: PaymentMethodOption;
  bancontact?: PaymentMethodOption;
  blik?: PaymentMethodOption;
  boleto?: PaymentMethodOption;
  card?: CardOptions;
  cashapp?: PaymentMethodOption;
  customer_balance?: PaymentMethodOption;
  eps?: PaymentMethodOption;
  fpx?: PaymentMethodOption;
  giropay?: PaymentMethodOption;
  grabpay?: PaymentMethodOption;
  ideal?: PaymentMethodOption;
  klarna?: PaymentMethodOption;
  konbini?: PaymentMethodOption;
  link?: PaymentMethodOption;
  oxxo?: PaymentMethodOption;
  p24?: PaymentMethodOption;
  paynow?: PaymentMethodOption;
  paypal?: PaymentMethodOption;
  pix?: PaymentMethodOption;
  promptpay?: PaymentMethodOption;
  sepa_debit?: PaymentMethodOption;
  sofort?: PaymentMethodOption;
  us_bank_account?: PaymentMethodOption;
  wechat_pay?: PaymentMethodOption;
  zip?: PaymentMethodOption;
}

export interface PaymentMethodOption {
  preferred?: boolean;
}

export interface CardOptions extends PaymentMethodOption {
  installments?: Installments;
  mandate_options?: MandateOptions;
  network?: string;
  request_three_d_secure?: 'automatic' | 'any' | 'challenge_only';
}

export interface Installments {
  available_plans?: InstallmentPlan[];
  enabled: boolean;
  plan?: SelectedPlan;
}

export interface InstallmentPlan {
  count: number;
  interval: 'month';
  type: 'fixed_count';
}

export interface SelectedPlan {
  count: number;
  interval: 'month';
  type: 'fixed_count';
}

export interface MandateOptions {
  amount_type?: 'fixed' | 'maximum';
  reference?: string;
  description?: string;
}

export interface Processing {
  card?: CardProcessing;
}

export interface CardProcessing {
  customer_notification?: CustomerNotification;
}

export interface CustomerNotification {
  approval_requested: boolean;
  preferred_locale?: string;
}

export interface Shipping {
  address: Address;
  carrier?: string;
  name: string;
  phone?: string;
  tracking_number?: string;
}

export interface TransferData {
  amount?: number;
  destination: string;
}
