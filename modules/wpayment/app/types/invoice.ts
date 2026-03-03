import type { Ref } from 'vue';

// Invoice Item
export interface InvoiceItem {
  id: string;
  object: 'invoiceitem';
  account?: string;
  amount: number;
  currency: string;
  customer: string;
  date: number;
  debit?: string;
  description?: string;
  discountable?: boolean;
  discounts?: string[];
  invoice?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  period?: InvoiceItemPeriod;
  price?: InvoiceItemPrice;
  proration?: boolean;
  proration_details?: InvoiceItemProrationDetails;
  quantity?: number;
  subscription?: string;
  subscription_item?: string;
  tax_rates?: string[];
  test_clock?: string;
  unit_amount?: number;
  unit_amount_decimal?: string;
}

export interface InvoiceItemPeriod {
  end: number;
  start: number;
}

export interface InvoiceItemPrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme?: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  product: string;
  recurring?: InvoiceItemPriceRecurring;
  type: 'one_time' | 'recurring';
  unit_amount?: number;
}

export interface InvoiceItemPriceRecurring {
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  trial_period_days?: number;
}

export interface InvoiceItemProrationDetails {
  credited_items?: InvoiceItemCreditedItems;
}

export interface InvoiceItemCreditedItems {
  invoice?: string;
  invoice_line?: string;
  proration?: boolean;
  quantity?: number;
  tax_rates?: string[];
  type?: string;
  unit_amount?: number;
}

// Create Invoice Params
export interface CreateInvoiceParams {
  customer: string;
  account_tax_ids?: string[];
  application_fee_amount?: number;
  auto_advance?: boolean;
  collection_method?: 'charge_automatically' | 'send_invoice';
  currency?: string;
  custom_fields?: Array<{
    name: string;
    value: string;
  }>;
  days_until_due?: number;
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discounts?: string[];
  due_date?: number;
  effective_at?: number;
  footer?: string;
  from_invoice?: {
    invoice: string;
    action: 'revision';
  };
  metadata?: Record<string, string>;
  on_behalf_of?: string;
  payment_settings?: {
    default_mandate?: string;
    payment_method_types?: string[];
  };
  pending_invoice_items_behavior?:
    | 'include_in_final_invoice'
    | 'exclude_from_final_invoice'
    | 'include_in_final_invoice_delete_draft';
  rendering_options?: {
    amount_tax_display?: 'exclude_tax' | 'include_tax';
  };
  shipping?: {
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    name?: string;
    phone?: string;
  };
  statement_descriptor?: string;
  subscription?: string;
  transfer_data?: {
    destination: string;
    amount?: number;
  };
}

// Update Invoice Params
export interface UpdateInvoiceParams {
  account_tax_ids?: string[];
  application_fee_amount?: number;
  auto_advance?: boolean;
  collection_method?: 'charge_automatically' | 'send_invoice';
  custom_fields?: Array<{
    name: string;
    value: string;
  }>;
  days_until_due?: number;
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discounts?: string[];
  due_date?: number;
  effective_at?: number;
  footer?: string;
  metadata?: Record<string, string>;
  on_behalf_of?: string;
  payment_settings?: {
    default_mandate?: string;
    payment_method_types?: string[];
  };
  rendering_options?: {
    amount_tax_display?: 'exclude_tax' | 'include_tax';
  };
  shipping?: {
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    name?: string;
    phone?: string;
  };
  statement_descriptor?: string;
  transfer_data?: {
    destination: string;
    amount?: number;
  };
}

// Create Invoice Item Params
export interface CreateInvoiceItemParams {
  customer: string;
  amount: number;
  currency: string;
  account?: string;
  description?: string;
  discountable?: boolean;
  discounts?: string[];
  invoice?: string;
  metadata?: Record<string, string>;
  period?: {
    end: number;
    start: number;
  };
  price?: string;
  quantity?: number;
  subscription?: string;
  subscription_item?: string;
  tax_rates?: string[];
  unit_amount?: number;
  unit_amount_decimal?: string;
}

