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
