import type { DiffChunk } from './types'

export interface CacheEntry {
  id: string
  timestamp: number
  oldContent: string
  newContent: string
  chunks: DiffChunk[]
  metadata?: Record<string, unknown>
}

export interface OfflineConfig {
  maxCacheSize?: number
  maxCacheAge?: number
  dbName?: string
  storeName?: string
}

const DEFAULT_CONFIG: Required<OfflineConfig> = {
  maxCacheSize: 100,
  maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  dbName: 'wdiff-offline',
  storeName: 'diff-cache',
}

/**
 * IndexedDB-based cache for offline diff storage
 */
class DiffCacheDB {
  private db: IDBDatabase | null = null
  private config: Required<OfflineConfig>

  constructor(config: OfflineConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  async get(id: string): Promise<CacheEntry | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result as CacheEntry | undefined
        if (result && Date.now() - result.timestamp < this.config.maxCacheAge) {
          resolve(result)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async set(entry: CacheEntry): Promise<void> {
    if (!this.db) await this.init()

    // Check cache size and evict old entries if needed
    await this.evictIfNeeded()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.put(entry)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async delete(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(): Promise<CacheEntry[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('timestamp')
      const request = index.openCursor(null, 'prev')

      const results: CacheEntry[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null
        if (cursor) {
          const entry = cursor.value as CacheEntry
          if (Date.now() - entry.timestamp < this.config.maxCacheAge) {
            results.push(entry)
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async evictIfNeeded(): Promise<void> {
    const all = await this.getAll()
    if (all.length >= this.config.maxCacheSize) {
      // Remove oldest entries
      const toRemove = all.slice(this.config.maxCacheSize - 1)
      for (const entry of toRemove) {
        await this.delete(entry.id)
      }
    }
  }
}

// Singleton instance
let cacheInstance: DiffCacheDB | null = null

const getCache = (config?: OfflineConfig): DiffCacheDB => {
  if (!cacheInstance) {
    cacheInstance = new DiffCacheDB(config)
  }
  return cacheInstance
}

/**
 * Save diff to offline cache
 */
export const saveDiffOffline = async (
  id: string,
  oldContent: string,
  newContent: string,
  chunks: DiffChunk[],
  metadata?: Record<string, unknown>,
  config?: OfflineConfig
): Promise<void> => {
  const cache = getCache(config)
  await cache.init()

  const entry: CacheEntry = {
    id,
    timestamp: Date.now(),
    oldContent,
    newContent,
    chunks,
    metadata,
  }

  await cache.set(entry)
}

/**
 * Load diff from offline cache
 */
export const loadDiffOffline = async (
  id: string,
  config?: OfflineConfig
): Promise<CacheEntry | null> => {
  const cache = getCache(config)
  await cache.init()
  return cache.get(id)
}

/**
 * Get all cached diffs
 */
export const getAllCachedDiffs = async (config?: OfflineConfig): Promise<CacheEntry[]> => {
  const cache = getCache(config)
  await cache.init()
  return cache.getAll()
}

/**
 * Delete cached diff
 */
export const deleteCachedDiff = async (id: string, config?: OfflineConfig): Promise<void> => {
  const cache = getCache(config)
  await cache.init()
  await cache.delete(id)
}

/**
 * Clear all cached diffs
 */
export const clearOfflineCache = async (config?: OfflineConfig): Promise<void> => {
  const cache = getCache(config)
  await cache.init()
  await cache.clear()
}

/**
 * Check if running in offline mode
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

/**
 * Listen for online/offline events
 */
export const onNetworkChange = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => onOnline()
  const handleOffline = () => onOffline()

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Queue operations for when back online
 */
export class OfflineQueue {
  private queue: Array<() => Promise<void>> = []
  private isProcessing = false
  private unsubscribe?: () => void

  constructor() {
    this.unsubscribe = onNetworkChange(
      () => this.processQueue(),
      () => {}
    )
  }

  add(operation: () => Promise<void>): void {
    this.queue.push(operation)
    if (!isOffline()) {
      this.processQueue()
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || isOffline()) return

    this.isProcessing = true

    while (this.queue.length > 0 && !isOffline()) {
      const operation = this.queue.shift()
      if (operation) {
        try {
          await operation()
        } catch (error) {
          console.error('Offline queue operation failed:', error)
        }
      }
    }

    this.isProcessing = false
  }

  destroy(): void {
    this.unsubscribe?.()
  }
}

/**
 * Service Worker registration for PWA
 */
export const registerServiceWorker = async (
  swPath: string = '/sw.js'
): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath)
    console.log('Service Worker registered:', registration)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Background sync for deferred operations
 */
export const requestBackgroundSync = async (
  registration: ServiceWorkerRegistration,
  tag: string
): Promise<void> => {
  if (!('sync' in registration)) {
    console.warn('Background Sync not supported')
    return
  }

  try {
    await (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag)
    console.log('Background sync registered:', tag)
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

/**
 * Cache API wrapper for large files
 */
export const cacheLargeFile = async (
  cacheName: string,
  request: RequestInfo,
  response: Response
): Promise<void> => {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
}

export const getCachedFile = async (
  cacheName: string,
  request: RequestInfo
): Promise<Response | undefined> => {
  const cache = await caches.open(cacheName)
  return cache.match(request)
}

/**
 * Export offline data for backup
 */
export const exportOfflineData = async (config?: OfflineConfig): Promise<string> => {
  const diffs = await getAllCachedDiffs(config)
  
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    diffs,
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Import offline data from backup
 */
export const importOfflineData = async (
  jsonData: string,
  config?: OfflineConfig
): Promise<void> => {
  const data = JSON.parse(jsonData)
  
  if (!data.diffs || !Array.isArray(data.diffs)) {
    throw new Error('Invalid backup format')
  }

  const cache = getCache(config)
  await cache.init()

  for (const entry of data.diffs) {
    await cache.set(entry)
  }
}

/**
 * Get offline storage statistics
 */
export const getOfflineStats = async (config?: OfflineConfig): Promise<{
  totalEntries: number
  totalSize: number
  oldestEntry: Date | null
  newestEntry: Date | null
}> => {
  const diffs = await getAllCachedDiffs(config)
  
  let totalSize = 0
  let oldest: number | null = null
  let newest: number | null = null

  for (const diff of diffs) {
    const size = JSON.stringify(diff).length
    totalSize += size

    if (oldest === null || diff.timestamp < oldest) {
      oldest = diff.timestamp
    }
    if (newest === null || diff.timestamp > newest) {
      newest = diff.timestamp
    }
  }

  return {
    totalEntries: diffs.length,
    totalSize,
    oldestEntry: oldest ? new Date(oldest) : null,
    newestEntry: newest ? new Date(newest) : null,
  }
}

/**
 * Vue composable for offline support
 */
export const useOffline = (config?: OfflineConfig) => {
  const isOnline = ref(!isOffline())
  const pendingOperations = ref(0)
  const queue = new OfflineQueue()

  const unsubscribe = onNetworkChange(
    () => {
      isOnline.value = true
    },
    () => {
      isOnline.value = false
    }
  )

  const saveOffline = async (
    id: string,
    oldContent: string,
    newContent: string,
    chunks: DiffChunk[],
    metadata?: Record<string, unknown>
  ) => {
    await saveDiffOffline(id, oldContent, newContent, chunks, metadata, config)
  }

  const loadOffline = async (id: string) => {
    return loadDiffOffline(id, config)
  }

  const queueForSync = (operation: () => Promise<void>) => {
    pendingOperations.value++
    queue.add(async () => {
      await operation()
      pendingOperations.value--
    })
  }

  return {
    isOnline,
    pendingOperations,
    saveOffline,
    loadOffline,
    queueForSync,
    getAllCached: () => getAllCachedDiffs(config),
    clearCache: () => clearOfflineCache(config),
    destroy: () => {
      unsubscribe()
      queue.destroy()
    },
  }
}
