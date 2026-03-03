// Checkout Session Types
// Stripe-compatible checkout session interfaces

export interface CheckoutSession {
  id: string;
  object: 'checkout.session';
  after_expiration?: AfterExpiration;
  allow_promotion_codes?: boolean;
  amount_subtotal?: number;
  amount_total?: number;
  automatic_tax?: AutomaticTax;
  billing_address_collection?: 'required' | 'auto';
  cancel_url?: string;
  client_reference_id?: string;
  consent?: Consent;
  consent_collection?: ConsentCollection;
  created: number;
  currency?: string;
  currency_conversion?: CurrencyConversion;
  custom_fields?: CustomField[];
  custom_text?: CustomText;
  customer?: string;
  customer_creation?: 'always' | 'if_required';
  customer_details?: CustomerDetails;
  customer_email?: string;
  expires_at: number;
  invoice?: string;
  invoice_creation?: InvoiceCreation;
  line_items?: LineItem[];
  livemode: boolean;
  locale?: string;
  metadata?: Record<string, string>;
  mode: 'payment' | 'setup' | 'subscription';
  payment_intent?: string;
  payment_link?: string;
  payment_method_collection?: 'always' | 'if_required';
  payment_method_options?: PaymentMethodOptions;
  payment_method_types?: string[];
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  phone_number_collection?: PhoneNumberCollection;
  recovered_from?: string;
  redirect_on_completion?: 'always' | 'never' | 'if_required';
  return_url?: string;
  saved_payment_method_options?: SavedPaymentMethodOptions;
  setup_intent?: string;
  shipping_address_collection?: ShippingAddressCollection;
  shipping_cost?: ShippingCost;
  shipping_details?: ShippingDetails;
  shipping_options?: ShippingOption[];
  status: 'open' | 'complete' | 'expired';
  submit_type?: 'auto' | 'book' | 'donate' | 'pay';
  subscription?: string;
  success_url?: string;
  total_details?: TotalDetails;
  url?: string;
  ui_mode?: 'embedded' | 'hosted';
}

export interface AfterExpiration {
  recovery?: Recovery;
}

export interface Recovery {
  allow_promotion_codes?: boolean;
  enabled: boolean;
  expires_at?: number;
  url?: string;
}

export interface AutomaticTax {
  enabled: boolean;
  status?: 'complete' | 'failed' | 'requires_location_inputs' | 'pending';
}

export interface Consent {
  promotions?: 'opt_in' | 'opt_out';
  terms_of_service?: 'accepted';
}

export interface ConsentCollection {
  payment_method_reuse_agreement?: 'auto' | 'hidden';
  promotions?: 'auto' | 'hidden';
  terms_of_service?: 'required' | 'none';
}

export interface CurrencyConversion {
  amount_subtotal?: number;
  amount_total?: number;
  fx_rate?: string;
  source_currency?: string;
}

export interface CustomField {
  dropdown?: Dropdown;
  key: string;
  label: Label;
  numeric?: Numeric;
  optional: boolean;
  text?: Text;
  type: 'text' | 'numeric' | 'dropdown';
}

