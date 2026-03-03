import { computed, ref } from 'vue';
import type { WebhookEventSelect } from '#webhooks/repository';

export const useWebhookBulk = () => {
  const selectedIds = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastResult = ref<{ success: number; failed: number; } | null>(null);

  const hasSelection = computed(() => selectedIds.value.length > 0);
  const selectionCount = computed(() => selectedIds.value.length);

  const select = (id: string) => {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value.push(id);
    }
  };

  const deselect = (id: string) => {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  };

  const toggle = (id: string) => {
    if (selectedIds.value.includes(id)) {
      deselect(id);
    } else {
      select(id);
    }
  };

  const selectAll = (ids: string[]) => {
    selectedIds.value = ids;
  };

  const clearSelection = () => {
    selectedIds.value = [];
  };

  const isSelected = (id: string) => selectedIds.value.includes(id);

  const processBulk = async (eventIds: string[]) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/bulk/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: eventIds }),
      }).then(r => r.json());
      lastResult.value = response;
      selectedIds.value = [];
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to process bulk action';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.value.length === 0) return false;

    return processBulk(selectedIds.value);
  };

  const bulkRetry = async () => {
    if (selectedIds.value.length === 0) return false;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/events/bulk-retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds.value }),
      }).then(r => r.json());
      lastResult.value = response;
      clearSelection();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Bulk retry failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const bulkExport = async (format: 'json' | 'csv' = 'json') => {
    if (selectedIds.value.length === 0) return null;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<WebhookEventSelect[]>('/api/webhooks/events/export', {
        method: 'POST',
        body: { ids: selectedIds.value, format },
      });

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['id', 'provider', 'type', 'timestamp', 'processed', 'error'];
        const rows = response.map((
          e: WebhookEventSelect,
        ) => [e.id, e.provider, e.type, e.timestamp, e.processed, e.error ?? '']);
        const csv = [headers.join(','), ...rows.map(r => r.map(v => String(v)).join(','))].join('\n');
        return { data: csv, filename: 'webhook-events.csv' };
      }

      return { data: JSON.stringify(response, null, 2), filename: 'webhook-events.json' };
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Export failed';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    selectedIds: computed(() => selectedIds.value),
    hasSelection,
    selectionCount,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    lastResult: computed(() => lastResult.value),
    select,
    deselect,
    toggle,
    selectAll,
    clearSelection,
    isSelected,
    bulkDelete,
    bulkRetry,
    bulkExport,
  };
};
