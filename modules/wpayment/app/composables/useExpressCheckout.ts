import { readonly, ref } from 'vue';
import type {
  ApplePayConfig,
  ApplePayPaymentRequest,
  ApplePayResult,
  ExpressCheckoutPaymentMethod,
  GooglePayConfig,
  GooglePayPaymentRequest,
  GooglePayResult,
  UseExpressCheckoutReturn,
} from '#wpayment/types';

export function useExpressCheckout(): UseExpressCheckoutReturn {
  const availableMethods = ref<ExpressCheckoutPaymentMethod[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const checkAvailability = async (): Promise<ExpressCheckoutPaymentMethod[]> => {
    loading.value = true;
    try {
      const result = await $fetch<ExpressCheckoutPaymentMethod[]>('/api/stripe/express-checkout/availability');
      availableMethods.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const initApplePay = async (config: ApplePayConfig): Promise<boolean> => {
    loading.value = true;
    try {
      const result = await $fetch<{ available: boolean; }>('/api/stripe/express-checkout/apple-pay/init', {
        method: 'POST',
        body: config,
      });
      return result.available;
    } finally {
      loading.value = false;
    }
  };

  const initGooglePay = async (config: GooglePayConfig): Promise<boolean> => {
    loading.value = true;
    try {
      const result = await $fetch<{ available: boolean; }>('/api/stripe/express-checkout/google-pay/init', {
        method: 'POST',
        body: config,
      });
      return result.available;
    } finally {
      loading.value = false;
    }
  };

  const showApplePay = async (request: ApplePayPaymentRequest): Promise<ApplePayResult> => {
    loading.value = true;
    try {
      return await $fetch<ApplePayResult>('/api/stripe/express-checkout/apple-pay/show', {
        method: 'POST',
        body: request,
      });
    } finally {
      loading.value = false;
    }
  };

  const showGooglePay = async (request: GooglePayPaymentRequest): Promise<GooglePayResult> => {
    loading.value = true;
    try {
      return await $fetch<GooglePayResult>('/api/stripe/express-checkout/google-pay/show', {
        method: 'POST',
        body: request,
      });
    } finally {
      loading.value = false;
    }
  };

  const createPaymentWithExpress = async (type: any, clientSecret: string, result: any) => {
    loading.value = true;
    try {
      return await $fetch('/api/stripe/express-checkout/payment', {
        method: 'POST',
        body: { type, clientSecret, result },
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    availableMethods: readonly(availableMethods),
    loading: readonly(loading),
    error: readonly(error),
    checkAvailability,
    initApplePay,
    initGooglePay,
    showApplePay,
    showGooglePay,
    createPaymentWithExpress,
  };
}
