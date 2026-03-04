import { readonly, ref } from 'vue';
import type {
  MobilePaymentMethod,
  CreatePaymentParams,
  PaymentResult,
  UseMobilePaymentReturn,
} from '#wpayment/types';

export function useMobilePayment(): UseMobilePaymentReturn {
  const availableMethods = ref<MobilePaymentMethod[]>([]);
  const loading = ref(false);
  const activeRequest = ref<string | null>(null);

  const checkAvailability = async (): Promise<void> => {
    loading.value = true;

    try {
      const methods = await $fetch<MobilePaymentMethod[]>('/api/mobile-payment/methods');

      availableMethods.value = methods.filter(m => m.available);
    } finally {
      loading.value = false;
    }
  };

  const createPaymentRequest = async (
    method: string,
    params: CreatePaymentParams,
  ): Promise<PaymentResult<string>> => {
    loading.value = true;

    try {
      const result = await $fetch<{ requestId: string }>('/api/mobile-payment/request', {
        method: 'POST',
        body: { method, ...params },
      });

      activeRequest.value = result.requestId;

      return { success: true, data: result.requestId };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create mobile payment request';
      return { success: false, error: { code: 'mobile_payment_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const abortPayment = async (requestId: string): Promise<void> => {
    try {
      await $fetch('/api/mobile-payment/abort', {
        method: 'POST',
        body: { requestId },
      });

      if (activeRequest.value === requestId) {
        activeRequest.value = null;
      }
    } catch {
      // Silently fail on abort
    }
  };

  return {
    availableMethods: readonly(availableMethods),
    loading: readonly(loading),
    checkAvailability,
    createPaymentRequest,
    abortPayment,
  };
}
