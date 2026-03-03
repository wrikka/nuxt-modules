import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { FormValues, UseFormPersistOptions, UseFormPersistReturn } from '../types';
import { generateId } from '../utils/id';

type StorageType = 'localStorage' | 'sessionStorage';

function getStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null;
  return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}

export function useFormPersist<T extends FormValues = FormValues>(
  formKey: string,
  options: UseFormPersistOptions<T> = {},
): UseFormPersistReturn<T> {
  const {
    storage = 'localStorage',
    include = [],
    exclude = [],
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onRestored,
    onSaved,
    debounceMs = 300,
  } = options;

  const isRestored = ref(false);
  const lastSaved = ref<Date | null>(null);
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  const storageKey = `wform-persist-${formKey}`;
  const storageInstance = getStorage(storage);

  const shouldPersistField = (key: string): boolean => {
    if (include.length > 0 && !include.includes(key)) return false;
    if (exclude.length > 0 && exclude.includes(key)) return false;
    return true;
  };

  const persist = (values: T): void => {
    if (!storageInstance) return;

    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (shouldPersistField(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Partial<T>);

    try {
      storageInstance.setItem(storageKey, serialize(filteredValues));
      lastSaved.value = new Date();
      onSaved?.(filteredValues as Partial<T>);
    } catch {
      // Silent fail if storage is full or unavailable
    }
  };

  const restore = (): Partial<T> | null => {
    if (!storageInstance) return null;

    try {
      const saved = storageInstance.getItem(storageKey);
      if (!saved) return null;

      const restored = deserialize(saved) as Partial<T>;
      isRestored.value = true;
      onRestored?.(restored);
      return restored;
    } catch {
      return null;
    }
  };

  const clear = (): void => {
    if (!storageInstance) return;

    try {
      storageInstance.removeItem(storageKey);
      lastSaved.value = null;
      isRestored.value = false;
    } catch {
      // Silent fail
    }
  };

  const debouncedPersist = (values: T): void => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      persist(values);
    }, debounceMs);
  };

  const watchAndPersist = (values: T): void => {
    debouncedPersist(values);
  };

  onUnmounted(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
  });

  return {
    persist,
    restore,
    clear,
    watchAndPersist,
    isRestored,
    lastSaved,
    storageKey,
  };
}
