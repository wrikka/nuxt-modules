import { computed, onScopeDispose, ref, watch } from 'vue';
import type { Notification, NotificationsConfig } from '#notifications/types';
import { useNotifications } from './useNotifications';
import { useRuntimeConfig } from 'nuxt/app';

export interface RealtimeConfig {
  enabled: boolean;
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface RealtimeConnection {
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
  lastConnected: Date | null;
}

type RealtimeEventType = 'notification:new' | 'notification:read' | 'notification:delete' | 'notification:clear';

interface RealtimeEvent {
  type: RealtimeEventType;
  payload: Notification | { id: string; } | { ids: string[]; };
  timestamp: Date;
}

const connections = new Map<string, WebSocket | EventSource>();

export const useRealtimeNotifications = (config?: Partial<RealtimeConfig>) => {
  const runtimeConfig = useRuntimeConfig();
  const notificationsConfig = runtimeConfig.public.notifications as NotificationsConfig;

  const defaultConfig: RealtimeConfig = {
    enabled: notificationsConfig.realtime ?? false,
    url: undefined,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
  };

  const mergedConfig = { ...defaultConfig, ...config };

  const connectionState = ref<RealtimeConnection>({
    isConnected: false,
    isReconnecting: false,
    error: null,
    lastConnected: null,
  });

  const reconnectAttempts = ref(0);
  const eventHandlers = new Map<RealtimeEventType, Set<(payload: unknown) => void>>();

  let connection: WebSocket | EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const { add, remove, markAsRead, clearAll } = useNotifications();

  const getWebSocketUrl = () => {
    if (mergedConfig.url) {
      return mergedConfig.url;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/notifications/ws`;
  };

  const getEventSourceUrl = () => {
    if (mergedConfig.url) {
      return mergedConfig.url;
    }
    return '/api/notifications/stream';
  };

  const handleEvent = (event: RealtimeEvent) => {
    const handlers = eventHandlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event.payload);
      }
    }

    // Auto-handle common events
    switch (event.type) {
      case 'notification:new':
        add(event.payload as Omit<Notification, 'id' | 'read' | 'createdAt'>);
        break;
      case 'notification:read':
        markAsRead((event.payload as { id: string; }).id);
        break;
      case 'notification:delete':
        remove((event.payload as { id: string; }).id);
        break;
      case 'notification:clear':
        clearAll();
        break;
    }
  };

  const connectWebSocket = () => {
    const url = getWebSocketUrl();

    connection = new WebSocket(url);

    connection.onopen = () => {
      connectionState.value = {
        isConnected: true,
        isReconnecting: false,
        error: null,
        lastConnected: new Date(),
      };
      reconnectAttempts.value = 0;

      // Start heartbeat
      if (mergedConfig.heartbeatInterval) {
        heartbeatTimer = setInterval(() => {
          if (connection instanceof WebSocket && connection.readyState === WebSocket.OPEN) {
            connection.send(JSON.stringify({ type: 'ping' }));
          }
        }, mergedConfig.heartbeatInterval);
      }
    };

    connection.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as RealtimeEvent;
        handleEvent(data);
      } catch {
        // Invalid JSON, ignore
      }
    };

    connection.onclose = () => {
      connectionState.value.isConnected = false;
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      attemptReconnect();
    };

    connection.onerror = () => {
      connectionState.value.error = 'WebSocket connection error';
    };

    connections.set(url, connection);
  };

  const connectEventSource = () => {
    const url = getEventSourceUrl();

    connection = new EventSource(url);

    connection.onopen = () => {
      connectionState.value = {
        isConnected: true,
        isReconnecting: false,
        error: null,
        lastConnected: new Date(),
      };
      reconnectAttempts.value = 0;
    };

    connection.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as RealtimeEvent;
        handleEvent(data);
      } catch {
        // Invalid JSON, ignore
      }
    };

    connection.onerror = () => {
      connectionState.value.isConnected = false;
      connectionState.value.error = 'EventSource connection error';
      attemptReconnect();
    };

    connections.set(url, connection);
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.value >= (mergedConfig.maxReconnectAttempts ?? 5)) {
      connectionState.value.error = 'Max reconnection attempts reached';
      connectionState.value.isReconnecting = false;
      return;
    }

    connectionState.value.isReconnecting = true;
    reconnectAttempts.value++;

    reconnectTimer = setTimeout(() => {
      connect();
    }, mergedConfig.reconnectInterval);
  };

  const connect = () => {
    if (!mergedConfig.enabled || !import.meta.client) {
      return;
    }

    disconnect();

    // Prefer WebSocket for bidirectional, fallback to SSE
    try {
      connectWebSocket();
    } catch {
      connectEventSource();
    }
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }

    if (connection) {
      if (connection instanceof WebSocket) {
        connection.close();
      } else {
        connection.close();
      }
      connection = null;
    }

    connectionState.value = {
      isConnected: false,
      isReconnecting: false,
      error: null,
      lastConnected: null,
    };
  };

  const on = (eventType: RealtimeEventType, handler: (payload: unknown) => void) => {
    if (!eventHandlers.has(eventType)) {
      eventHandlers.set(eventType, new Set());
    }
    eventHandlers.get(eventType)?.add(handler);

    // Return unsubscribe function
    return () => {
      eventHandlers.get(eventType)?.delete(handler);
    };
  };

  const off = (eventType: RealtimeEventType, handler?: (payload: unknown) => void) => {
    if (handler) {
      eventHandlers.get(eventType)?.delete(handler);
    } else {
      eventHandlers.delete(eventType);
    }
  };

  const send = (data: unknown) => {
    if (connection instanceof WebSocket && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(data));
      return true;
    }
    return false;
  };

  // Auto-connect when enabled
  watch(
    () => mergedConfig.enabled,
    enabled => {
      if (enabled) {
        connect();
      } else {
        disconnect();
      }
    },
    { immediate: true },
  );

  // Cleanup on scope dispose
  onScopeDispose(() => {
    disconnect();
  });

  return {
    connectionState,
    connect,
    disconnect,
    on,
    off,
    send,
    isConnected: computed(() => connectionState.value.isConnected),
    isReconnecting: computed(() => connectionState.value.isReconnecting),
    error: computed(() => connectionState.value.error),
  };
};
