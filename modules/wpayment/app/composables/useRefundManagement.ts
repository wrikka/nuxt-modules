import { readonly, ref } from 'vue';
import type {
  PaymentResult,
  RefundHistoryItem,
  RefundParams,
  UnifiedPaymentIntent,
  UseRefundManagementReturn,
} from '#wpayment/types';

export function useRefundManagement(): UseRefundManagementReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const processRefund = async (params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<UnifiedPaymentIntent>('/api/refunds', {
        method: 'POST',
        body: params,
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process refund';
      error.value = message;
      return { success: false, error: { code: 'refund_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const getRefundStatus = async (refundId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/refunds/${refundId}/status`);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get refund status';
      error.value = message;
      return { success: false, error: { code: 'status_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const cancelRefund = async (refundId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/refunds/${refundId}/cancel`, {
        method: 'POST',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel refund';
      error.value = message;
      return { success: false, error: { code: 'cancel_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const getRefundHistory = async (paymentIntentId: string): Promise<RefundHistoryItem[]> => {
    const result = await $fetch<RefundHistoryItem[]>(`/api/refunds/history/${paymentIntentId}`);
    return result;
  };

  const canRefund = async (paymentIntentId: string, amount?: number): Promise<boolean> => {
    try {
      const result = await $fetch<{ canRefund: boolean }>(`/api/refunds/can-refund/${paymentIntentId}`, {
        query: amount ? { amount } : undefined,
      });

      return result.canRefund;
    } catch {
      return false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    processRefund,
    getRefundStatus,
    cancelRefund,
    getRefundHistory,
    canRefund,
  };
}
