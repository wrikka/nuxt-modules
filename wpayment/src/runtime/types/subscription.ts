import type { Ref } from 'vue';

// Subscription Status
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

// Subscription Interval
export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year';

// Subscription
export interface Subscription {
  id: string;
  object: 'subscription';
  application?: string;
  application_fee_percent?: number;
  automatic_tax?: SubscriptionAutomaticTax;
  billing_cycle_anchor?: number;
  billing_thresholds?: SubscriptionBillingThresholds;
  cancel_at?: number;
  cancel_at_period_end?: boolean;
  canceled_at?: number;
  cancellation_details?: SubscriptionCancellationDetails;
  collection_method?: 'charge_automatically' | 'send_invoice';
  created: number;
  currency?: string;
  current_period_end?: number;
  current_period_start?: number;
  customer: string;
  days_until_due?: number;
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discount?: SubscriptionDiscount;
  ended_at?: number;
  invoice?: string;
  items: SubscriptionItemList;
  latest_invoice?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_pending_invoice_item_invoice?: number;
  on_behalf_of?: string;
  pause_collection?: SubscriptionPauseCollection;
  payment_settings?: SubscriptionPaymentSettings;
  pending_invoice_item_interval?: SubscriptionPendingInvoiceItemInterval;
  pending_setup_intent?: string;
  pending_update?: SubscriptionPendingUpdate;
  plan?: SubscriptionPlan;
  quantity?: number;
  schedule?: string;
  start_date?: number;
  status: SubscriptionStatus;
  test_clock?: string;
  transfer_data?: SubscriptionTransferData;
  trial_end?: number;
  trial_start?: number;
}

export interface SubscriptionAutomaticTax {
  enabled: boolean;
  liability?: SubscriptionLiability;
}

export interface SubscriptionLiability {
  type: string;
  reference?: string;
}

export interface SubscriptionBillingThresholds {
  amount_gte?: number;
  reset_billing_cycle_anchor?: boolean;
}

export interface SubscriptionCancellationDetails {
  comment?: string;
  feedback?: string;
  reason?: string;
}

export interface SubscriptionDiscount {
  coupon?: SubscriptionCoupon;
  start?: number;
  end?: number;
}

export interface SubscriptionCoupon {
  id: string;
  object: 'coupon';
  amount_off?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  percent_off?: number;
}

export interface SubscriptionPauseCollection {
  behavior: 'mark_uncollectible' | 'keep_as_draft' | 'void';
  resumes_at?: number;
}

export interface SubscriptionPaymentSettings {
  payment_method_options?: SubscriptionPaymentMethodOptions;
  payment_method_types?: string[];
  save_default_payment_method?: 'off' | 'on_subscription_update';
}

export interface SubscriptionPaymentMethodOptions {
  card?: SubscriptionCardOptions;
  sepa_debit?: SubscriptionSepaOptions;
}

export interface SubscriptionCardOptions {
  mandate_options?: SubscriptionMandateOptions;
  network?: string;
  request_three_d_secure?: 'automatic' | 'any';
}

export interface SubscriptionMandateOptions {
  amount?: number;
  amount_type?: 'fixed' | 'maximum';
  description?: string;
  interval?: 'one_time' | 'sporadic' | 'interval';
  interval_count?: number;
  start_date?: number;
  support_amount?: number;
}

export interface SubscriptionSepaOptions {
  mandate_options?: SubscriptionSepaMandateOptions;
}

export interface SubscriptionSepaMandateOptions {
  reference?: string;
}

export interface SubscriptionPendingInvoiceItemInterval {
  interval: SubscriptionInterval;
  interval_count?: number;
}

export interface SubscriptionPendingUpdate {
  billing_cycle_anchor?: number;
  expires_at?: number;
  subscription_items?: SubscriptionItem[];
  trial_end?: number;
  trial_from_plan?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  object: 'plan';
  active: boolean;
  amount?: number;
  billing_scheme?: 'per_unit' | 'tiered';
  created: number;
  currency?: string;
  interval: SubscriptionInterval;
  interval_count?: number;
  product?: string;
  tiers?: SubscriptionPlanTier[];
  tiers_mode?: 'graduated' | 'volume';
}

export interface SubscriptionPlanTier {
  amount?: number;
  up_to?: number | 'inf';
}

export interface SubscriptionTransferData {
  amount_percent?: number;
  destination: string;
}

export interface SubscriptionItemList {
  object: 'list';
  data: SubscriptionItem[];
  has_more?: boolean;
  total_count?: number;
}

export interface SubscriptionItem {
  id: string;
  object: 'subscription_item';
  billing_thresholds?: SubscriptionBillingThresholds;
  created: number;
  metadata?: Record<string, string>;
  plan?: SubscriptionPlan;
  price?: SubscriptionPrice;
  quantity?: number;
  subscription: string;
  tax_rates?: string[];
}

export interface SubscriptionPrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme?: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  product: string;
  recurring?: SubscriptionPriceRecurring;
  type: 'one_time' | 'recurring';
  unit_amount?: number;
}

