import { readonly, ref } from 'vue';
import type {
  CreateInvoiceItemParams,
  CreateInvoiceParams,
  Invoice,
  InvoiceItem,
  InvoiceLineItem,
  PayInvoiceParams,
  SendInvoiceParams,
  UpdateInvoiceParams,
  UseInvoiceReturn,
} from '#wpayment/types';

export function useInvoice(): UseInvoiceReturn {
  const invoice = ref<Invoice | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreateInvoiceParams): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>('/api/stripe/invoice', {
        method: 'POST',
        body: params,
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (invoiceId: string): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}`);
      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const update = async (invoiceId: string, params: UpdateInvoiceParams): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}`, {
        method: 'PATCH',
        body: params,
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const deleteInvoice = async (invoiceId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/invoice/${invoiceId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const finalize = async (invoiceId: string): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}/finalize`, {
        method: 'POST',
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to finalize invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const pay = async (invoiceId: string, params?: PayInvoiceParams): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}/pay`, {
        method: 'POST',
        body: params,
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pay invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const send = async (invoiceId: string, params?: SendInvoiceParams): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}/send`, {
        method: 'POST',
        body: params,
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const voidInvoice = async (invoiceId: string): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(`/api/stripe/invoice/${invoiceId}/void`, {
        method: 'POST',
      });

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to void invoice';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const markUncollectible = async (invoiceId: string): Promise<Invoice> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice>(
        `/api/stripe/invoice/${invoiceId}/mark-uncollectible`,
        {
          method: 'POST',
        },
      );

      invoice.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark invoice uncollectible';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const list = async (customerId: string): Promise<Invoice[]> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Invoice[]>('/api/stripe/invoices', {
        query: { customer: customerId },
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list invoices';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const listLineItems = async (invoiceId: string): Promise<InvoiceLineItem[]> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<InvoiceLineItem[]>(`/api/stripe/invoice/${invoiceId}/lines`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list invoice line items';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (params: CreateInvoiceItemParams): Promise<InvoiceItem> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<InvoiceItem>('/api/stripe/invoice-item', {
        method: 'POST',
        body: params,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice item';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (itemId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/invoice-item/${itemId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice item';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  return {
    invoice: readonly(invoice),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    delete: deleteInvoice,
    finalize,
    pay,
    send,
    void: voidInvoice,
    markUncollectible,
    list,
    listLineItems,
    createItem,
    deleteItem,
  };
}
