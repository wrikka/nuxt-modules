import { computed, ref } from 'vue';
import type { EventFilterOptions, WebhookEventSelect } from '#webhooks/repository';

export const useWebhookEvents = () => {
  const events = ref<WebhookEventSelect[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(0);

  const filters = ref<EventFilterOptions>({
    limit: 50,
    offset: 0,
  });

  const hasMore = computed(() => events.value.length < totalCount.value);

  const fetchEvents = async (options?: Partial<EventFilterOptions>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      const mergedFilters = { ...filters.value, ...options };

      if (mergedFilters.provider) params.set('provider', mergedFilters.provider);
      if (mergedFilters.type) params.set('type', mergedFilters.type);
      if (mergedFilters.processed !== undefined) params.set('processed', String(mergedFilters.processed));
      if (mergedFilters.startDate) params.set('startDate', mergedFilters.startDate.toISOString());
      if (mergedFilters.endDate) params.set('endDate', mergedFilters.endDate.toISOString());
      if (mergedFilters.search) params.set('search', mergedFilters.search);
      if (mergedFilters.limit) params.set('limit', String(mergedFilters.limit));
      if (mergedFilters.offset) params.set('offset', String(mergedFilters.offset));

      const response = await fetch(`/api/webhooks/events?${params}`).then(r => r.json()) as unknown as {
        events: WebhookEventSelect[];
        total: number;
      };

      if (options?.offset && options.offset > 0) {
        events.value = [...events.value, ...response.events];
      } else {
        events.value = response.events;
      }
      totalCount.value = response.total;

      filters.value = mergedFilters;
      return response.events;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch events';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;
    return fetchEvents({ offset: events.value.length });
  };

  const refresh = async () => {
    return fetchEvents({ offset: 0 });
  };

  const setFilter = (key: keyof EventFilterOptions, value: EventFilterOptions[keyof EventFilterOptions]) => {
    filters.value = { ...filters.value, [key]: value, offset: 0 };
  };

  const clearFilters = () => {
    filters.value = { limit: 50, offset: 0 };
  };

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`/api/webhooks/events/${id}`, { method: 'DELETE' });
      events.value = events.value.filter((e: WebhookEventSelect) => e.id !== id);
      totalCount.value = Math.max(0, totalCount.value - 1);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete event';
      return false;
    }
  };

  const retryEvent = async (id: string) => {
    try {
      await fetch(`/api/webhooks/events/${id}/retry`, { method: 'POST' });
      await refresh();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to retry event';
      return false;
    }
  };

  return {
    events: computed(() => events.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    totalCount: computed(() => totalCount.value),
    hasMore,
    filters: computed(() => filters.value),
    fetchEvents,
    loadMore,
    refresh,
    setFilter,
    clearFilters,
    deleteEvent,
    retryEvent,
  };
};
