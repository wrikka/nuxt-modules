import { onUnmounted, ref } from 'vue';
import type { WebhookEventSelect } from '#webhooks/repository';

export const useWebhookStream = () => {
  const events = ref<WebhookEventSelect[]>([]);
  const isConnected = ref(false);
  const error = ref<string | null>(null);
  let eventSource: EventSource | null = null;

  const connect = () => {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource('/api/webhooks/stream');

    eventSource.onopen = () => {
      isConnected.value = true;
      error.value = null;
    };

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as WebhookEventSelect;
        events.value = [data, ...events.value].slice(0, 100);
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      isConnected.value = false;
      error.value = 'Connection lost. Reconnecting...';
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (!isConnected.value) {
          connect();
        }
      }, 5000);
    };
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    isConnected.value = false;
  };

  const clearEvents = () => {
    events.value = [];
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    events,
    isConnected: ref(isConnected.value),
    error,
    connect,
    disconnect,
    clearEvents,
  };
};