// Invoice Line Item
export interface InvoiceLineItem {
  id: string;
  object: 'line_item';
  amount: number;
  amount_excluding_tax?: number;
  currency: string;
  description: string;
  discount_amounts?: InvoiceLineItemDiscountAmount[];
  discountable?: boolean;
  discounts?: string[];
  invoice_item?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  period?: InvoiceItemPeriod;
  price?: InvoiceItemPrice;
  proration?: boolean;
  proration_details?: InvoiceItemProrationDetails;
  quantity?: number;
  subscription?: string;
  subscription_item?: string;
  tax_amounts?: InvoiceLineItemTaxAmount[];
  tax_rates?: InvoiceLineItemTaxRate[];
  type:
    | 'invoiceitem'
    | 'subscription'
    | 'subscription_period_end'
    | 'subscription_proration'
    | 'subscription_pending_invoice_item'
    | 'subscription_pending_invoice_item_proration';
  unit_amount_excluding_tax?: number;
  unit_amount?: number;
}

export interface InvoiceLineItemDiscountAmount {
  amount: number;
  discount: string;
}

export interface InvoiceLineItemTaxAmount {
  amount: number;
  inclusive: boolean;
  tax_rate: string;
}

export interface InvoiceLineItemTaxRate {
  id: string;
  object: 'tax_rate';
  active: boolean;
  country?: string;
  created: number;
  description?: string;
  display_name?: string;
  inclusive: boolean;
  jurisdiction?: string;
  jurisdiction_level?: 'country' | 'state' | 'county' | 'city' | 'district';
  livemode: boolean;
  metadata?: Record<string, string>;
  percentage: number;
  state?: string;
  tax_type?: string;
}

// Send Invoice Params
export interface SendInvoiceParams {
  invoiceId: string;
  customer?: string;
  delivery_method?: 'email' | 'mail';
  paid?: boolean;
  paid_out_of_band?: boolean;
}

// Pay Invoice Params
export interface PayInvoiceParams {
  invoiceId: string;
  cancel_at?: number;
  cancellation_reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'abandoned';
  forgive?: boolean;
  mandate?: string;
  off_session?: boolean;
  paid_out_of_band?: boolean;
  payment_method?: string;
  source?: string;
}

// Composable Return Types
export interface UseInvoiceReturn {
  invoice: Readonly<Ref<import('./webhook').Invoice | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateInvoiceParams) => Promise<import('./webhook').Invoice>;
  retrieve: (invoiceId: string) => Promise<import('./webhook').Invoice>;
  update: (invoiceId: string, params: UpdateInvoiceParams) => Promise<import('./webhook').Invoice>;
  delete: (invoiceId: string) => Promise<void>;
  finalize: (invoiceId: string) => Promise<import('./webhook').Invoice>;
  pay: (invoiceId: string, params?: PayInvoiceParams) => Promise<import('./webhook').Invoice>;
  send: (invoiceId: string, params?: SendInvoiceParams) => Promise<import('./webhook').Invoice>;
  void: (invoiceId: string) => Promise<import('./webhook').Invoice>;
  markUncollectible: (invoiceId: string) => Promise<import('./webhook').Invoice>;
  list: (customerId: string) => Promise<import('./webhook').Invoice[]>;
  listLineItems: (invoiceId: string) => Promise<InvoiceLineItem[]>;
  createItem: (params: CreateInvoiceItemParams) => Promise<InvoiceItem>;
  deleteItem: (itemId: string) => Promise<void>;
}

// Upcoming Invoice
export interface UpcomingInvoiceParams {
  customer: string;
  coupon?: string;
  currency?: string;
  discounts?: string[];
  invoice_items?: Array<{
    amount?: number;
    currency?: string;
    description?: string;
    discountable?: boolean;
    discounts?: string[];
    period?: {
      end: number;
      start: number;
    };
    price?: string;
    quantity?: number;
    tax_rates?: string[];
    unit_amount?: number;
  }>;
  schedule?: string;
  subscription?: string;
  subscription_billing_cycle_anchor?: number | 'now' | 'unchanged';
  subscription_cancel_at?: number;
  subscription_cancel_at_period_end?: boolean;
  subscription_cancel_now?: boolean;
  subscription_default_tax_rates?: string[];
  subscription_items?: Array<{
    billing_thresholds?: {
      usage_gte?: number;
    };
    id?: string;
    price?: string;
    quantity?: number;
    tax_rates?: string[];
  }>;
  subscription_proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
  subscription_proration_date?: number;
  subscription_start_date?: number;
  subscription_tax_percent?: number;
  subscription_trial_end?: number;
  subscription_trial_from_plan?: boolean;
}
