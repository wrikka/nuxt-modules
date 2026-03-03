import type { StripeAddress, StripeShipping } from './stripe-config';

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
