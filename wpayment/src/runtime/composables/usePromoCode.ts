import { readonly, ref } from 'vue';
import type {
  CouponDetails,
  CreateCouponParams,
  CreatePromotionCodeParams,
  PromotionCode,
  UpdateCouponParams,
  UpdatePromotionCodeParams,
  UseCouponReturn,
  UsePromoCodeReturn,
  ValidatePromoCodeResult,
} from '#wpayment/types';

export function usePromoCode(): UsePromoCodeReturn {
  const promotionCode = ref<PromotionCode | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreatePromotionCodeParams): Promise<PromotionCode> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<PromotionCode>('/api/stripe/promotion-code', { method: 'POST', body: params });
      promotionCode.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create promotion code';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (promotionCodeId: string): Promise<PromotionCode> => {
    loading.value = true;
    try {
      const result = await $fetch<PromotionCode>(`/api/stripe/promotion-code/${promotionCodeId}`);
      promotionCode.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdatePromotionCodeParams): Promise<PromotionCode> => {
    loading.value = true;
    try {
      const result = await $fetch<PromotionCode>(`/api/stripe/promotion-code/${params.promotionCodeId}`, {
        method: 'PATCH',
        body: params,
      });
      promotionCode.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const list = async (params?: any): Promise<PromotionCode[]> => {
    loading.value = true;
    try {
      return await $fetch<PromotionCode[]>('/api/stripe/promotion-codes', { query: params });
    } finally {
      loading.value = false;
    }
  };

  const validate = async (code: string, customerId?: string): Promise<ValidatePromoCodeResult> => {
    loading.value = true;
    try {
      return await $fetch<ValidatePromoCodeResult>('/api/stripe/promo-code/validate', {
        query: { code, customer: customerId },
      });
    } finally {
      loading.value = false;
    }
  };

  const deactivate = async (promotionCodeId: string): Promise<PromotionCode> => {
    loading.value = true;
    try {
      const result = await $fetch<PromotionCode>(`/api/stripe/promotion-code/${promotionCodeId}/deactivate`, {
        method: 'POST',
      });
      promotionCode.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  return {
    promotionCode: readonly(promotionCode),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    list,
    validate,
    deactivate,
  };
}

export function useCoupon(): UseCouponReturn {
  const coupon = ref<CouponDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreateCouponParams): Promise<CouponDetails> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<CouponDetails>('/api/stripe/coupon', { method: 'POST', body: params });
      coupon.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create coupon';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (couponId: string): Promise<CouponDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<CouponDetails>(`/api/stripe/coupon/${couponId}`);
      coupon.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdateCouponParams): Promise<CouponDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<CouponDetails>(`/api/stripe/coupon/${params.couponId}`, {
        method: 'PATCH',
        body: params,
      });
      coupon.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const deleteCoupon = async (couponId: string): Promise<void> => {
    loading.value = true;
    try {
      await $fetch(`/api/stripe/coupon/${couponId}`, { method: 'DELETE' });
    } finally {
      loading.value = false;
    }
  };

  const list = async (params?: any): Promise<CouponDetails[]> => {
    loading.value = true;
    try {
      return await $fetch<CouponDetails[]>('/api/stripe/coupons', { query: params });
    } finally {
      loading.value = false;
    }
  };

  return {
    coupon: readonly(coupon),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    delete: deleteCoupon,
    list,
  };
}
