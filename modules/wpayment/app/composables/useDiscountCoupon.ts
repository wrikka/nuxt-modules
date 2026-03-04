import { readonly, ref } from 'vue';
import type {
  Coupon,
  CouponValidationResult,
  CreateCouponParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UseDiscountCouponReturn,
} from '#wpayment/types';

export function useDiscountCoupon(): UseDiscountCouponReturn {
  const coupons = ref<Coupon[]>([]);
  const loading = ref(false);

  const validateCoupon = async (
    code: string,
    amount: number,
    currency: string,
  ): Promise<CouponValidationResult> => {
    try {
      const result = await $fetch<CouponValidationResult>('/api/coupons/validate', {
        method: 'POST',
        body: { code, amount, currency },
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate coupon';
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: amount,
        error: message,
      };
    }
  };

  const applyCoupon = async (
    code: string,
    paymentIntentId: string,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;

    try {
      const result = await $fetch<UnifiedPaymentIntent>('/api/coupons/apply', {
        method: 'POST',
        body: { code, paymentIntentId },
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply coupon';
      return { success: false, error: { code: 'apply_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const removeCoupon = async (
    paymentIntentId: string,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;

    try {
      const result = await $fetch<UnifiedPaymentIntent>('/api/coupons/remove', {
        method: 'POST',
        body: { paymentIntentId },
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove coupon';
      return { success: false, error: { code: 'remove_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const calculateDiscount = async (
    code: string,
    amount: number,
    currency: string,
  ): Promise<number> => {
    const validation = await validateCoupon(code, amount, currency);
    return validation.discountAmount;
  };

  const createCoupon = async (params: CreateCouponParams): Promise<PaymentResult<Coupon>> => {
    loading.value = true;

    try {
      const result = await $fetch<Coupon>('/api/coupons', {
        method: 'POST',
        body: {
          ...params,
          validFrom: params.validFrom?.toISOString(),
          validUntil: params.validUntil?.toISOString(),
        },
      });

      coupons.value = [result, ...coupons.value];

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create coupon';
      return { success: false, error: { code: 'create_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const deactivateCoupon = async (couponId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch(`/api/coupons/${couponId}/deactivate`, {
        method: 'POST',
      });

      coupons.value = coupons.value.map(c =>
        c.id === couponId ? { ...c, active: false } : c,
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate coupon';
      return { success: false, error: { code: 'deactivate_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  return {
    coupons: readonly(coupons),
    loading: readonly(loading),
    validateCoupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
    createCoupon,
    deactivateCoupon,
  };
}
