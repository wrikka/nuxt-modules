import { readonly, ref } from 'vue';
import type {
  PaymentRetryConfig,
  PaymentRetryResult,
  ThreeDSecureAuthentication,
  ThreeDSecureOptions,
  ThreeDSecureResult,
  UsePaymentRetryReturn,
  UseThreeDSecureReturn,
} from '#wpayment/types';

export function useThreeDSecure(): UseThreeDSecureReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const result = ref<ThreeDSecureResult | null>(null);

  const authenticate = async (clientSecret: string, options?: ThreeDSecureOptions): Promise<ThreeDSecureResult> => {
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch<ThreeDSecureResult>('/api/stripe/3ds/authenticate', {
        method: 'POST',
        body: { clientSecret, options },
      });
      result.value = res;
      return res;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '3D Secure authentication failed';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const verify = async (paymentIntentId: string): Promise<ThreeDSecureResult> => {
    loading.value = true;
    try {
      const res = await $fetch<ThreeDSecureResult>(`/api/stripe/3ds/verify/${paymentIntentId}`);
      result.value = res;
      return res;
    } finally {
      loading.value = false;
    }
  };

  const isAvailable = async (): Promise<boolean> => {
    try {
      const res = await $fetch<{ available: boolean; }>('/api/stripe/3ds/available');
      return res.available;
    } catch {
      return false;
    }
  };

  const getAuthenticationStatus = async (paymentIntentId: string): Promise<ThreeDSecureAuthentication | null> => {
    loading.value = true;
    try {
      return await $fetch<ThreeDSecureAuthentication | null>(`/api/stripe/3ds/status/${paymentIntentId}`);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    result: readonly(result),
    authenticate,
    verify,
    isAvailable,
    getAuthenticationStatus,
  };
}

export function usePaymentRetry(): UsePaymentRetryReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const result = ref<PaymentRetryResult | null>(null);

  const shouldRetry = (err: string): boolean => {
    const retryableErrors = [
      'api_connection_error',
      'api_error',
      'rate_limit_error',
      'lock_timeout',
      'idempotency_error',
      'processing_error',
      'try_again_later',
      'card_declined_velocity_exceeded',
    ];
    return retryableErrors.includes(err);
  };

  const getRetryDelay = (attempt: number, config: PaymentRetryConfig): number => {
    switch (config.backoffStrategy) {
      case 'exponential':
        return Math.min(config.initialDelay * Math.pow(2, attempt - 1), config.maxDelay);
      case 'linear':
        return Math.min(config.initialDelay * attempt, config.maxDelay);
      case 'fixed':
      default:
        return config.initialDelay;
    }
  };

  const executeWithRetry = async (
    paymentFn: () => Promise<{ success: boolean; error?: string; }>,
    config?: Partial<PaymentRetryConfig>,
  ): Promise<PaymentRetryResult> => {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    const retryHistory: any[] = [];
    let attempts = 0;
    let lastError: string | undefined;

    while (attempts < finalConfig.maxRetries) {
      attempts++;
      const startTime = Date.now();

      try {
        const res = await paymentFn();
        if (res.success) {
          finalConfig.onSuccess?.(attempts);
          return { success: true, attempts, retryHistory };
        }
        lastError = res.error;

        if (!shouldRetry(res.error || '')) {
          return { success: false, attempts, lastError, retryHistory };
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error';
        if (!shouldRetry(lastError)) {
          return { success: false, attempts, lastError, retryHistory };
        }
      }

      retryHistory.push({
        attempt: attempts,
        timestamp: startTime,
        error: lastError,
        delay: getRetryDelay(attempts, finalConfig),
      });
      finalConfig.onRetry?.(attempts, lastError || '');

      if (attempts < finalConfig.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, getRetryDelay(attempts, finalConfig)));
      }
    }

    finalConfig.onFailure?.(attempts, lastError || '');
    return { success: false, attempts, lastError, retryHistory };
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    result: readonly(result),
    executeWithRetry,
    shouldRetry,
    getRetryDelay,
  };
}
