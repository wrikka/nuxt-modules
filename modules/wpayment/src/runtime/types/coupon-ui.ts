// Coupon & Promotion Manager Types
export interface CouponFormData {
  id?: string;
  name: string;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  maxRedemptions?: number;
  redeemBy?: number;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface PromotionCodeFormData {
  code: string;
  coupon: string;
  active: boolean;
  maxRedemptions?: number;
  expiresAt?: number;
  restrictions?: PromotionRestrictions;
  metadata?: Record<string, string>;
}

export interface PromotionRestrictions {
  firstTimeTransaction?: boolean;
  minimumAmount?: number;
  minimumAmountCurrency?: string;
  maximumAmount?: number;
  maximumAmountCurrency?: string;
  restrictedTo?: string[];
}

export interface CouponSummary {
  id: string;
  name?: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  maxRedemptions?: number;
  timesRedeemed: number;
  valid: boolean;
  createdAt: number;
  redeemBy?: number;
}

export interface PromotionCodeSummary {
  id: string;
  code: string;
  coupon: string;
  active: boolean;
  maxRedemptions?: number;
  timesRedeemed: number;
  expiresAt?: number;
  createdAt: number;
}

export interface CouponFilter {
  active?: boolean;
  duration?: 'once' | 'repeating' | 'forever';
  search?: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  totalDiscount: number;
  averageDiscount: number;
}

export interface CouponValidationResult {
  valid: boolean;
  couponId?: string;
  promotionCodeId?: string;
  percentOff?: number;
  amountOff?: number;
  error?: string;
}
