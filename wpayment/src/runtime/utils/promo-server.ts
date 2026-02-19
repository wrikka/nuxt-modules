import Stripe from 'stripe';
import { getStripe } from './stripe-server';
import type {
  CouponDetails,
  CreateCouponParams,
  CreatePromotionCodeParams,
  ListCouponsParams,
  ListPromotionCodesParams,
  PromotionCode,
  UpdateCouponParams,
  UpdatePromotionCodeParams,
  ValidatePromoCodeResult,
} from '#wpayment/types';

// Promotion Code Operations
export async function createPromotionCode(
  params: CreatePromotionCodeParams,
): Promise<PromotionCode> {
  const stripe = getStripe();

  const promoCode = await stripe.promotionCodes.create({
    coupon: params.coupon,
    active: params.active,
    code: params.code,
    customer: params.customer,
    expires_at: params.expires_at,
    max_redemptions: params.max_redemptions,
    metadata: params.metadata,
    min_amount: params.min_amount,
    restrictions: params.restrictions,
  });

  return promoCode as unknown as PromotionCode;
}

export async function retrievePromotionCode(
  promotionCodeId: string,
): Promise<PromotionCode> {
  const stripe = getStripe();
  const promoCode = await stripe.promotionCodes.retrieve(promotionCodeId);
  return promoCode as unknown as PromotionCode;
}

export async function updatePromotionCode(
  params: UpdatePromotionCodeParams,
): Promise<PromotionCode> {
  const stripe = getStripe();

  const promoCode = await stripe.promotionCodes.update(params.promotionCodeId, {
    active: params.active,
    metadata: params.metadata,
    restrictions: params.restrictions,
  });

  return promoCode as unknown as PromotionCode;
}

export async function listPromotionCodes(
  params?: ListPromotionCodesParams,
): Promise<PromotionCode[]> {
  const stripe = getStripe();

  const promoCodes = await stripe.promotionCodes.list({
    active: params?.active,
    code: params?.code,
    coupon: params?.coupon,
    customer: params?.customer,
    limit: params?.limit,
    starting_after: params?.starting_after,
    ending_before: params?.ending_before,
  });

  return promoCodes.data as unknown as PromotionCode[];
}

export async function deactivatePromotionCode(
  promotionCodeId: string,
): Promise<PromotionCode> {
  const stripe = getStripe();

  const promoCode = await stripe.promotionCodes.update(promotionCodeId, {
    active: false,
  });

  return promoCode as unknown as PromotionCode;
}

export async function validatePromoCode(
  code: string,
  customerId?: string,
): Promise<ValidatePromoCodeResult> {
  const stripe = getStripe();

  try {
    const promoCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    });

    if (promoCodes.data.length === 0) {
      return {
        valid: false,
        error: 'Invalid promotion code',
      };
    }

    const promoCode = promoCodes.data[0];

    // Check if expired
    if (promoCode.expires_at && promoCode.expires_at < Math.floor(Date.now() / 1000)) {
      return {
        valid: false,
        error: 'Promotion code has expired',
      };
    }

    // Check max redemptions
    if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
      return {
        valid: false,
        error: 'Promotion code has reached maximum redemptions',
      };
    }

    // Check customer restriction
    if (promoCode.customer && promoCode.customer !== customerId) {
      return {
        valid: false,
        error: 'Promotion code is not valid for this customer',
      };
    }

    // Check first time transaction restriction
    if (promoCode.restrictions?.first_time_transaction && customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      if ('created' in customer && customer.created) {
        // Customer has previous transactions
        return {
          valid: false,
          error: 'Promotion code is only valid for first-time customers',
        };
      }
    }

    const coupon = promoCode.coupon as Stripe.Coupon;

    return {
      valid: true,
      promotionCode: promoCode as unknown as PromotionCode,
      coupon: coupon as unknown as PromotionCode['coupon'],
      discount: {
        type: coupon.percent_off ? 'percent' : 'amount',
        value: coupon.percent_off || coupon.amount_off || 0,
        currency: coupon.currency,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message,
    };
  }
}

// Coupon Operations
export async function createCoupon(params: CreateCouponParams): Promise<CouponDetails> {
  const stripe = getStripe();

  const coupon = await stripe.coupons.create({
    duration: params.duration,
    amount_off: params.amount_off,
    applies_to: params.applies_to,
    currency: params.currency,
    currency_options: params.currency_options,
    duration_in_months: params.duration_in_months,
    max_redemptions: params.max_redemptions,
    metadata: params.metadata,
    name: params.name,
    percent_off: params.percent_off,
    redeem_by: params.redeem_by,
  });

  return coupon as unknown as CouponDetails;
}

export async function retrieveCoupon(couponId: string): Promise<CouponDetails> {
  const stripe = getStripe();
  const coupon = await stripe.coupons.retrieve(couponId);
  return coupon as unknown as CouponDetails;
}

export async function updateCoupon(params: UpdateCouponParams): Promise<CouponDetails> {
  const stripe = getStripe();

  const coupon = await stripe.coupons.update(params.couponId, {
    metadata: params.metadata,
    name: params.name,
  });

  return coupon as unknown as CouponDetails;
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.coupons.del(couponId);
}

export async function listCoupons(params?: ListCouponsParams): Promise<CouponDetails[]> {
  const stripe = getStripe();

  const coupons = await stripe.coupons.list({
    limit: params?.limit,
    starting_after: params?.starting_after,
    ending_before: params?.ending_before,
  });

  return coupons.data as unknown as CouponDetails[];
}
