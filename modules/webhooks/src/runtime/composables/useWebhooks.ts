import { ref } from 'vue';
import type { WebhookEvent, WebhookEventLog } from '#webhooks/types';

export const useWebhooks = () => {
  const events = ref<WebhookEvent[]>([]);
  const logs = ref<WebhookEventLog[]>([]);

  const isDebugEnabled = ref(false);

  const addEvent = (event: WebhookEvent) => {
    events.value.unshift(event);
    if (events.value.length > 100) {
      events.value.pop();
    }
  };

  const addLog = (log: WebhookEventLog) => {
    logs.value.unshift(log);
    if (logs.value.length > 500) {
      logs.value.pop();
    }
  };

  const getEvents = async (options?: {
    provider?: string;
    type?: string;
    limit?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (options?.provider) params.set('provider', options.provider);
      if (options?.type) params.set('type', options.type);
      if (options?.limit) params.set('limit', String(options.limit));

      const result = await fetch(`/api/webhooks/events?${params}`).then(r => r.json()) as unknown as WebhookEvent[];
      events.value = result;
      return result;
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Webhooks] Error fetching events:', error);
      }
      return [];
    }
  };

  const retryEvent = async (eventId: string) => {
    try {
      await fetch(`/api/webhooks/events/${eventId}/retry`, { method: 'POST' });
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Webhooks] Error retrying event:', error);
      }
    }
  };

  return {
    events,
    logs,
    addEvent,
    addLog,
    getEvents,
    retryEvent,
  };
};
