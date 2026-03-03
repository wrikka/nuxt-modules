// Subscription Types
// Stripe-compatible subscription interfaces

export interface Subscription {
  id: string;
  object: 'subscription';
  application?: string;
  application_fee_percent?: number;
  automatic_tax?: SubscriptionAutomaticTax;
  billing_cycle_anchor: number;
  billing_thresholds?: BillingThresholds;
  cancel_at?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  cancellation_details?: CancellationDetails;
  collection_method: 'charge_automatically' | 'send_invoice';
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due?: number;
  default_payment_method?: string;
  default_tax_rates?: TaxRate[];
  description?: string;
  discount?: Discount;
  ended_at?: number;
  invoice_settings?: InvoiceSettings;
  items: SubscriptionItemList;
  latest_invoice?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_pending_invoice_item_invoice?: number;
  on_behalf_of?: string;
  pause_collection?: PauseCollection;
  payment_settings?: PaymentSettings;
  pending_invoice_item_interval?: PendingInvoiceItemInterval;
  pending_setup_intent?: string;
  pending_update?: PendingUpdate;
  plan?: Plan;
  quantity?: number;
  schedule?: string;
  start_date: number;
  status: SubscriptionStatus;
  test_clock?: string;
  transfer_data?: TransferData;
  trial_end?: number;
  trial_settings?: TrialSettings;
  trial_start?: number;
}

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'paused'
  | 'unpaid';

export interface SubscriptionAutomaticTax {
  enabled: boolean;
  liability?: TaxLiability;
}

export interface TaxLiability {
  type: 'self' | 'account' | 'customer';
}

export interface BillingThresholds {
  amount_gte?: number;
  reset_billing_cycle_anchor?: boolean;
}

export interface CancellationDetails {
  comment?: string;
  feedback?: CancellationFeedback;
  reason?: CancellationReason;
}

export type CancellationFeedback =
  | 'customer_service'
  | 'low_quality'
  | 'missing_features'
  | 'other'
  | 'switched_service'
  | 'too_complex'
  | 'too_expensive'
  | 'unused';

export type CancellationReason =
  | 'cancellation_requested'
  | 'payment_disputed'
  | 'payment_failed'
  | 'final_invoice'
  | 'billing_closed'
  | 'fraud_confirmed'
  | 'invoice_overdue'
  | 'order_returned'
  | 'product_unsatisfactory'
  | 'product_unacceptable'
  | 'subscription_suspended';

export interface Discount {
  checkout_session?: string;
  coupon?: Coupon;
  customer?: string;
  end?: number;
  id: string;
  invoice?: string;
  invoice_item?: string;
  object: 'discount';
  promotion_code?: string;
  start: number;
  subscription?: string;
}

export interface Coupon {
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

export interface TaxRate {
  id: string;
  object: 'tax_rate';
  active: boolean;
  country?: string;
  created: number;
  description?: string;
  display_name: string;
  inclusive: boolean;
  jurisdiction?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  percentage: number;
  state?: string;
  tax_type?: string;
}

export interface InvoiceSettings {
  issuer?: Issuer;
}

export interface Issuer {
  type: 'self' | 'account';
}

export interface SubscriptionItemList {
  object: 'list';
  data: SubscriptionItem[];
  has_more: boolean;
  url: string;
}

export interface SubscriptionItem {
  id: string;
  object: 'subscription_item';
  billing_thresholds?: ItemBillingThresholds;
  created: number;
  discounts?: Discount[];
  metadata?: Record<string, string>;
  plan?: Plan;
  price?: Price;
  quantity?: number;
  subscription: string;
  tax_rates?: TaxRate[];
}

export interface ItemBillingThresholds {
  usage_gte: number;
}

export interface Plan {
  id: string;
  object: 'plan';
  active: boolean;
  aggregate_usage?: 'sum' | 'last_during_period' | 'last_ever' | 'max';
  amount: number;
  amount_decimal?: string;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  livemode: boolean;
  metadata?: Record<string, string>;
  nickname?: string;
  product: string;
  tiers?: PlanTier[];
  tiers_mode?: 'graduated' | 'volume';
  transform_usage?: TransformUsage;
  trial_period_days?: number;
  usage_type: 'metered' | 'licensed';
}

export interface PlanTier {
  flat_amount?: number;
  flat_amount_decimal?: string;
  unit_amount?: number;
  unit_amount_decimal?: string;
  up_to: number | 'inf';
}

export interface TransformUsage {
  divide_by: number;
  round: 'up' | 'down';
}

export interface Price {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme?: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  custom_unit_amount?: CustomUnitAmount;
  livemode: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  product: string;
  recurring?: Recurring;
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
  tiers?: PriceTier[];
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
  interval_count: number;
  trial_period_days?: number;
  usage_type?: 'metered' | 'licensed';
}

export interface PriceTier {
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

export interface PaymentSettings {
  default_mandate?: string;
  payment_method_options?: PaymentMethodOptions;
  payment_method_types?: string[];
  save_default_payment_method?: 'off' | 'on_subscription' | 'on_payment';
}

export interface PaymentMethodOptions {
  acss_debit?: PaymentMethodOption;
  bancontact?: PaymentMethodOption;
  card?: PaymentMethodOption;
  customer_balance?: PaymentMethodOption;
  konbini?: PaymentMethodOption;
  sepa_debit?: PaymentMethodOption;
  us_bank_account?: PaymentMethodOption;
}

export interface PaymentMethodOption {
  mandate_options?: MandateOptions;
  verification_method?: 'automatic' | 'instant' | 'microdeposits';
}

export interface MandateOptions {
  amount_type?: 'fixed' | 'maximum';
  reference?: string;
}

export interface PauseCollection {
  behavior: 'keep_as_draft' | 'mark_uncollectible' | 'void' | 'pause';
  resumes_at?: number;
}

export interface PendingInvoiceItemInterval {
  interval: 'day' | 'month' | 'week' | 'year';
  interval_count?: number;
}

export interface PendingUpdate {
  billing_cycle_anchor?: number;
  expires_at: number;
  plan?: Plan;
  quantity?: number;
  subscription_items?: SubscriptionItem[];
  trial_end?: number;
  trial_from_plan?: boolean;
}

export interface TransferData {
  amount_percent?: number;
  destination: string;
}

export interface TrialSettings {
  end_behavior: EndBehavior;
}

export interface EndBehavior {
  missing_payment_method: 'create_invoice' | 'pause_subscription';
}
