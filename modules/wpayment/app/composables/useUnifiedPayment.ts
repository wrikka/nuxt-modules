import { computed, readonly, ref } from 'vue';
import type {
  CreatePaymentParams,
  PaymentError,
  PaymentGateway,
  PaymentResult,
  UnifiedPaymentIntent,
  UseUnifiedPaymentReturn,
  ConfirmPaymentParams,
  RefundParams,
} from '#wpayment/types';

const defaultGateway: PaymentGateway = 'stripe';

export function useUnifiedPayment(): UseUnifiedPaymentReturn {
  const loading = ref(false);
  const error = ref<PaymentError | null>(null);
  const config = useRuntimeConfig();

  const getGateway = (gateway?: PaymentGateway): PaymentGateway => {
    return gateway || config.public.wpayment?.defaultGateway || defaultGateway;
  };

  const handleError = (err: unknown): PaymentError => {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return {
      code: 'unknown_error',
      message,
      retryable: false,
    };
  };

  const createPayment = async (
    params: CreatePaymentParams,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const gateway = getGateway(params.gateway);
      const result = await $fetch<UnifiedPaymentIntent>('/api/payment/create', {
        method: 'POST',
        body: { ...params, gateway },
      });

      return { success: true, data: result };
    } catch (err) {
      const paymentError = handleError(err);
      error.value = paymentError;
      return { success: false, error: paymentError };
    } finally {
      loading.value = false;
    }
  };

  const confirmPayment = async (
    paymentIntentId: string,
    params?: ConfirmPaymentParams,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<UnifiedPaymentIntent>(`/api/payment/confirm/${paymentIntentId}`, {
        method: 'POST',
        body: params,
      });

      return { success: true, data: result };
    } catch (err) {
      const paymentError = handleError(err);
      error.value = paymentError;
      return { success: false, error: paymentError };
    } finally {
      loading.value = false;
    }
  };

  const retrievePayment = async (
    paymentIntentId: string,
    gateway?: PaymentGateway,
  ): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<UnifiedPaymentIntent>(`/api/payment/${paymentIntentId}`, {
        query: { gateway: getGateway(gateway) },
      });

      return { success: true, data: result };
    } catch (err) {
      const paymentError = handleError(err);
      error.value = paymentError;
      return { success: false, error: paymentError };
    } finally {
      loading.value = false;
    }
  };

  const refundPayment = async (params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const gateway = getGateway(params.gateway);
      const result = await $fetch<UnifiedPaymentIntent>('/api/payment/refund', {
        method: 'POST',
        body: { ...params, gateway },
      });

      return { success: true, data: result };
    } catch (err) {
      const paymentError = handleError(err);
      error.value = paymentError;
      return { success: false, error: paymentError };
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    createPayment,
    confirmPayment,
    retrievePayment,
    refundPayment,
  };
}
