import type { Ref } from 'vue';

// Promotion Code
export interface PromotionCode {
  id: string;
  object: 'promotion_code';
  active: boolean;
  code: string;
  coupon: PromotionCoupon;
  created: number;
  customer?: string;
  expires_at?: number;
  livemode: boolean;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  min_amount?: number;
  restrictions?: PromotionCodeRestrictions;
  times_redeemed: number;
}

export interface PromotionCoupon {
  id: string;
  object: 'coupon';
  amount_off?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  livemode: boolean;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  name?: string;
  percent_off?: number;
  redeem_by?: number;
  times_redeemed?: number;
  valid?: boolean;
}

export interface PromotionCodeRestrictions {
  currency_options?: Record<string, {
    minimum_amount?: number;
  }>;
  first_time_transaction?: boolean;
  minimum_amount?: number;
  minimum_amount_currency?: string;
  per_user?: 'unlimited' | 'once_per_email' | 'once_per_ip_address' | 'once_per_customer';
}

// Create Promotion Code Params
export interface CreatePromotionCodeParams {
  coupon: string;
  active?: boolean;
  code?: string;
  customer?: string;
  expires_at?: number;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  min_amount?: number;
  restrictions?: {
    currency_options?: Record<string, {
      minimum_amount?: number;
    }>;
    first_time_transaction?: boolean;
    minimum_amount?: number;
    minimum_amount_currency?: string;
    per_user?: 'unlimited' | 'once_per_email' | 'once_per_ip_address' | 'once_per_customer';
  };
}

// Update Promotion Code Params
export interface UpdatePromotionCodeParams {
  promotionCodeId: string;
  active?: boolean;
  metadata?: Record<string, string>;
  restrictions?: {
    currency_options?: Record<string, {
      minimum_amount?: number;
    }>;
    first_time_transaction?: boolean;
    minimum_amount?: number;
    minimum_amount_currency?: string;
    per_user?: 'unlimited' | 'once_per_email' | 'once_per_ip_address' | 'once_per_customer';
  };
}

// Coupon
export interface CouponDetails {
  id: string;
  object: 'coupon';
  amount_off?: number;
  applies_to?: {
    products?: string[];
  };
  created: number;
  currency?: string;
  currency_options?: Record<string, {
    amount_off?: number;
    min_amount?: number;
  }>;
  deleted?: boolean;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  livemode: boolean;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  name?: string;
  percent_off?: number;
  redeem_by?: number;
  times_redeemed?: number;
  valid?: boolean;
}

// Create Coupon Params
export interface CreateCouponParams {
  duration: 'once' | 'repeating' | 'forever';
  amount_off?: number;
  applies_to?: {
    products?: string[];
  };
  currency?: string;
  currency_options?: Record<string, {
    amount_off?: number;
    min_amount?: number;
  }>;
  duration_in_months?: number;
  max_redemptions?: number;
  metadata?: Record<string, string>;
  name?: string;
  percent_off?: number;
  redeem_by?: number;
}

// Update Coupon Params
export interface UpdateCouponParams {
  couponId: string;
  metadata?: Record<string, string>;
  name?: string;
}

// Validate Promo Code Result
export interface ValidatePromoCodeResult {
  valid: boolean;
  promotionCode?: PromotionCode;
  coupon?: PromotionCoupon;
  error?: string;
  discount?: {
    type: 'percent' | 'amount';
    value: number;
    currency?: string;
  };
}

// Composable Return Types
export interface UsePromoCodeReturn {
  promotionCode: Readonly<Ref<PromotionCode | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreatePromotionCodeParams) => Promise<PromotionCode>;
  retrieve: (promotionCodeId: string) => Promise<PromotionCode>;
  update: (params: UpdatePromotionCodeParams) => Promise<PromotionCode>;
  list: (params?: ListPromotionCodesParams) => Promise<PromotionCode[]>;
  validate: (code: string, customerId?: string) => Promise<ValidatePromoCodeResult>;
  deactivate: (promotionCodeId: string) => Promise<PromotionCode>;
}

export interface ListPromotionCodesParams {
  active?: boolean;
  code?: string;
  coupon?: string;
  customer?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}

export interface UseCouponReturn {
  coupon: Readonly<Ref<CouponDetails | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateCouponParams) => Promise<CouponDetails>;
  retrieve: (couponId: string) => Promise<CouponDetails>;
  update: (params: UpdateCouponParams) => Promise<CouponDetails>;
  delete: (couponId: string) => Promise<void>;
  list: (params?: ListCouponsParams) => Promise<CouponDetails[]>;
}

export interface ListCouponsParams {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}
