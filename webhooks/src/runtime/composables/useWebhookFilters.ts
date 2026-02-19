import { computed, ref } from 'vue';
import type { WebhookProvider } from '#webhooks/types';

export interface FilterState {
  provider: WebhookProvider | 'all';
  status: 'all' | 'processed' | 'failed' | 'pending';
  search: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  eventType: string;
}

export const useWebhookFilters = () => {
  const filters = ref<FilterState>({
    provider: 'all',
    status: 'all',
    search: '',
    dateRange: {
      start: null,
      end: null,
    },
    eventType: '',
  });

  const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.value.provider !== 'all') count++;
    if (filters.value.status !== 'all') count++;
    if (filters.value.search) count++;
    if (filters.value.dateRange.start || filters.value.dateRange.end) count++;
    if (filters.value.eventType) count++;
    return count;
  });

  const hasActiveFilters = computed(() => activeFilterCount.value > 0);

  const setProvider = (provider: WebhookProvider | 'all') => {
    filters.value = { ...filters.value, provider };
  };

  const setStatus = (status: FilterState['status']) => {
    filters.value = { ...filters.value, status };
  };

  const setSearch = (search: string) => {
    filters.value = { ...filters.value, search };
  };

  const setDateRange = (start: Date | null, end: Date | null) => {
    filters.value = {
      ...filters.value,
      dateRange: { start, end },
    };
  };

  const setEventType = (eventType: string) => {
    filters.value = { ...filters.value, eventType };
  };

  const clearFilters = () => {
    filters.value = {
      provider: 'all',
      status: 'all',
      search: '',
      dateRange: { start: null, end: null },
      eventType: '',
    };
  };

  const toggleProvider = (provider: WebhookProvider) => {
    if (filters.value.provider === provider) {
      setProvider('all');
    } else {
      setProvider(provider);
    }
  };

  const toggleStatus = (status: FilterState['status']) => {
    if (filters.value.status === status) {
      setStatus('all');
    } else {
      setStatus(status);
    }
  };

  return {
    filters: computed(() => filters.value),
    activeFilterCount,
    hasActiveFilters,
    setProvider,
    setStatus,
    setSearch,
    setDateRange,
    setEventType,
    clearFilters,
    toggleProvider,
    toggleStatus,
  };
};
