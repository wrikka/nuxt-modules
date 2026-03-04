import { readonly, ref } from 'vue';
import type {
  PaymentResult,
  ReceiptTemplate,
  UsePaymentReceiptsReturn,
} from '#wpayment/types';

export function usePaymentReceipts(): UsePaymentReceiptsReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sendReceipt = async (paymentIntentId: string, email?: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch('/api/receipts/send', {
        method: 'POST',
        body: { paymentIntentId, email },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send receipt';
      error.value = message;
      return { success: false, error: { code: 'send_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const resendReceipt = async (receiptId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/receipts/${receiptId}/resend`, {
        method: 'POST',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend receipt';
      error.value = message;
      return { success: false, error: { code: 'resend_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const getReceipt = async (receiptId: string): Promise<PaymentResult<string>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<{ html: string }>(`/api/receipts/${receiptId}`);

      return { success: true, data: result.html };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get receipt';
      error.value = message;
      return { success: false, error: { code: 'get_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const previewReceipt = async (paymentIntentId: string): Promise<PaymentResult<string>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<{ html: string }>(`/api/receipts/preview/${paymentIntentId}`);

      return { success: true, data: result.html };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to preview receipt';
      error.value = message;
      return { success: false, error: { code: 'preview_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const configureTemplate = async (template: ReceiptTemplate): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch('/api/receipts/template', {
        method: 'POST',
        body: template,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to configure template';
      error.value = message;
      return { success: false, error: { code: 'config_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    sendReceipt,
    resendReceipt,
    getReceipt,
    previewReceipt,
    configureTemplate,
  };
}
