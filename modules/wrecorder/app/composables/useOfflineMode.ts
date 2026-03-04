import { reactive, readonly, computed } from "vue";

export interface OfflineRecording {
	id: string;
	name: string;
	blob: Blob;
	url: string;
	duration: number;
	createdAt: number;
	syncStatus: "pending" | "syncing" | "synced" | "failed";
	retryCount: number;
}

export interface OfflineModeState {
	isOffline: boolean;
	isEnabled: boolean;
	pendingRecordings: OfflineRecording[];
	autoSyncWhenOnline: boolean;
	maxOfflineStorage: number;
	usedStorage: number;
}

const OFFLINE_STORAGE_KEY = "wrecorder-offline-recordings";

export const useOfflineMode = () => {
	const state = reactive<OfflineModeState>({
		isOffline: false,
		isEnabled: false,
		pendingRecordings: [],
		autoSyncWhenOnline: true,
		maxOfflineStorage: 100 * 1024 * 1024, // 100MB default
		usedStorage: 0,
	});

	let onlineStatusInterval: ReturnType<typeof setInterval> | null = null;

	const checkOnlineStatus = (): boolean => {
		return typeof navigator !== "undefined" && navigator.onLine;
	};

	const monitorOnlineStatus = () => {
		if (typeof window === "undefined") return;

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Check initial state
		state.isOffline = !checkOnlineStatus();

		// Monitor periodically
		onlineStatusInterval = setInterval(() => {
			const isOnline = checkOnlineStatus();
			if (isOnline && state.isOffline) {
				handleOnline();
			} else if (!isOnline && !state.isOffline) {
				handleOffline();
			}
		}, 5000);
	};

	const handleOnline = () => {
		state.isOffline = false;
		if (state.autoSyncWhenOnline && state.pendingRecordings.length > 0) {
			syncPendingRecordings();
		}
	};

	const handleOffline = () => {
		state.isOffline = true;
	};

	const enableOfflineMode = () => {
		state.isEnabled = true;
		monitorOnlineStatus();
	};

	const disableOfflineMode = () => {
		state.isEnabled = false;
		if (onlineStatusInterval) {
			clearInterval(onlineStatusInterval);
			onlineStatusInterval = null;
		}
	};

	const saveRecordingOffline = (name: string, blob: Blob, duration: number): string | null => {
		if (!state.isEnabled) return null;

		// Check storage availability
		if (blob.size + state.usedStorage > state.maxOfflineStorage) {
			console.warn("Not enough offline storage");
			return null;
		}

		const id = `offline-${Date.now()}`;
		const recording: OfflineRecording = {
			id,
			name,
			blob,
			url: URL.createObjectURL(blob),
			duration,
			createdAt: Date.now(),
			syncStatus: "pending",
			retryCount: 0,
		};

		state.pendingRecordings.push(recording);
		state.usedStorage += blob.size;
		persistOfflineRecordings();

		return id;
	};

	const syncPendingRecordings = async (): Promise<void> => {
		if (state.isOffline) return;

		const pending = state.pendingRecordings.filter(r => r.syncStatus === "pending");

		for (const recording of pending) {
			recording.syncStatus = "syncing";

			try {
				// Simulate upload
				await new Promise(resolve => setTimeout(resolve, 1000));

				recording.syncStatus = "synced";
			} catch {
				recording.retryCount++;
				if (recording.retryCount >= 3) {
					recording.syncStatus = "failed";
				} else {
					recording.syncStatus = "pending";
				}
			}
		}

		persistOfflineRecordings();
	};

	const persistOfflineRecordings = () => {
		// Store metadata only (blobs can't be stored in localStorage)
		const metadata = state.pendingRecordings.map(r => ({
			id: r.id,
			name: r.name,
			duration: r.duration,
			createdAt: r.createdAt,
			syncStatus: r.syncStatus,
			retryCount: r.retryCount,
			size: r.blob.size,
		}));

		localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(metadata));
	};

	const deleteOfflineRecording = (id: string) => {
		const index = state.pendingRecordings.findIndex(r => r.id === id);
		if (index !== -1) {
			const recording = state.pendingRecordings[index];
			state.usedStorage -= recording.blob.size;
			URL.revokeObjectURL(recording.url);
			state.pendingRecordings.splice(index, 1);
			persistOfflineRecordings();
		}
	};

	const retryFailedSync = async () => {
		const failed = state.pendingRecordings.filter(r => r.syncStatus === "failed");
		failed.forEach(r => {
			r.syncStatus = "pending";
			r.retryCount = 0;
		});
		await syncPendingRecordings();
	};

	const setMaxStorage = (bytes: number) => {
		state.maxOfflineStorage = Math.max(10 * 1024 * 1024, bytes);
	};

	const formatStorage = (bytes: number): string => {
		const units = ["B", "KB", "MB", "GB"];
		let size = bytes;
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(2)} ${units[unitIndex]}`;
	};

	const pendingCount = computed(() =>
		state.pendingRecordings.filter(r => r.syncStatus === "pending").length
	);

	onMounted(() => {
		if (state.isEnabled) {
			monitorOnlineStatus();
		}
	});

	onUnmounted(() => {
		if (onlineStatusInterval) {
			clearInterval(onlineStatusInterval);
		}
	});

	return {
		state: readonly(state),
		isOffline: computed(() => state.isOffline),
		pendingCount,
		enableOfflineMode,
		disableOfflineMode,
		saveRecordingOffline,
		syncPendingRecordings,
		deleteOfflineRecording,
		retryFailedSync,
		setMaxStorage,
		formatStorage,
	};
};
