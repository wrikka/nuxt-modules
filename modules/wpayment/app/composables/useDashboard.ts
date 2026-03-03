import { type Ref, ref } from 'vue';
import type {
  DashboardFilter,
  DashboardMetrics,
  RevenueData,
  SubscriptionSummary,
  TransactionSummary,
} from '#wpayment/types';

export interface UseDashboardReturn {
  metrics: Ref<DashboardMetrics | null>;
  revenueData: Ref<RevenueData[]>;
  transactions: Ref<TransactionSummary[]>;
  subscriptions: Ref<SubscriptionSummary[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  fetchDashboard: (filter?: DashboardFilter) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const metrics = ref<DashboardMetrics | null>(null);
  const revenueData = ref<RevenueData[]>([]);
  const transactions = ref<TransactionSummary[]>([]);
  const subscriptions = ref<SubscriptionSummary[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDashboard = async (filter?: DashboardFilter): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/dashboard', {
        query: filter || { dateRange: '30d' },
      });

      const data = response as {
        metrics: DashboardMetrics;
        revenueData: RevenueData[];
        transactions: TransactionSummary[];
        subscriptions: SubscriptionSummary[];
      };

      metrics.value = data.metrics;
      revenueData.value = data.revenueData;
      transactions.value = data.transactions;
      subscriptions.value = data.subscriptions;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
    } finally {
      loading.value = false;
    }
  };

  const refresh = async (): Promise<void> => {
    await fetchDashboard();
  };

  return {
    metrics,
    revenueData,
    transactions,
    subscriptions,
    loading,
    error,
    fetchDashboard,
    refresh,
  };
}