export interface Dropdown {
  options: Option[];
  value?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface Label {
  custom: string;
  type: 'custom';
}

export interface Numeric {
  maximum_length?: number;
  minimum_length?: number;
  value?: string;
}

export interface Text {
  maximum_length?: number;
  minimum_length?: number;
  value?: string;
}

export interface CustomText {
  after_submit?: Message;
  shipping_address?: Message;
  submit?: Message;
  terms_of_service_acceptance?: Message;
}

export interface Message {
  message: string;
}

export interface CustomerDetails {
  address?: Address;
  email?: string;
  name?: string;
  phone?: string;
  tax_exempt?: 'none' | 'exempt' | 'reverse';
  tax_ids?: TaxId[];
}

export interface Address {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface TaxId {
  type: string;
  value: string;
}

export interface InvoiceCreation {
  enabled: boolean;
  invoice_data?: InvoiceData;
}

export interface InvoiceData {
  account_tax_ids?: string[];
  custom_fields?: InvoiceCustomField[];
  description?: string;
  footer?: string;
  metadata?: Record<string, string>;
  rendering_options?: RenderingOptions;
}

export interface InvoiceCustomField {
  name: string;
  value: string;
}

export interface RenderingOptions {
  amount_tax_display?: 'exclude_tax' | 'include_inclusive_tax';
}

export interface LineItem {
  id: string;
  object: 'item';
  amount_discount?: number;
  amount_subtotal?: number;
  amount_tax?: number;
  amount_total?: number;
  currency?: string;
  description?: string;
  discounts?: Discount[];
  price?: Price;
  product?: Product;
  quantity?: number;
  taxes?: Tax[];
}

export interface Discount {
  amount?: number;
  discount?: string;
}

export interface Price {
  id: string;
  object: 'price';
  active?: boolean;
  billing_scheme?: 'per_unit' | 'tiered';
  created?: number;
  currency?: string;
  custom_unit_amount?: CustomUnitAmount;
  livemode?: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  product?: string;
  recurring?: Recurring;
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
  tiers?: Tier[];
  tiers_mode?: 'graduated' | 'volume';
  transform_quantity?: TransformQuantity;
  type: 'one_time' | 'recurring';
  unit_amount?: number;
  unit_amount_decimal?: string;
}

export interface CustomUnitAmount {
  maximum?: number;
  minimum?: number;
  preset?: number;
}

export interface Recurring {
  aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  trial_period_days?: number;
  usage_type?: 'metered' | 'licensed';
}

export interface Tier {
  flat_amount?: number;
  flat_amount_decimal?: string;
  unit_amount?: number;
  unit_amount_decimal?: string;
  up_to: number | 'inf';
}

export interface TransformQuantity {
  divide_by: number;
  round: 'up' | 'down';
}

export interface Tax {
  amount?: number;
  rate?: TaxRate;
}

export interface TaxRate {
  id: string;
  object: 'tax_rate';
  active?: boolean;
  country?: string;
  created?: number;
  description?: string;
  display_name?: string;
  inclusive?: boolean;
  jurisdiction?: string;
  livemode?: boolean;
  metadata?: Record<string, string>;
  percentage?: number;
  state?: string;
  tax_type?: string;
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
  setup_future_usage?: 'none' | 'off_session' | 'on_session';
}

export interface CardOptions extends PaymentMethodOption {
  request_three_d_secure?: 'automatic' | 'any' | 'challenge_only';
}

export interface PhoneNumberCollection {
  enabled: boolean;
}

export interface SavedPaymentMethodOptions {
  allow_redisplay_filters?: string[];
  payment_method_remove?: 'always' | 'never';
  payment_method_save?: 'enabled' | 'disabled';
}

export interface ShippingAddressCollection {
  allowed_countries: string[];
}

export interface ShippingCost {
  amount_subtotal?: number;
  amount_tax?: number;
  amount_total?: number;
  shipping_rate?: string;
}

export interface ShippingDetails {
  address: Address;
  carrier?: string;
  name: string;
  phone?: string;
  tracking_number?: string;
}

export interface ShippingOption {
  shipping_amount: number;
  shipping_rate: string;
}

export interface TotalDetails {
  amount_discount?: number;
  amount_shipping?: number;
  amount_tax?: number;
}

export interface Product {
  id: string;
  object: 'product';
  active?: boolean;
  attributes?: string[];
  created?: number;
  default_price?: string;
  description?: string;
  images?: string[];
  livemode?: boolean;
  marketing_features?: string[];
  metadata?: Record<string, string>;
  name?: string;
  package_dimensions?: PackageDimensions;
  shippable?: boolean;
  statement_descriptor?: string;
  tax_code?: string;
  type: 'good' | 'service';
  unit_label?: string;
  updated?: number;
  url?: string;
}

export interface PackageDimensions {
  height: number;
  length: number;
  weight: number;
  width: number;
}
