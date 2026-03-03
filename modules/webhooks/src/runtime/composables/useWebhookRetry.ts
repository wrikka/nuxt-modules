import { computed, ref } from 'vue';
import type { WebhookEventSelect } from '#webhooks/repository';

export interface RetryQueueItem {
  id: string;
  eventId: string;
  event: WebhookEventSelect;
  scheduledAt: Date;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const useWebhookRetry = () => {
  const retryQueue = ref<RetryQueueItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const pendingRetries = computed(() => retryQueue.value.filter((item: RetryQueueItem) => item.status === 'pending'));

  const failedRetries = computed(() => retryQueue.value.filter((item: RetryQueueItem) => item.status === 'failed'));

  const fetchRetryQueue = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/retry-queue');
      const data = (await response.json()) as RetryQueueItem[];
      retryQueue.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch retry queue';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const retryEvent = async (eventId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await fetch(`/api/webhooks/events/${eventId}/retry`, { method: 'POST' });
      await fetchRetryQueue();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to retry event';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const retryAllFailed = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await fetch('/api/webhooks/retry-queue/retry-all', { method: 'POST' });
      await fetchRetryQueue();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to retry all events';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelRetry = async (retryId: string) => {
    try {
      await fetch(`/api/webhooks/retry-queue/${retryId}`, { method: 'DELETE' });
      retryQueue.value = retryQueue.value.filter((item: RetryQueueItem) => item.id !== retryId);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to cancel retry';
      return false;
    }
  };

  const scheduleRetry = async (eventId: string, scheduledAt: Date, maxAttempts = 3) => {
    try {
      const response = await fetch('/api/webhooks/retry-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, scheduledAt, maxAttempts }),
      });
      const data = (await response.json()) as RetryQueueItem;
      retryQueue.value.push(data);
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to schedule retry';
      return null;
    }
  };

  return {
    retryQueue: computed(() => retryQueue.value),
    pendingRetries,
    failedRetries,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchRetryQueue,
    retryEvent,
    retryAllFailed,
    cancelRetry,
    scheduleRetry,
  };
};