export interface SubscriptionPriceRecurring {
  interval: SubscriptionInterval;
  interval_count?: number;
  trial_period_days?: number;
  usage_type?: 'licensed' | 'metered';
}

// Create Subscription Params
export interface CreateSubscriptionParams {
  customer: string;
  items: Array<{
    price: string;
    quantity?: number;
  }>;
  coupon?: string;
  promotion_code?: string;
  default_payment_method?: string;
  trial_period_days?: number;
  trial_end?: number;
  backdate_start_date?: number;
  billing_cycle_anchor?: number;
  billing_thresholds?: {
    amount_gte?: number;
    reset_billing_cycle_anchor?: boolean;
  };
  cancel_at?: number;
  cancel_at_period_end?: boolean;
  collection_method?: 'charge_automatically' | 'send_invoice';
  days_until_due?: number;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  metadata?: Record<string, string>;
  payment_settings?: {
    payment_method_types?: string[];
    save_default_payment_method?: 'off' | 'on_subscription_update';
  };
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
  transfer_data?: {
    destination: string;
    amount_percent?: number;
  };
  trial_from_plan?: boolean;
}

// Update Subscription Params
export interface UpdateSubscriptionParams {
  coupon?: string;
  promotion_code?: string;
  default_payment_method?: string;
  items?: Array<{
    id?: string;
    price?: string;
    quantity?: number;
    deleted?: boolean;
  }>;
  billing_cycle_anchor?: number | 'now' | 'unchanged';
  cancel_at?: number;
  cancel_at_period_end?: boolean;
  collection_method?: 'charge_automatically' | 'send_invoice';
  days_until_due?: number;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  metadata?: Record<string, string>;
  payment_settings?: {
    payment_method_types?: string[];
    save_default_payment_method?: 'off' | 'on_subscription_update';
  };
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
  proration_date?: number;
  transfer_data?: {
    destination: string;
    amount_percent?: number;
  };
  trial_end?: number;
}

// Cancel Subscription Params
export interface CancelSubscriptionParams {
  cancellation_details?: {
    comment?: string;
    feedback?: string;
    reason?: string;
  };
  invoice_now?: boolean;
  prorate?: boolean;
}

// Pause Subscription Params
export interface PauseSubscriptionParams {
  behavior: 'mark_uncollectible' | 'keep_as_draft' | 'void';
  resumes_at?: number;
}

// Resume Subscription Params
export interface ResumeSubscriptionParams {
  billing_cycle_anchor?: 'now' | 'unchanged';
  prorate?: boolean;
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
}

// Composable Return Types
export interface UseSubscriptionReturn {
  subscription: Readonly<Ref<Subscription | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateSubscriptionParams) => Promise<Subscription>;
  retrieve: (subscriptionId: string) => Promise<Subscription>;
  update: (subscriptionId: string, params: UpdateSubscriptionParams) => Promise<Subscription>;
  cancel: (subscriptionId: string, params?: CancelSubscriptionParams) => Promise<Subscription>;
  pause: (subscriptionId: string, params: PauseSubscriptionParams) => Promise<Subscription>;
  resume: (subscriptionId: string, params?: ResumeSubscriptionParams) => Promise<Subscription>;
  list: (customerId: string) => Promise<Subscription[]>;
}

// Subscription Schedule
export interface SubscriptionSchedule {
  id: string;
  object: 'subscription_schedule';
  application?: string;
  canceled_at?: number;
  completed_at?: number;
  created: number;
  current_phase?: SubscriptionSchedulePhase;
  customer: string;
  default_settings?: SubscriptionScheduleDefaultSettings;
  end_behavior: 'release' | 'cancel' | 'pause';
  livemode: boolean;
  metadata?: Record<string, string>;
  phases: SubscriptionSchedulePhase[];
  released_at?: number;
  released_subscription?: string;
  status: SubscriptionScheduleStatus;
  subscription?: string;
  test_clock?: string;
}

export type SubscriptionScheduleStatus =
  | 'not_started'
  | 'active'
  | 'completed'
  | 'canceled'
  | 'released';

export interface SubscriptionSchedulePhase {
  application_fee_percent?: number;
  billing_cycle_anchor?: number;
  billing_thresholds?: SubscriptionBillingThresholds;
  collection_method?: 'charge_automatically' | 'send_invoice';
  currency?: string;
  default_payment_method?: string;
  default_tax_rates?: string[];
  description?: string;
  end_date: number;
  invoice_settings?: SubscriptionScheduleInvoiceSettings;
  plans: SubscriptionSchedulePlan[];
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
  start_date: number;
  trial_end?: number;
}

export interface SubscriptionSchedulePlan {
  billing_thresholds?: SubscriptionBillingThresholds;
  price: string;
  quantity?: number;
  tax_rates?: string[];
}

export interface SubscriptionScheduleDefaultSettings {
  billing_cycle_anchor?: number;
  billing_thresholds?: SubscriptionBillingThresholds;
  collection_method?: 'charge_automatically' | 'send_invoice';
  default_payment_method?: string;
  default_source?: string;
  invoice_settings?: SubscriptionScheduleInvoiceSettings;
}

export interface SubscriptionScheduleInvoiceSettings {
  days_until_due?: number;
}
