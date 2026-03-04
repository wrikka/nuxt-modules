import { readonly, ref } from 'vue';
import type {
  UnifiedPaymentIntent,
  TransactionSearchParams,
  UseTransactionSearchReturn,
} from '#wpayment/types';

export function useTransactionSearch(): UseTransactionSearchReturn {
  const results = ref<UnifiedPaymentIntent[]>([]);
  const loading = ref(false);
  const hasMore = ref(false);
  const currentCursor = ref<string | undefined>(undefined);
  const currentParams = ref<TransactionSearchParams>({});

  const search = async (params: TransactionSearchParams): Promise<void> => {
    loading.value = true;
    currentParams.value = params;
    currentCursor.value = undefined;

    try {
      const response = await $fetch<{
        payments: UnifiedPaymentIntent[];
        hasMore: boolean;
        nextCursor?: string;
      }>('/api/payments/search', {
        method: 'POST',
        body: { ...params, cursor: undefined },
      });

      results.value = response.payments;
      hasMore.value = response.hasMore;
      currentCursor.value = response.nextCursor;
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async (): Promise<void> => {
    if (!hasMore.value || !currentCursor.value) return;

    loading.value = true;

    try {
      const response = await $fetch<{
        payments: UnifiedPaymentIntent[];
        hasMore: boolean;
        nextCursor?: string;
      }>('/api/payments/search', {
        method: 'POST',
        body: { ...currentParams.value, cursor: currentCursor.value },
      });

      results.value = [...results.value, ...response.payments];
      hasMore.value = response.hasMore;
      currentCursor.value = response.nextCursor;
    } finally {
      loading.value = false;
    }
  };

  const exportResults = async (format: 'csv' | 'json'): Promise<string> => {
    const response = await $fetch<{ url: string }>('/api/payments/export', {
      method: 'POST',
      body: {
        format,
        filters: currentParams.value,
      },
    });

    return response.url;
  };

  return {
    results: readonly(results),
    loading: readonly(loading),
    hasMore: readonly(hasMore),
    search,
    loadMore,
    exportResults,
  };
}
