import { readonly, ref } from 'vue';
import type { CreateRefundParams, ListRefundsParams, Refund, UpdateRefundParams, UseRefundReturn } from '#wpayment/types';

export function useRefund(): UseRefundReturn {
  const refund = ref<Refund | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreateRefundParams): Promise<Refund> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Refund>('/api/stripe/refund', {
        method: 'POST',
        body: params,
      });

      refund.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create refund';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (refundId: string): Promise<Refund> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Refund>(`/api/stripe/refund/${refundId}`);
      refund.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve refund';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const update = async (refundId: string, params: UpdateRefundParams): Promise<Refund> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Refund>(`/api/stripe/refund/${refundId}`, {
        method: 'PATCH',
        body: params,
      });

      refund.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update refund';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const cancel = async (refundId: string): Promise<Refund> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Refund>(`/api/stripe/refund/${refundId}/cancel`, {
        method: 'POST',
      });

      refund.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel refund';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const list = async (params?: ListRefundsParams): Promise<Refund[]> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Refund[]>('/api/stripe/refunds', {
        query: params,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list refunds';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  return {
    refund: readonly(refund),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    cancel,
    list,
  };
}
