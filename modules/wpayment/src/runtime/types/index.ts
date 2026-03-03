import type { Stripe, StripeElement, StripeElements } from '@stripe/stripe-js';
import type { Ref } from 'vue';

// Re-export all types from separate files
export * from './analytics';
export * from './connect';
export * from './coupon-ui';
export * from './currency';
export * from './customer-ui';
export * from './dashboard';
export * from './express-checkout';
export * from './invoice';
export * from './invoice-ui';
export * from './payment-link';
export * from './payment-method';
export * from './payment-method-ui';
export * from './payment-options';
export * from './portal';
export * from './price';
export * from './promo';
export * from './radar';
export * from './refund';
export * from './refund-ui';
export * from './security';
export * from './subscription';
export * from './subscription-ui';
export * from './tax';
export * from './tax-ui';
export * from './webhook';
export * from './webhook-viewer';
export * from './wizard';

// Configuration
export interface StripeConfig {
  publishableKey: string;
  apiVersion?: string;
  locale?: string;
  elementsOptions?: StripeElementsOptions;
  confirmParams?: StripeConfirmParams;
}

export interface StripeElementsOptions {
  appearance?: StripeAppearance;
  clientSecret?: string;
  fonts?: StripeFont[];
  locale?: string;
  mode?: 'payment' | 'subscription' | 'setup';
  amount?: number;
  currency?: string;
  paymentMethodCreation?: string;
  paymentMethodTypes?: string[];
}

export interface StripeAppearance {
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variables?: Record<string, any>;
  rules?: Record<string, any>;
  labels?: 'above' | 'floating' | 'hidden';
}

export interface StripeFont {
  family?: string;
  src?: string;
  weight?: string | number;
  style?: string;
  display?: string;
}

export interface StripeConfirmParams {
  return_url?: string;
  payment_method_data?: {
    billing_details?: StripeBillingDetails;
  };
  save_payment_method?: boolean;
  setup_future_usage?: 'off_session' | 'on_session';
}

export interface StripeBillingDetails {
  email?: string;
  phone?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  name?: string;
}

// API Types
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

export interface StripeShipping {
  address: StripeAddress;
  name: string;
  phone?: string;
  tracking?: {
    number: string;
    carrier: string;
    url: string;
  };
}

