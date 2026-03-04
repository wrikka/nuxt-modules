import { readonly, ref } from 'vue';
import type {
  BNPLProvider,
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UseBNPLReturn,
} from '#wpayment/types';

export function useBNPL(): UseBNPLReturn {
  const providers = ref<BNPLProvider[]>([]);
  const loading = ref(false);

  const getAvailableProviders = async (
    amount: number,
    currency: string,
    country: string,
  ): Promise<BNPLProvider[]> => {
    loading.value = true;

    try {
      const result = await $fetch<BNPLProvider[]>('/api/bnpl/providers', {
        query: { amount, currency, country },
      });

      providers.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const createPaymentSession = async (
    provider: string,
    params: CreatePaymentParams,
  ): Promise<PaymentResult<string>> => {
    loading.value = true;

    try {
      const result = await $fetch<{ sessionId: string }>('/api/bnpl/session', {
        method: 'POST',
        body: { provider, ...params },
      });

      return { success: true, data: result.sessionId };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create BNPL session';
      return { success: false, error: { code: 'bnpl_session_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const confirmPaymentSession = async (
    provider: string,
    sessionId: string,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;

    try {
      const result = await $fetch<UnifiedPaymentIntent>('/api/bnpl/confirm', {
        method: 'POST',
        body: { provider, sessionId },
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm BNPL payment';
      return { success: false, error: { code: 'bnpl_confirm_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  return {
    providers: readonly(providers),
    loading: readonly(loading),
    getAvailableProviders,
    createPaymentSession,
    confirmPaymentSession,
  };
}
