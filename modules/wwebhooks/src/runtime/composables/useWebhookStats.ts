import { computed, ref } from 'vue';

export interface WebhookStatistics {
  total: number;
  byProvider: Record<string, number>;
  byStatus: { processed: number; failed: number; pending: number; };
  successRate: number;
}

export interface WebhookTimeSeriesData {
  timestamp: string;
  count: number;
  success: number;
  failed: number;
}

export const useWebhookStats = () => {
  const statistics = ref<WebhookStatistics>({
    total: 0,
    byProvider: {},
    byStatus: { processed: 0, failed: 0, pending: 0 },
    successRate: 0,
  });
  const timeSeriesData = ref<WebhookTimeSeriesData[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const dateRange = ref<{ start: Date | null; end: Date | null; }>({
    start: null,
    end: null,
  });

  const fetchStatistics = async (startDate?: Date, endDate?: Date) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate.toISOString());
      if (endDate) params.set('endDate', endDate.toISOString());

      const response = await fetch(`/api/webhooks/stats?${params}`);
      const data = (await response.json()) as WebhookStatistics;
      statistics.value = data;
      dateRange.value = { start: startDate ?? null, end: endDate ?? null };
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch statistics';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTimeSeries = async (interval: 'hour' | 'day' | 'week' = 'day', startDate?: Date, endDate?: Date) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      params.set('interval', interval);
      if (startDate) params.set('startDate', startDate.toISOString());
      if (endDate) params.set('endDate', endDate.toISOString());

      const response = await fetch(`/api/webhooks/stats/timeseries?${params}`);
      const data = (await response.json()) as WebhookTimeSeriesData[];
      timeSeriesData.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch time series';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const providerChartData = computed(() => {
    const data = statistics.value.byProvider;
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  });

  const statusChartData = computed(() => {
    const { byStatus } = statistics.value;
    return [
      { name: 'Processed', value: byStatus.processed, color: '#22c55e' },
      { name: 'Failed', value: byStatus.failed, color: '#ef4444' },
      { name: 'Pending', value: byStatus.pending, color: '#f59e0b' },
    ];
  });

  return {
    statistics: computed(() => statistics.value),
    timeSeriesData: computed(() => timeSeriesData.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    dateRange: computed(() => dateRange.value),
    providerChartData,
    statusChartData,
    fetchStatistics,
    fetchTimeSeries,
  };
};