export interface StripeAddress {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface StripeTransferData {
  destination: string;
  amount?: number;
}

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

export interface Customer {
  id: string;
  object: 'customer';
  address?: StripeAddress;
  balance?: number;
  created: number;
  currency?: string;
  default_source?: string;
  delinquent?: boolean;
  description?: string;
  discount?: StripeDiscount;
  email?: string;
  invoice_prefix?: string;
  invoice_settings?: StripeInvoiceSettings;
  livemode: boolean;
  metadata?: Record<string, string>;
  name?: string;
  next_invoice_sequence?: number;
  phone?: string;
  preferred_locales?: string[];
  shipping?: StripeShipping;
  tax_exempt?: 'none' | 'exempt' | 'reverse';
  test_clock?: string;
}

export interface StripeDiscount {
  object: 'discount';
  coupon?: StripeCoupon;
  customer?: string;
  end?: number;
  start?: number;
  subscription?: string;
}

export interface StripeCoupon {
  id: string;
  object: 'coupon';
  amount_off?: number;
  created: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  livemode: boolean;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  percent_off?: number;
  redeem_by?: number;
  times_redeemed?: number;
  valid?: boolean;
}

export interface StripeInvoiceSettings {
  custom_fields?: StripeInvoiceCustomField[];
  default_payment_method?: string;
  footer?: string;
  rendering_options?: StripeRenderingOptions;
}

export interface StripeInvoiceCustomField {
  name: string;
  value: string;
}

export interface StripeRenderingOptions {
  amount_tax_display?: 'exclude_tax' | 'include_tax' | 'unspecified';
}

export interface CheckoutSession {
  id: string;
  object: 'checkout.session';
  after_expiration?: StripeAfterExpiration;
  allow_promotion_codes?: boolean;
  amount_subtotal?: number;
  amount_total?: number;
  automatic_tax?: StripeAutomaticTax;
  billing_address_collection?: StripeBillingAddressCollection;
  cancel_url: string;
  client_reference_id?: string;
  consent?: StripeConsent;
  consent_collection?: StripeConsentCollection;
  created: number;
  currency?: string;
  custom_fields?: StripeCustomField[];
  custom_text?: StripeCustomText;
  customer?: string;
  customer_creation?: string;
  customer_details?: StripeCustomerDetails;
  customer_email?: string;
  details_submission?: StripeDetailsSubmission;
  discounts?: StripeDiscount[];
  expires_at?: number;
  invoice?: string;
  invoice_creation?: StripeInvoiceCreation;
  livemode: boolean;
  locale?: string;
  metadata?: Record<string, string>;
  mode?: CheckoutSessionMode;
  payment_intent?: string;
  payment_link?: string;
  payment_method_collection?: StripePaymentMethodCollection;
  payment_method_options?: StripePaymentMethodOptions;
  payment_method_types?: string[];
  payment_status?: CheckoutSessionPaymentStatus;
  phone_number_collection?: StripePhoneNumberCollection;
  redemption?: StripeRedemption;
  shipping_address_collection?: StripeShippingAddressCollection;
  shipping_cost?: StripeShippingCost;
  shipping_details?: StripeShippingDetails;
  shipping_options?: StripeShippingOption[];
  status: CheckoutSessionStatus;
  submit_type?: CheckoutSessionSubmitType;
  subscription?: string;
  success_url: string;
  total_details?: StripeTotalDetails;
  url?: string;
}

export type CheckoutSessionMode = 'payment' | 'subscription' | 'setup';

export type CheckoutSessionPaymentStatus =
  | 'auto'
  | 'manual'
  | 'paid'
  | 'unpaid'
  | 'no_payment_required';

export type CheckoutSessionStatus =
  | 'open'
  | 'complete'
  | 'expired';

export type CheckoutSessionSubmitType = 'auto' | 'book' | 'pay' | 'submit';

export interface StripeAfterExpiration {
  hosted_invoice_url?: string;
  status: StripeAfterExpirationStatus;
}

export type StripeAfterExpirationStatus = 'payment_failed' | 'processing';

export interface StripeAutomaticTax {
  enabled: boolean;
  liability?: StripeLiability;
  status?: StripeAutomaticTaxStatus;
}

export type StripeAutomaticTaxStatus = 'failed' | 'location_supported' | 'not_supported';

export interface StripeLiability {
  type: string;
  reference?: string;
}

export interface StripeBillingAddressCollection {
  enabled: boolean;
  required?: boolean;
}

export interface StripeConsent {
  promotions?: string;
  terms_of_service?: string;
}

export interface StripeConsentCollection {
  promotions?: string;
  terms_of_service?: string;
}

export interface StripeCustomField {
  key?: string;
  label?: StripeCustomFieldLabel;
  optional?: boolean;
  type: 'text';
  text?: StripeCustomFieldText;
}

export interface StripeCustomFieldLabel {
  custom?: string;
  type: 'custom' | 'preset';
  preset?: string;
}

export interface StripeCustomFieldText {
  default?: string;
  maximum_length?: number;
  minimum_length?: number;
  type: 'text';
}

export interface StripeCustomText {
  after_submit?: StripeCustomTextContent;
  submit?: StripeCustomTextContent;
  terms_of_service_acceptance?: StripeCustomTextTermsOfServiceAcceptance;
}

export interface StripeCustomTextContent {
  custom?: string;
  type: 'custom' | 'preset';
  preset?: string;
}

export interface StripeCustomTextTermsOfServiceAcceptance {
  message?: string;
}

export interface StripeCustomerDetails {
  address?: StripeAddress;
  email?: string;
  name?: string;
  phone?: string;
  tax_exempt?: string;
  tax_ids?: StripeTaxId[];
}

export interface StripeTaxId {
  country: string;
  type: string;
  value: string;
}

export interface StripeDetailsSubmission {
  published_key?: string;
  status?: StripeDetailsSubmissionStatus;
}

export type StripeDetailsSubmissionStatus = 'enabled' | 'disabled';

export interface StripeInvoiceCreation {
  enabled: boolean;
}

export interface StripePaymentMethodCollection {
  type: 'always' | 'if_required';
}

export interface StripePaymentMethodOptions {
  card?: StripePaymentMethodCardOptions;
  klarna?: StripePaymentMethodKlarnaOptions;
  link?: StripePaymentMethodLinkOptions;
  sepa_debit?: StripePaymentMethodSepaDebitOptions;
  sofort?: StripePaymentMethodSofortOptions;
  us_bank_account?: StripePaymentMethodUsBankAccountOptions;
}

export interface StripePaymentMethodCardOptions {
  request_three_d_secure?: 'automatic' | 'any';
}

export interface StripePaymentMethodKlarnaOptions {
  preferred_locale?: string;
}

export interface StripePaymentMethodLinkOptions {
  persistent_token?: string;
}

export interface StripePaymentMethodSepaDebitOptions {
  mandate_options?: StripeMandateOptions;
}

export interface StripeMandateOptions {
  description?: string;
}

export interface StripePaymentMethodSofortOptions {
  country?: string;
  preferred_language?: string;
}

export interface StripePaymentMethodUsBankAccountOptions {
  verification_method?: 'instant' | 'automatic' | 'manual';
}

export interface StripePhoneNumberCollection {
  enabled: boolean;
}

export interface StripeRedemption {
  customer?: string;
  discount?: string;
  promotion_code?: string;
}

export interface StripeShippingAddressCollection {
  allowed_countries?: string[];
}

export interface StripeShippingCost {
  amount_subtotal?: number;
  amount_tax?: number;
  amount_total?: number;
  shipping_rate?: string;
}

export interface StripeShippingDetails {
  address?: StripeAddress;
  name?: string;
}

export interface StripeShippingOption {
  shipping_amount?: number;
  shipping_rate?: string;
}

export interface StripeTotalDetails {
  amount_discount?: number;
  amount_shipping?: number;
  amount_tax?: number;
}

export interface Product {
  id: string;
  object: 'product';
  active: boolean;
  attributes?: string[];
  created: number;
  default_price?: string;
  description?: string;
  images?: string[];
  livemode: boolean;
  metadata?: Record<string, string>;
  name: string;
  package_dimensions?: StripePackageDimensions;
  shippable?: boolean;
  statement_descriptor?: string;
  tax_code?: string;
  type?: 'good' | 'service';
  unit_label?: string;
  updated: number;
  url?: string;
}

export interface StripePackageDimensions {
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface Price {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme?: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  custom_unit_amount?: number;
  livemode: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  product: string;
  recurring?: StripePriceRecurring;
  tiers?: StripePriceTier[];
  tiers_mode?: 'graduated' | 'volume';
  transform_quantity?: StripeTransformQuantity;
  type: 'one_time' | 'recurring';
  unit_amount?: number;
  unit_amount_decimal?: string;
}

export interface StripePriceRecurring {
  aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  period?: StripePriceRecurringPeriod;
  trial_period_days?: number;
  usage_type?: 'licensed' | 'metered';
}

export interface StripePriceRecurringPeriod {
  end: number;
  start: number;
}

export interface StripePriceTier {
  amount?: number;
  flat_amount?: number;
  flat_amount_decimal?: string;
  unit_amount?: number;
  unit_amount_decimal?: string;
  up_to?: number;
}

export interface StripeTransformQuantity {
  divide_by: number;
  round: 'down' | 'up';
}

export interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
    };
    unit_amount: number;
    recurring?: StripePriceRecurring;
  };
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  object: 'payment_method';
  billing_details?: StripeBillingDetails;
  created: number;
  customer?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  type: PaymentMethodType;
  card?: StripeCard;
  sepa_debit?: StripeSepaDebit;
  ideal?: StripeIdeal;
}

