import { retrieveCoupon } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { code, amount, currency } = body;

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coupon code is required',
    });
  }

  try {
    const coupon = await retrieveCoupon(code);

    if (!coupon.valid) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: amount,
        error: 'Coupon is not valid',
      };
    }

    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: amount,
        error: 'Coupon has reached maximum redemptions',
      };
    }

    if (coupon.redeem_by && Date.now() > coupon.redeem_by * 1000) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: amount,
        error: 'Coupon has expired',
      };
    }

    let discountAmount = 0;
    if (coupon.percent_off) {
      discountAmount = Math.round(amount * (coupon.percent_off / 100));
    } else if (coupon.amount_off) {
      discountAmount = coupon.amount_off;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.id,
        name: coupon.name,
        type: coupon.percent_off ? 'percentage' : 'fixed_amount',
        value: coupon.percent_off || coupon.amount_off || 0,
        currency: coupon.currency || undefined,
      },
      discountAmount,
      finalAmount,
    };
  } catch (err) {
    return {
      valid: false,
      discountAmount: 0,
      finalAmount: amount,
      error: err instanceof Error ? err.message : 'Invalid coupon code',
    };
  }
});
