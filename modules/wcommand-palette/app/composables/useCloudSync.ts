import { ref, watch, type Ref } from 'vue'
import type { Command, CommandChain, CommandMacro, CommandHistoryEntry, ThemePreset } from '../types'

export interface SyncData {
	/** User's pinned commands */
	pinned: string[]
	/** User's recent commands */
	recent: { id: string; timestamp: number }[]
	/** User's command chains */
	chains: CommandChain[]
	/** User's command macros */
	macros: CommandMacro[]
	/** User's search history */
	searchHistory: CommandHistoryEntry[]
	/** User's theme preference */
	theme: ThemePreset
	/** Last sync timestamp */
	lastSync: number
}

export interface CloudSyncOptions {
	/** User ID for sync */
	userId?: string
	/** Palette ID */
	paletteId: string
	/** Sync interval in ms (default: 30000) */
	syncInterval?: number
	/** Enable real-time sync */
	enableRealtime?: boolean
	/** Custom sync provider */
	provider?: SyncProvider
}

export interface SyncProvider {
	/** Load data from cloud */
	load: (userId: string, paletteId: string) => Promise<SyncData | null>
	/** Save data to cloud */
	save: (userId: string, paletteId: string, data: SyncData) => Promise<void>
	/** Subscribe to real-time changes */
	subscribe?: (userId: string, paletteId: string, callback: (data: SyncData) => void) => () => void
}

export interface UseCloudSyncReturn {
	/** Whether sync is enabled */
	isEnabled: Ref<boolean>
	/** Whether currently syncing */
	isSyncing: Ref<boolean>
	/** Last sync timestamp */
	lastSync: Ref<number | null>
	/** Enable cloud sync */
	enableSync: (userId: string, provider?: SyncProvider) => void
	/** Disable cloud sync */
	disableSync: () => void
	/** Force sync now */
	syncNow: () => Promise<void>
	/** Export all data for sync */
	exportData: () => SyncData
	/** Import data from sync */
	importData: (data: SyncData) => void
	/** Current sync status */
	syncStatus: Ref<'idle' | 'syncing' | 'error'>
	/** Sync error message */
	syncError: Ref<string | null>
}

const STORAGE_KEY = 'palette-cloud-sync'

/** Default mock provider (localStorage-based for demo) */
const defaultProvider: SyncProvider = {
	async load(userId: string, paletteId: string): Promise<SyncData | null> {
		const key = `${STORAGE_KEY}:${userId}:${paletteId}`
		const data = localStorage.getItem(key)
		return data ? JSON.parse(data) : null
	},
	async save(userId: string, paletteId: string, data: SyncData): Promise<void> {
		const key = `${STORAGE_KEY}:${userId}:${paletteId}`
		localStorage.setItem(key, JSON.stringify(data))
	}
}

export function useCloudSync(options: CloudSyncOptions): UseCloudSyncReturn {
	const isEnabled = ref(false)
	const isSyncing = ref(false)
	const lastSync = ref<number | null>(null)
	const syncStatus = ref<'idle' | 'syncing' | 'error'>('idle')
	const syncError = ref<string | null>(null)
	const currentUserId = ref<string | null>(options.userId ?? null)
	const currentProvider = ref<SyncProvider>(options.provider ?? defaultProvider)
	const unsubscribe = ref<(() => void) | null>(null)

	/**
	 * Export all local data for syncing
	 */
	const exportData = (): SyncData => {
		const pinned = JSON.parse(localStorage.getItem(`palette-pinned-${options.paletteId}`) ?? '[]')
		const recent = JSON.parse(localStorage.getItem(`palette-recent-${options.paletteId}`) ?? '[]')
		const chains = JSON.parse(localStorage.getItem(`palette-chains-${options.paletteId}`) ?? '[]')
		const macros = JSON.parse(localStorage.getItem(`palette-macros-${options.paletteId}`) ?? '[]')
		const searchHistory = JSON.parse(localStorage.getItem(`palette-history`) ?? '[]')
		const theme = localStorage.getItem('palette-theme') as ThemePreset ?? 'auto'

		return {
			pinned: pinned.map((p: { id: string }) => p.id),
			recent,
			chains,
			macros,
			searchHistory,
			theme,
			lastSync: Date.now()
		}
	}

	/**
	 * Import synced data to local storage
	 */
	const importData = (data: SyncData): void => {
		localStorage.setItem(`palette-pinned-${options.paletteId}`, JSON.stringify(
			data.pinned.map(id => ({ id, timestamp: Date.now() }))
		))
		localStorage.setItem(`palette-recent-${options.paletteId}`, JSON.stringify(data.recent))
		localStorage.setItem(`palette-chains-${options.paletteId}`, JSON.stringify(data.chains))
		localStorage.setItem(`palette-macros-${options.paletteId}`, JSON.stringify(data.macros))
		localStorage.setItem(`palette-history`, JSON.stringify(data.searchHistory))
		localStorage.setItem('palette-theme', data.theme)

		// Dispatch storage event for cross-tab sync
		window.dispatchEvent(new StorageEvent('storage', { key: `palette-sync-${options.paletteId}` }))
	}

	/**
	 * Perform sync operation
	 */
	const syncNow = async (): Promise<void> => {
		if (!currentUserId.value || isSyncing.value) return

		isSyncing.value = true
		syncStatus.value = 'syncing'
		syncError.value = null

		try {
			// Export local data
			const localData = exportData()

			// Load remote data
			const remoteData = await currentProvider.value.load(
				currentUserId.value,
				options.paletteId
			)

			if (remoteData && remoteData.lastSync > localData.lastSync) {
				// Remote is newer, import it
				importData(remoteData)
				lastSync.value = remoteData.lastSync
			} else {
				// Local is newer, save to remote
				await currentProvider.value.save(
					currentUserId.value,
					options.paletteId,
					localData
				)
				lastSync.value = localData.lastSync
			}

			syncStatus.value = 'idle'
		} catch (error) {
			syncStatus.value = 'error'
			syncError.value = error instanceof Error ? error.message : 'Sync failed'
			console.error('Cloud sync failed:', error)
		} finally {
			isSyncing.value = false
		}
	}

	/**
	 * Enable cloud sync for a user
	 */
	const enableSync = (userId: string, provider?: SyncProvider): void => {
		currentUserId.value = userId
		if (provider) {
			currentProvider.value = provider
		}
		isEnabled.value = true

		// Initial sync
		syncNow()

		// Set up periodic sync
		const intervalId = setInterval(syncNow, options.syncInterval ?? 30000)

		// Set up real-time subscription if available
		if (currentProvider.value.subscribe && options.enableRealtime) {
			unsubscribe.value = currentProvider.value.subscribe(
				userId,
				options.paletteId,
				(data) => {
					if (data.lastSync > (lastSync.value ?? 0)) {
						importData(data)
						lastSync.value = data.lastSync
					}
				}
			)
		}

		// Cleanup on disable
		const cleanup = () => {
			clearInterval(intervalId)
			unsubscribe.value?.()
		}

		// Store cleanup function
		;(window as unknown as { __paletteSyncCleanup?: () => void }).__paletteSyncCleanup = cleanup
	}

	/**
	 * Disable cloud sync
	 */
	const disableSync = (): void => {
		isEnabled.value = false
		currentUserId.value = null
		unsubscribe.value?.()
		;(window as unknown as { __paletteSyncCleanup?: () => void }).__paletteSyncCleanup?.()
	}

	return {
		isEnabled,
		isSyncing,
		lastSync,
		enableSync,
		disableSync,
		syncNow,
		exportData,
		importData,
		syncStatus,
		syncError
	}
}