export type PaymentMethodType =
  | 'card'
  | 'sepa_debit'
  | 'ideal'
  | 'bancontact'
  | 'giropay'
  | 'eps'
  | 'sofort'
  | 'p24'
  | 'alipay'
  | 'klarna'
  | 'afterpay_clearpay'
  | 'acss_debit'
  | 'affirm'
  | 'au_becs_debit'
  | 'bacs_debit'
  | 'boleto'
  | 'grabpay'
  | 'oxxo'
  | 'fpx'
  | 'wechat_pay'
  | 'link';

export interface StripeCard {
  brand: string;
  checks?: StripeCardChecks;
  country: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
  generated_from?: StripeCardGeneratedFrom;
  last4: string;
  three_d_secure_usage?: StripeCardThreeDSecureUsage;
  wallet?: StripeWallet;
}

export interface StripeCardChecks {
  address_line1_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  address_postal_code_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface StripeCardGeneratedFrom {
  charge?: string;
  credit?: string;
  type: string;
}

export interface StripeCardThreeDSecureUsage {
  supported: boolean;
}

export interface StripeWallet {
  amex_express_checkout?: StripeWalletAmexExpressCheckout;
  apple_pay?: StripeWalletApplePay;
  google_pay?: StripeWalletGooglePay;
  link?: StripeWalletLink;
  masterpass?: StripeWalletMasterpass;
  samsung_pay?: StripeWalletSamsungPay;
  visa_checkout?: StripeWalletVisaCheckout;
  type: string;
}

export interface StripeWalletAmexExpressCheckout {}

export interface StripeWalletApplePay {}

export interface StripeWalletGooglePay {}

export interface StripeWalletLink {}

export interface StripeWalletMasterpass {}

export interface StripeWalletSamsungPay {}

export interface StripeWalletVisaCheckout {}

export interface StripeSepaDebit {
  bank_code: string;
  branch_code: string;
  checks?: StripeSepaDebitChecks;
  country: string;
  fingerprint: string;
  last4: string;
  mandate_reference?: string;
}

export interface StripeSepaDebitChecks {
  verification_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface StripeIdeal {
  bank: string;
  bic?: string;
  iban_last4?: string;
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

// Composables Return Types
export interface UseStripeReturn {
  stripe: Readonly<Ref<Stripe | null>>;
  elements: Readonly<Ref<StripeElements | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  initialize: () => Promise<void>;
  createElements: (options?: StripeElementsOptions) => void;
  confirmPayment: (
    clientSecret: string,
    elements?: StripeElements,
    confirmParams?: StripeConfirmParams,
  ) => Promise<PaymentResult>;
  confirmCardPayment: (
    clientSecret: string,
    data?: any,
    confirmParams?: StripeConfirmParams,
  ) => Promise<PaymentResult>;
  retrievePaymentIntent: (clientSecret: string) => Promise<Stripe.RetrievePaymentIntentResult>;
}

export interface UseStripeElementsReturn {
  elements: Readonly<Ref<StripeElements | null>>;
  error: Readonly<Ref<string | null>>;
  createElement: (type: string, options?: any) => StripeElement | null;
  getElement: (type: string) => StripeElement | null;
  update: (options: StripeElementsOptions) => void;
  clear: () => void;
  focus: (type: string) => void;
  blur: (type: string) => void;
  destroy: (type: string) => void;
}

export interface PaymentResult {
  paymentIntent?: PaymentIntent;
  error?: StripeError;
}

// Component Props
export interface StripeElementsProps {
  elementsOptions?: StripeElementsOptions;
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variant?: 'default' | 'outlined' | 'filled';
  appearance?: StripeAppearance;
}

export interface StripeCardProps {
  options?: {
    hidePostalCode?: boolean;
    disabled?: boolean;
    style?: Record<string, any>;
  };
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variant?: 'default' | 'outlined' | 'filled';
}

export interface StripePaymentButtonProps {
  clientSecret: string;
  text?: string;
  processingText?: string;
  disabled?: boolean;
  elements?: StripeElements;
  confirmParams?: StripeConfirmParams;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Plugin Injection Types
export interface StripePluginState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

export interface StripePluginConfig extends StripeConfig {}
