import type { Ref } from 'vue';

// Price Tier
export interface PriceTier {
  id?: string;
  up_to?: number | 'inf';
  unit_amount?: number;
  flat_amount?: number;
  unit_amount_decimal?: string;
  flat_amount_decimal?: string;
}

// Price Billing Scheme
export type PriceBillingScheme = 'per_unit' | 'tiered';

// Price Tiers Mode
export type PriceTiersMode = 'graduated' | 'volume';

// Price Type
export type PriceType = 'one_time' | 'recurring';

// Price Interval
export type PriceInterval = 'day' | 'week' | 'month' | 'year';

// Price Usage Type
export type PriceUsageType = 'licensed' | 'metered';

// Price Aggregate Usage
export type PriceAggregateUsage = 'last_during_period' | 'last_ever' | 'max' | 'sum';

// Extended Price
export interface PriceDetails {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme?: PriceBillingScheme;
  created: number;
  currency: string;
  custom_unit_amount?: PriceCustomUnitAmount;
  livemode: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  product: string;
  recurring?: PriceRecurring;
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
  tiers?: PriceTier[];
  tiers_mode?: PriceTiersMode;
  transform_quantity?: PriceTransformQuantity;
  type: PriceType;
  unit_amount?: number;
  unit_amount_decimal?: string;
}

export interface PriceCustomUnitAmount {
  enabled: boolean;
  maximum?: number;
  minimum?: number;
  preset?: number;
}

export interface PriceRecurring {
  aggregate_usage?: PriceAggregateUsage;
  interval: PriceInterval;
  interval_count?: number;
  meter?: string;
  trial_period_days?: number;
  usage_type: PriceUsageType;
}

export interface PriceTransformQuantity {
  divide_by: number;
  round: 'down' | 'up';
}

// Create Price Params
export interface CreatePriceParams {
  currency: string;
  product: string;
  active?: boolean;
  billing_scheme?: PriceBillingScheme;
  custom_unit_amount?: {
    enabled: boolean;
    maximum?: number;
    minimum?: number;
    preset?: number;
  };
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  recurring?: {
    aggregate_usage?: PriceAggregateUsage;
    interval: PriceInterval;
    interval_count?: number;
    meter?: string;
    trial_period_days?: number;
    usage_type?: PriceUsageType;
  };
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
  tiers?: Array<{
    up_to?: number | 'inf';
    unit_amount?: number;
    flat_amount?: number;
  }>;
  tiers_mode?: PriceTiersMode;
  transform_quantity?: {
    divide_by: number;
    round: 'down' | 'up';
  };
  unit_amount?: number;
  unit_amount_decimal?: string;
}

// Update Price Params
export interface UpdatePriceParams {
  priceId: string;
  active?: boolean;
  lookup_key?: string;
  metadata?: Record<string, string>;
  nickname?: string;
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
}

// Pricing Tier for UI
export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval?: PriceInterval;
  intervalCount?: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  priceId?: string;
  productId?: string;
}

// Pricing Tier Feature
export interface PricingTierFeature {
  name: string;
  included: boolean;
  limit?: number | string;
  tooltip?: string;
}

// Composable Return Types
export interface UsePriceReturn {
  price: Readonly<Ref<PriceDetails | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreatePriceParams) => Promise<PriceDetails>;
  retrieve: (priceId: string) => Promise<PriceDetails>;
  update: (params: UpdatePriceParams) => Promise<PriceDetails>;
  list: (productId?: string) => Promise<PriceDetails[]>;
  search: (query: string) => Promise<PriceDetails[]>;
}

// Product Details
export interface ProductDetails {
  id: string;
  object: 'product';
  active: boolean;
  attributes?: string[];
  created: number;
  default_price?: string;
  description?: string;
  images?: string[];
  livemode: boolean;
  marketing_features?: ProductMarketingFeature[];
  metadata?: Record<string, string>;
  name: string;
  package_dimensions?: ProductPackageDimensions;
  shippable?: boolean;
  statement_descriptor?: string;
  tax_code?: string;
  type?: 'good' | 'service';
  unit_label?: string;
  updated: number;
  url?: string;
}

export interface ProductMarketingFeature {
  name: string;
}

export interface ProductPackageDimensions {
  height: number;
  length: number;
  weight: number;
  width: number;
}

// Create Product Params
export interface CreateProductParams {
  name: string;
  active?: boolean;
  attributes?: string[];
  default_price?: string;
  description?: string;
  images?: string[];
  marketing_features?: Array<{ name: string; }>;
  metadata?: Record<string, string>;
  package_dimensions?: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  shippable?: boolean;
  statement_descriptor?: string;
  tax_code?: string;
  type?: 'good' | 'service';
  unit_label?: string;
  url?: string;
}

// Update Product Params
export interface UpdateProductParams {
  productId: string;
  active?: boolean;
  default_price?: string;
  description?: string;
  images?: string[];
  marketing_features?: Array<{ name: string; }>;
  metadata?: Record<string, string>;
  name?: string;
  package_dimensions?: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  shippable?: boolean;
  statement_descriptor?: string;
  tax_code?: string;
  unit_label?: string;
  url?: string;
}

// Composable Return Types for Product
export interface UseProductReturn {
  product: Readonly<Ref<ProductDetails | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateProductParams) => Promise<ProductDetails>;
  retrieve: (productId: string) => Promise<ProductDetails>;
  update: (params: UpdateProductParams) => Promise<ProductDetails>;
  delete: (productId: string) => Promise<void>;
  list: (params?: ListProductsParams) => Promise<ProductDetails[]>;
  search: (query: string) => Promise<ProductDetails[]>;
}

export interface ListProductsParams {
  active?: boolean;
  created?: {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
  };
  ending_before?: string;
  ids?: string[];
  limit?: number;
  shippable?: boolean;
  starting_after?: string;
  url?: string;
}
