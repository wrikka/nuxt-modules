import { readonly, ref } from 'vue';
import type {
  PaymentStats,
  DateRange,
  RevenueTrend,
  PaymentMethodBreakdown,
  FailedPaymentAnalysis,
  UsePaymentAnalyticsReturn,
} from '#wpayment/types';

export function usePaymentAnalytics(): UsePaymentAnalyticsReturn {
  const stats = ref<PaymentStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    refundedAmount: 0,
    averageTransactionValue: 0,
    conversionRate: 0,
    mrr: 0,
    arr: 0,
  });
  const loading = ref(false);
  const dateRange = ref<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const loadStats = async (range?: DateRange): Promise<void> => {
    loading.value = true;

    try {
      const targetRange = range || dateRange.value;
      const result = await $fetch<PaymentStats>('/api/analytics/stats', {
        query: {
          start: targetRange.start.toISOString(),
          end: targetRange.end.toISOString(),
        },
      });

      stats.value = result;
      if (range) {
        dateRange.value = range;
      }
    } finally {
      loading.value = false;
    }
  };

  const getRevenueTrend = async (days: number): Promise<RevenueTrend[]> => {
    const result = await $fetch<RevenueTrend[]>('/api/analytics/revenue-trend', {
      query: { days },
    });

    return result;
  };

  const getPaymentMethodBreakdown = async (): Promise<PaymentMethodBreakdown[]> => {
    const result = await $fetch<PaymentMethodBreakdown[]>('/api/analytics/payment-methods');

    return result;
  };

  const getFailedPaymentAnalysis = async (): Promise<FailedPaymentAnalysis> => {
    const result = await $fetch<FailedPaymentAnalysis>('/api/analytics/failed-payments');

    return result;
  };

  const exportReport = async (format: 'csv' | 'json', range: DateRange): Promise<string> => {
    const result = await $fetch<{ url: string }>('/api/analytics/export', {
      method: 'POST',
      body: {
        format,
        start: range.start.toISOString(),
        end: range.end.toISOString(),
      },
    });

    return result.url;
  };

  return {
    stats: readonly(stats),
    loading: readonly(loading),
    dateRange: readonly(dateRange),
    loadStats,
    getRevenueTrend,
    getPaymentMethodBreakdown,
    getFailedPaymentAnalysis,
    exportReport,
  };
}
