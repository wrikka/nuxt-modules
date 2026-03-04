import { createCoupon, retrieveCoupon, deleteCoupon } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { code, name, type, value, currency, validFrom, validUntil, maxRedemptions, appliesTo } = body;

  try {
    const coupon = await createCoupon({
      id: code,
      name,
      ...(type === 'percentage' ? { percent_off: value } : { amount_off: value, currency }),
      duration: 'once',
      redeem_by: validUntil ? Math.floor(new Date(validUntil).getTime() / 1000) : undefined,
      max_redemptions: maxRedemptions,
      applies_to: appliesTo,
    });

    return {
      id: coupon.id,
      code: coupon.id,
      name: coupon.name,
      type: coupon.percent_off ? 'percentage' : 'fixed_amount',
      value: coupon.percent_off || coupon.amount_off || 0,
      currency: coupon.currency || undefined,
      validFrom: coupon.created ? new Date(coupon.created * 1000).toISOString() : undefined,
      validUntil: coupon.redeem_by ? new Date(coupon.redeem_by * 1000).toISOString() : undefined,
      maxRedemptions: coupon.max_redemptions || undefined,
      redemptionCount: coupon.times_redeemed || 0,
      active: coupon.valid,
      appliesTo: coupon.applies_to || undefined,
    };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to create coupon',
    });
  }
});
