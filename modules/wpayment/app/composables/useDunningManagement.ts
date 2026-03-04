import { readonly, ref } from 'vue';
import type {
  DunningStats,
  UnifiedPaymentIntent,
  PaymentResult,
  UseDunningManagementReturn,
} from '#wpayment/types';

export function useDunningManagement(): UseDunningManagementReturn {
  const failedPayments = ref<UnifiedPaymentIntent[]>([]);
  const loading = ref(false);

  const loadFailedPayments = async (customerId: string): Promise<void> => {
    loading.value = true;

    try {
      const result = await $fetch<UnifiedPaymentIntent[]>('/api/dunning/failed-payments', {
        query: { customerId },
      });
      failedPayments.value = result;
    } finally {
      loading.value = false;
    }
  };

  const retryPayment = async (
    paymentIntentId: string,
    paymentMethodId?: string,
  ): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/dunning/retry', {
        method: 'POST',
        body: { paymentIntentId, paymentMethodId },
      });

      failedPayments.value = failedPayments.value.filter(p => p.id !== paymentIntentId);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retry payment';
      return { success: false, error: { code: 'retry_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
      return { success: false, error: { code: 'cancel_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const updatePaymentMethod = async (
    subscriptionId: string,
    paymentMethodId: string,
  ): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch(`/api/subscription/${subscriptionId}/payment-method`, {
        method: 'POST',
        body: { paymentMethodId },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update payment method';
      return { success: false, error: { code: 'update_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const sendDunningEmail = async (
    customerId: string,
    paymentIntentId: string,
  ): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/dunning/send-email', {
        method: 'POST',
        body: { customerId, paymentIntentId },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send dunning email';
      return { success: false, error: { code: 'email_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const getDunningStats = async (customerId: string): Promise<DunningStats> => {
    const result = await $fetch<DunningStats>('/api/dunning/stats', {
      query: { customerId },
    });

    return result;
  };

  return {
    failedPayments: readonly(failedPayments),
    loading: readonly(loading),
    loadFailedPayments,
    retryPayment,
    cancelSubscription,
    updatePaymentMethod,
    sendDunningEmail,
    getDunningStats,
  };
}
