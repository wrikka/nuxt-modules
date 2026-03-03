import type { StripeDiscount, StripeCustomerDetails } from './customer';
import type { StripeAddress } from './stripe-config';

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
