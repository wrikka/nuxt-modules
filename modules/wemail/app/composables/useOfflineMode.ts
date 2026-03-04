import type { Email } from '../../shared/types/email';

const DB_NAME = 'wemail';
const DB_VERSION = 1;
const EMAILS_STORE = 'emails';
const ATTACHMENTS_STORE = 'attachments';
const DRAFTS_STORE = 'drafts';

export const useOfflineMode = () => {
  const _isOnline = ref(true);
  const _isSyncing = ref(false);
  const _lastSync = ref<Date | null>(null);
  const _db = ref<IDBDatabase | null>(null);

  const _initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(EMAILS_STORE)) {
          db.createObjectStore(EMAILS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(ATTACHMENTS_STORE)) {
          db.createObjectStore(ATTACHMENTS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
          db.createObjectStore(DRAFTS_STORE, { keyPath: 'id' });
        }
      };
    });
  };

  const init = async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    _isOnline.value = navigator.onLine;

    window.addEventListener('online', () => {
      _isOnline.value = true;
      syncOfflineData();
    });

    window.addEventListener('offline', () => {
      _isOnline.value = false;
    });

    try {
      _db.value = await _initDB();
    } catch {
      console.error('Failed to initialize offline database');
    }
  };

  const saveEmailOffline = async (email: Email): Promise<void> => {
    if (!_db.value) return;

    const transaction = _db.value.transaction([EMAILS_STORE], 'readwrite');
    const store = transaction.objectStore(EMAILS_STORE);
    await new Promise<void>((resolve, reject) => {
      const request = store.put(email);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getOfflineEmails = async (): Promise<Email[]> => {
    if (!_db.value) return [];

    const transaction = _db.value.transaction([EMAILS_STORE], 'readonly');
    const store = transaction.objectStore(EMAILS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const deleteOfflineEmail = async (id: number): Promise<void> => {
    if (!_db.value) return;

    const transaction = _db.value.transaction([EMAILS_STORE], 'readwrite');
    const store = transaction.objectStore(EMAILS_STORE);
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const queueOfflineAction = async (action: {
    type: 'send' | 'delete' | 'update';
    emailId?: number;
    data?: unknown;
  }): Promise<void> => {
    const queue = JSON.parse(localStorage.getItem('wemail:offline-queue') || '[]');
    queue.push({
      ...action,
      timestamp: Date.now(),
    });
    localStorage.setItem('wemail:offline-queue', JSON.stringify(queue));
  };

  const syncOfflineData = async (): Promise<void> => {
    if (!_isOnline.value) return;

    _isSyncing.value = true;

    try {
      const queue = JSON.parse(localStorage.getItem('wemail:offline-queue') || '[]');
      const failed: typeof queue = [];

      for (const action of queue) {
        try {
          switch (action.type) {
            case 'send':
              await $fetch('/api/emails', {
                method: 'POST',
                body: action.data,
              });
              break;
            case 'delete':
              if (action.emailId) {
                await $fetch(`/api/emails/${action.emailId}`, { method: 'DELETE' });
              }
              break;
            case 'update':
              if (action.emailId) {
                await $fetch(`/api/emails/${action.emailId}`, {
                  method: 'PATCH',
                  body: action.data,
                });
              }
              break;
          }
        } catch {
          failed.push(action);
        }
      }

      localStorage.setItem('wemail:offline-queue', JSON.stringify(failed));
      _lastSync.value = new Date();
    } finally {
      _isSyncing.value = false;
    }
  };

  const canInstallPWA = computed(() => {
    return typeof window !== 'undefined' && 'beforeinstallprompt' in window;
  });

  const installPWA = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    const deferredPrompt = (window as unknown as { deferredPrompt: { prompt: () => void; userChoice: Promise<{ outcome: string }> } }).deferredPrompt;
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    return outcome === 'accepted';
  };

  onMounted(() => {
    init();
  });

  return {
    isOnline: _isOnline,
    isSyncing: _isSyncing,
    lastSync: _lastSync,
    canInstallPWA,
    init,
    saveEmailOffline,
    getOfflineEmails,
    deleteOfflineEmail,
    queueOfflineAction,
    syncOfflineData,
    installPWA,
  };
};
