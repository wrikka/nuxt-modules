import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { OfflineConfig, OfflineEvent, SyncStatus } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useOfflineAnalytics = () => {
  const offlineConfig = useAnalyticsConfig().offline as OfflineConfig;

  const isOnline = ref(navigator.onLine);
  const pendingEvents = ref<OfflineEvent[]>([]);
  const syncStatus = ref<SyncStatus>('idle');
  const storageUsed = ref(0);

  const isEnabled = computed(() => offlineConfig.enabled);
  const isOffline = computed(() => !isOnline.value);

  let db: IDBDatabase | null = null;

  const init = async () => {
    if (!isEnabled.value) return;

    // Setup online/offline listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize storage
    await initStorage();

    // Load pending events
    await loadPendingEvents();

    // Sync if online
    if (isOnline.value && offlineConfig.syncOnReconnect) {
      await syncEvents();
    }
  };

  const initStorage = async (): Promise<void> => {
    if (offlineConfig.storageType === 'indexeddb') {
      db = await openDatabase();
    }
  };

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('analytics_offline', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = event => {
        const database = (event.target as IDBOpenDBRequest).result;

        if (!database.objectStoreNames.contains('events')) {
          const store = database.createObjectStore('events', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  };

  const loadPendingEvents = async (): Promise<void> => {
    if (offlineConfig.storageType === 'indexeddb' && db) {
      const tx = db.transaction('events', 'readonly');
      const store = tx.objectStore('events');
      const request = store.getAll();

      request.onsuccess = () => {
        pendingEvents.value = request.result;
        updateStorageUsed();
      };
    } else if (offlineConfig.storageType === 'localstorage') {
      const stored = localStorage.getItem('analytics_offline_events');
      if (stored) {
        pendingEvents.value = JSON.parse(stored);
        updateStorageUsed();
      }
    }
  };

  const handleOnline = async () => {
    isOnline.value = true;

    if (offlineConfig.syncOnReconnect) {
      await syncEvents();
    }
  };

  const handleOffline = () => {
    isOnline.value = false;
  };

  const storeEvent = async (event: OfflineEvent): Promise<boolean> => {
    // Check storage limits
    if (pendingEvents.value.length >= offlineConfig.maxEvents) {
      // Remove oldest event
      await removeOldestEvent();
    }

    if (storageUsed.value >= offlineConfig.maxSize) {
      // Remove oldest events until we have space
      while (storageUsed.value >= offlineConfig.maxSize && pendingEvents.value.length > 0) {
        await removeOldestEvent();
      }
    }

    pendingEvents.value.push(event);
    await persistEvent(event);
    updateStorageUsed();

    return true;
  };

  const persistEvent = async (event: OfflineEvent): Promise<void> => {
    if (offlineConfig.storageType === 'indexeddb' && db) {
      const tx = db.transaction('events', 'readwrite');
      const store = tx.objectStore('events');
      store.add(event);
    } else if (offlineConfig.storageType === 'localstorage') {
      localStorage.setItem('analytics_offline_events', JSON.stringify(pendingEvents.value));
    } else {
      // Memory only - events will be lost on page close
    }
  };

  const removeOldestEvent = async (): Promise<void> => {
    if (pendingEvents.value.length === 0) return;

    const oldest = pendingEvents.value[0];
    pendingEvents.value.shift();

    if (offlineConfig.storageType === 'indexeddb' && db) {
      const tx = db.transaction('events', 'readwrite');
      const store = tx.objectStore('events');
      store.delete(oldest.id);
    } else if (offlineConfig.storageType === 'localstorage') {
      localStorage.setItem('analytics_offline_events', JSON.stringify(pendingEvents.value));
    }
  };

  const updateStorageUsed = () => {
    const eventSize = JSON.stringify(pendingEvents.value).length;
    storageUsed.value = eventSize;
  };

  const syncEvents = async (): Promise<number> => {
    if (syncStatus.value === 'syncing') return 0;
    if (pendingEvents.value.length === 0) return 0;

    syncStatus.value = 'syncing';
    let syncedCount = 0;

    for (const event of pendingEvents.value) {
      const success = await syncEvent(event);

      if (success) {
        syncedCount++;
        await removeEvent(event.id);
      } else {
        // Update retry count
        event.retryCount = (event.retryCount ?? 0) + 1;
        event.lastRetry = new Date();

        if (event.retryCount >= offlineConfig.retryStrategy.maxRetries) {
          // Remove event that exceeded max retries
          await removeEvent(event.id);
        }
      }
    }

    syncStatus.value = pendingEvents.value.length > 0 ? 'partial' : 'synced';
    return syncedCount;
  };

  const syncEvent = async (event: OfflineEvent): Promise<boolean> => {
    const delay = calculateRetryDelay(event.retryCount ?? 0);

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      // Would send to backend
      // For now, simulate success
      return true;
    } catch {
      return false;
    }
  };

  const calculateRetryDelay = (retryCount: number): number => {
    const strategy = offlineConfig.retryStrategy;
    let delay = strategy.initialDelay;

    switch (strategy.backoff) {
      case 'exponential':
        delay = strategy.initialDelay * Math.pow(2, retryCount);
        break;
      case 'linear':
        delay = strategy.initialDelay + (retryCount * strategy.initialDelay);
        break;
      case 'fixed':
      default:
        delay = strategy.initialDelay;
        break;
    }

    // Apply jitter
    if (strategy.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.min(delay, strategy.maxDelay);
  };

  const removeEvent = async (eventId: string): Promise<void> => {
    const index = pendingEvents.value.findIndex(e => e.id === eventId);
    if (index === -1) return;

    pendingEvents.value.splice(index, 1);

    if (offlineConfig.storageType === 'indexeddb' && db) {
      const tx = db.transaction('events', 'readwrite');
      const store = tx.objectStore('events');
      store.delete(eventId);
    } else if (offlineConfig.storageType === 'localstorage') {
      localStorage.setItem('analytics_offline_events', JSON.stringify(pendingEvents.value));
    }

    updateStorageUsed();
  };

  const clearAllEvents = async (): Promise<void> => {
    pendingEvents.value = [];

    if (offlineConfig.storageType === 'indexeddb' && db) {
      const tx = db.transaction('events', 'readwrite');
      const store = tx.objectStore('events');
      store.clear();
    } else if (offlineConfig.storageType === 'localstorage') {
      localStorage.removeItem('analytics_offline_events');
    }

    storageUsed.value = 0;
  };

  const getPendingCount = (): number => {
    return pendingEvents.value.length;
  };

  const getStorageUsed = (): number => {
    return storageUsed.value;
  };

  const getStorageRemaining = (): number => {
    return offlineConfig.maxSize - storageUsed.value;
  };

  onMounted(() => {
    void init();
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline,
    isOffline,
    pendingEvents,
    syncStatus,
    storageUsed,
    isEnabled,
    storeEvent,
    syncEvents,
    clearAllEvents,
    getPendingCount,
    getStorageUsed,
    getStorageRemaining,
  };
};
