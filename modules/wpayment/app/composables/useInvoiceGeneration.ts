import { readonly, ref } from 'vue';
import type {
  GenerateInvoiceParams,
  InvoiceTemplate,
  PaymentResult,
  UnifiedInvoice,
  UseInvoiceGenerationReturn,
} from '#wpayment/types';

export function useInvoiceGeneration(): UseInvoiceGenerationReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const generate = async (params: GenerateInvoiceParams): Promise<PaymentResult<UnifiedInvoice>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<UnifiedInvoice>('/api/invoices', {
        method: 'POST',
        body: {
          ...params,
          dueDate: params.dueDays ? new Date(Date.now() + params.dueDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
        },
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate invoice';
      error.value = message;
      return { success: false, error: { code: 'generate_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const send = async (invoiceId: string, email?: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        body: { email },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invoice';
      error.value = message;
      return { success: false, error: { code: 'send_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const voidInvoice = async (invoiceId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/invoices/${invoiceId}/void`, {
        method: 'POST',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to void invoice';
      error.value = message;
      return { success: false, error: { code: 'void_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const finalize = async (invoiceId: string): Promise<PaymentResult<UnifiedInvoice>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<UnifiedInvoice>(`/api/invoices/${invoiceId}/finalize`, {
        method: 'POST',
      });

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to finalize invoice';
      error.value = message;
      return { success: false, error: { code: 'finalize_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const getPdf = async (invoiceId: string): Promise<string> => {
    const result = await $fetch<{ url: string }>(`/api/invoices/${invoiceId}/pdf`);
    return result.url;
  };

  const customizeTemplate = async (template: InvoiceTemplate): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch('/api/invoices/template', {
        method: 'POST',
        body: template,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to customize template';
      error.value = message;
      return { success: false, error: { code: 'customize_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    generate,
    send,
    void: voidInvoice,
    finalize,
    getPdf,
    customizeTemplate,
  };
}
