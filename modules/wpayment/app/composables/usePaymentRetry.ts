import { readonly, ref } from 'vue';
import type {
  PaymentResult,
  RetryConfig,
  PaymentRetryState,
  PaymentError,
  UsePaymentRetryReturn,
} from '#wpayment/types';

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  maxDelay: 30000,
  retryableErrors: ['card_error', 'processing_error', 'timeout', 'rate_limit'],
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const calculateDelay = (attempt: number, config: RetryConfig): number => {
  if (!config.exponentialBackoff) {
    return config.retryDelay;
  }

  const delay = config.retryDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

const isRetryableError = (error: PaymentError, config: RetryConfig): boolean => {
  if (!error.retryable) return false;
  return config.retryableErrors.some(code =>
    error.code.includes(code) || error.declineCode?.includes(code),
  );
};

export function usePaymentRetry(): UsePaymentRetryReturn {
  const state = ref<PaymentRetryState>({
    attempt: 0,
    canRetry: true,
  });

  const canRetry = computed(() => state.value.canRetry);

  const reset = (): void => {
    state.value = {
      attempt: 0,
      canRetry: true,
    };
  };

  const execute = async <T>(
    operation: () => Promise<PaymentResult<T>>,
    config?: Partial<RetryConfig>,
  ): Promise<PaymentResult<T>> => {
    const finalConfig = { ...defaultRetryConfig, ...config };

    reset();

    while (state.value.attempt <= finalConfig.maxRetries) {
      state.value.attempt++;

      try {
        const result = await operation();

        if (result.success) {
          state.value.canRetry = false;
          return result;
        }

        if (!result.error || !isRetryableError(result.error, finalConfig)) {
          state.value.canRetry = false;
          state.value.lastError = result.error;
          return result;
        }

        if (state.value.attempt > finalConfig.maxRetries) {
          state.value.canRetry = false;
          state.value.lastError = result.error;
          return {
            success: false,
            error: {
              code: 'max_retries_exceeded',
              message: `Maximum retry attempts (${finalConfig.maxRetries}) exceeded`,
              retryable: false,
            },
          };
        }

        const delay = calculateDelay(state.value.attempt, finalConfig);
        state.value.nextRetryAt = new Date(Date.now() + delay);
        state.value.lastError = result.error;

        await sleep(delay);
      } catch (err) {
        const error: PaymentError = {
          code: 'unexpected_error',
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
          retryable: true,
        };

        if (state.value.attempt > finalConfig.maxRetries) {
          state.value.canRetry = false;
          state.value.lastError = error;
          return { success: false, error };
        }

        const delay = calculateDelay(state.value.attempt, finalConfig);
        state.value.nextRetryAt = new Date(Date.now() + delay);
        state.value.lastError = error;

        await sleep(delay);
      }
    }

    return {
      success: false,
      error: {
        code: 'retry_failed',
        message: 'Operation failed after maximum retry attempts',
        retryable: false,
      },
    };
  };

  return {
    state: readonly(state),
    execute,
    reset,
    canRetry: readonly(canRetry),
  };
}
