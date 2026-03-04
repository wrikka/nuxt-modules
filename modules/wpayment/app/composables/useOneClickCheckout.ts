import { readonly, ref } from 'vue';
import type {
  OneClickCheckoutParams,
  PaymentMethod,
  PaymentResult,
  UnifiedPaymentIntent,
  UseOneClickCheckoutReturn,
} from '#wpayment/types';

export function useOneClickCheckout(): UseOneClickCheckoutReturn {
  const isReady = ref(false);
  const loading = ref(false);
  const customerId = ref<string | null>(null);
  const savedPaymentMethods = ref<PaymentMethod[]>([]);

  const setup = async (targetCustomerId: string): Promise<void> => {
    loading.value = true;

    try {
      const methods = await $fetch<PaymentMethod[]>('/api/payment-methods', {
        query: { customerId: targetCustomerId },
      });

      savedPaymentMethods.value = methods.filter(pm => pm.isDefault);
      customerId.value = targetCustomerId;
      isReady.value = methods.length > 0;
    } finally {
      loading.value = false;
    }
  };

  const checkout = async (
    params: OneClickCheckoutParams,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    if (!customerId.value) {
      return {
        success: false,
        error: {
          code: 'not_initialized',
          message: 'One-click checkout not initialized. Call setup() first.',
          retryable: false,
        },
      };
    }

    loading.value = true;

    try {
      const paymentMethodId = params.paymentMethodId || savedPaymentMethods.value[0]?.id;

      if (!paymentMethodId) {
        return {
          success: false,
          error: {
            code: 'no_payment_method',
            message: 'No payment method available for one-click checkout',
            retryable: false,
          },
        };
      }

      const result = await $fetch<UnifiedPaymentIntent>('/api/payment/one-click', {
        method: 'POST',
        body: {
          ...params,
          customerId: customerId.value,
          paymentMethodId,
        },
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'One-click checkout failed';
      return {
        success: false,
        error: { code: 'checkout_failed', message, retryable: true },
      };
    } finally {
      loading.value = false;
    }
  };

  const getSavedPaymentMethods = (): PaymentMethod[] => {
    return savedPaymentMethods.value;
  };

  return {
    isReady: readonly(isReady),
    loading: readonly(loading),
    setup,
    checkout,
    getSavedPaymentMethods,
  };
}
