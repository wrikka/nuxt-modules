type SyncEvent = 'email:new' | 'email:updated' | 'email:deleted' | 'label:updated' | 'connected' | 'disconnected';

type SyncCallback = (data: unknown) => void;

export const useRealtimeSync = () => {
  const _isConnected = ref(false);
  const _lastSync = ref<Date | null>(null);
  const _eventSource = ref<EventSource | null>(null);
  const _listeners = new Map<SyncEvent, Set<SyncCallback>>();
  const _reconnectAttempts = ref(0);
  const _maxReconnectAttempts = 5;
  const _reconnectTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const _initListeners = () => {
    for (const event of ['email:new', 'email:updated', 'email:deleted', 'label:updated', 'connected', 'disconnected'] as SyncEvent[]) {
      _listeners.set(event, new Set());
    }
  };

  const on = (event: SyncEvent, callback: SyncCallback): () => void => {
    const callbacks = _listeners.get(event);
    if (callbacks) {
      callbacks.add(callback);
    }

    return () => {
      callbacks?.delete(callback);
    };
  };

  const _emit = (event: SyncEvent, data: unknown) => {
    const callbacks = _listeners.get(event);
    callbacks?.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`Error in sync listener for ${event}:`, err);
      }
    });
  };

  const connect = (): void => {
    if (_eventSource.value) return;

    // Use Server-Sent Events (SSE) for real-time updates
    const es = new EventSource('/api/sync');
    _eventSource.value = es;

    es.onopen = () => {
      _isConnected.value = true;
      _lastSync.value = new Date();
      _reconnectAttempts.value = 0;
      _emit('connected', null);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && _listeners.has(data.type)) {
          _emit(data.type, data.payload);
        }
        _lastSync.value = new Date();
      } catch {
        // Ignore invalid messages
      }
    };

    es.onerror = () => {
      _isConnected.value = false;
      _emit('disconnected', null);
      _eventSource.value = null;

      // Attempt reconnection
      if (_reconnectAttempts.value < _maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, _reconnectAttempts.value), 30000);
        _reconnectAttempts.value++;
        _reconnectTimer.value = setTimeout(() => connect(), delay);
      }
    };
  };

  const disconnect = (): void => {
    if (_reconnectTimer.value) {
      clearTimeout(_reconnectTimer.value);
      _reconnectTimer.value = null;
    }

    _eventSource.value?.close();
    _eventSource.value = null;
    _isConnected.value = false;
    _emit('disconnected', null);
  };

  // Polling fallback for browsers that don't support SSE or as backup
  const startPolling = (intervalMs = 30000): () => void => {
    const poll = async () => {
      try {
        const lastSyncTime = _lastSync.value?.toISOString();
        const updates = await $fetch('/api/emails/updates', {
          params: lastSyncTime ? { since: lastSyncTime } : undefined,
        }) as { emails?: unknown[]; labels?: unknown[] };

        if (updates.emails?.length) {
          updates.emails.forEach(email => _emit('email:updated', email));
        }
        if (updates.labels?.length) {
          updates.labels.forEach(label => _emit('label:updated', label));
        }

        _lastSync.value = new Date();
      } catch {
        // Silently fail polling
      }
    };

    // Initial poll
    poll();

    const interval = setInterval(poll, intervalMs);
    return () => clearInterval(interval);
  };

  onMounted(() => {
    _initListeners();
    connect();
  });

  onUnmounted(() => {
    disconnect();
    _listeners.clear();
  });

  return {
    isConnected: _isConnected,
    lastSync: _lastSync,
    connect,
    disconnect,
    on,
    startPolling,
  };
};
