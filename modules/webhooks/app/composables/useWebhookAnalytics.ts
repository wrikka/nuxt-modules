import { computed, ref } from 'vue';
import type { WebhookTimeSeriesData } from './useWebhookStats';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesChartOptions {
  interval: 'hour' | 'day' | 'week';
  showSuccessRate: boolean;
}

export const useWebhookAnalytics = () => {
  const data = ref<WebhookTimeSeriesData[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const providerColors: Record<string, string> = {
    stripe: '#635bff',
    github: '#333333',
    slack: '#4a154b',
    custom: '#64748b',
  };

  const successColor = '#22c55e';
  const failedColor = '#ef4444';
  const pendingColor = '#f59e0b';

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/analytics').then(r => r.json());
      data.value = response;
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch analytics';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const eventCountChartData = computed<ChartDataPoint[]>(() => {
    return data.value.map(item => ({
      label: item.timestamp,
      value: item.count,
    }));
  });

  const successFailedChartData = computed<{ success: ChartDataPoint[]; failed: ChartDataPoint[]; }>(() => {
    return {
      success: data.value.map(item => ({
        label: item.timestamp,
        value: item.success,
        color: successColor,
      })),
      failed: data.value.map(item => ({
        label: item.timestamp,
        value: item.failed,
        color: failedColor,
      })),
    };
  });

  const successRateChartData = computed<ChartDataPoint[]>(() => {
    return data.value.map(item => {
      const total = item.success + item.failed;
      const rate = total > 0 ? (item.success / total) * 100 : 0;
      return {
        label: item.timestamp,
        value: rate,
        color: rate >= 95 ? successColor : rate >= 80 ? pendingColor : failedColor,
      };
    });
  });

  return {
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    providerColors,
    successColor,
    failedColor,
    pendingColor,
    fetchData,
    eventCountChartData,
    successFailedChartData,
    successRateChartData,
  };
};
