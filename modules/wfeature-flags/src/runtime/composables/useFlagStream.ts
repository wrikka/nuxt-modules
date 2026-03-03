import { onMounted, onUnmounted, ref } from 'vue';
import type { FlagEvent, SSEConfig } from '#feature-flags/types';

export const useFlagStream = () => {
  const config = useRuntimeConfig();
  const sseConfig: SSEConfig = config.public.featureFlags?.realtime
    ?? { enabled: true, reconnectInterval: 3000, maxReconnectAttempts: 5 };
  const debug = config.public.featureFlags?.debug ?? false;

  const isConnected = ref(false);
  const lastEvent = ref<FlagEvent | null>(null);
  const reconnectAttempts = ref(0);

  let eventSource: EventSource | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  const connect = () => {
    if (!sseConfig.enabled || !import.meta.client) {
      return;
    }

    if (eventSource) {
      eventSource.close();
    }

    try {
      eventSource = new EventSource('/api/feature-flags/stream');

      eventSource.onopen = () => {
        isConnected.value = true;
        reconnectAttempts.value = 0;

        if (debug) {
          console.log('[FeatureFlags] SSE connected');
        }
      };

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const flagEvent: FlagEvent = JSON.parse(event.data);
          lastEvent.value = flagEvent;

          if (debug) {
            console.log('[FeatureFlags] SSE event:', flagEvent);
          }
        } catch {
          // Ignore parse errors
        }
      };

      eventSource.onerror = () => {
        isConnected.value = false;
        eventSource?.close();
        eventSource = null;

        if (reconnectAttempts.value < sseConfig.maxReconnectAttempts) {
          reconnectAttempts.value++;

          if (debug) {
            console.log(
              `[FeatureFlags] SSE reconnecting (${reconnectAttempts.value}/${sseConfig.maxReconnectAttempts})`,
            );
          }

          reconnectTimeout = setTimeout(connect, sseConfig.reconnectInterval);
        } else if (debug) {
          console.error('[FeatureFlags] SSE max reconnect attempts reached');
        }
      };
    } catch (error) {
      if (debug) {
        console.error('[FeatureFlags] SSE connection error:', error);
      }
    }
  };

  const disconnect = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    isConnected.value = false;
  };

  const onEvent = (callback: (event: FlagEvent) => void) => {
    const handler = (event: MessageEvent) => {
      try {
        const flagEvent: FlagEvent = JSON.parse(event.data);
        callback(flagEvent);
      } catch {
        // Ignore parse errors
      }
    };

    eventSource?.addEventListener('message', handler);

    return () => {
      eventSource?.removeEventListener('message', handler);
    };
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    lastEvent,
    reconnectAttempts,
    connect,
    disconnect,
    onEvent,
  };
};
