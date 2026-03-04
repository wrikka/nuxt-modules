import { reactive, readonly, computed } from "vue";

export interface CloudSyncState {
	isEnabled: boolean;
	isSyncing: boolean;
	lastSyncedAt?: number;
	cloudProvider: "none" | "google-drive" | "dropbox" | "onedrive" | "custom";
	syncSettings: boolean;
	syncRecordings: boolean;
	syncPresets: boolean;
	autoSync: boolean;
	syncInterval: number;
}

export interface SyncData {
	settings: Record<string, unknown>;
	presets: unknown[];
	templates: unknown[];
	shortcuts: unknown[];
	version: string;
}

const SYNC_STORAGE_KEY = "wrecorder-cloud-sync";

export const useCloudSync = () => {
	const state = reactive<CloudSyncState>({
		isEnabled: false,
		isSyncing: false,
		cloudProvider: "none",
		syncSettings: true,
		syncRecordings: false,
		syncPresets: true,
		autoSync: false,
		syncInterval: 300,
	});

	let syncIntervalId: ReturnType<typeof setInterval> | null = null;

	const loadConfig = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(SYNC_STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				Object.assign(state, parsed);
			} catch {
				// Invalid config
			}
		}
	};

	const saveConfig = () => {
		if (typeof window === "undefined") return;
		localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify({
			isEnabled: state.isEnabled,
			cloudProvider: state.cloudProvider,
			syncSettings: state.syncSettings,
			syncRecordings: state.syncRecordings,
			syncPresets: state.syncPresets,
			autoSync: state.autoSync,
			syncInterval: state.syncInterval,
		}));
	};

	const enableSync = (provider: CloudSyncState["cloudProvider"]) => {
		state.cloudProvider = provider;
		state.isEnabled = true;
		saveConfig();

		if (state.autoSync) {
			startAutoSync();
		}
	};

	const disableSync = () => {
		state.isEnabled = false;
		state.cloudProvider = "none";
		saveConfig();
		stopAutoSync();
	};

	const sync = async (): Promise<boolean> => {
		if (!state.isEnabled || state.cloudProvider === "none") return false;

		state.isSyncing = true;

		try {
			const data = collectSyncData();

			// Simulate cloud sync
			await new Promise(resolve => setTimeout(resolve, 2000));

			state.lastSyncedAt = Date.now();
			saveConfig();

			return true;
		} catch {
			return false;
		} finally {
			state.isSyncing = false;
		}
	};

	const collectSyncData = (): SyncData => {
		return {
			settings: state.syncSettings ? getLocalSettings() : {},
			presets: state.syncPresets ? getLocalPresets() : [],
			templates: [],
			shortcuts: [],
			version: "1.0.0",
		};
	};

	const getLocalSettings = (): Record<string, unknown> => {
		// Collect all settings from localStorage
		const settings: Record<string, unknown> = {};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith("wrecorder-")) {
				try {
					settings[key] = JSON.parse(localStorage.getItem(key) || "{}");
				} catch {
					settings[key] = localStorage.getItem(key);
				}
			}
		}
		return settings;
	};

	const getLocalPresets = (): unknown[] => {
		try {
			const presets = localStorage.getItem("wrecorder-presets");
			return presets ? JSON.parse(presets) : [];
		} catch {
			return [];
		}
	};

	const startAutoSync = () => {
		stopAutoSync();
		syncIntervalId = setInterval(() => {
			if (state.isEnabled && state.autoSync) {
				sync();
			}
		}, state.syncInterval * 1000);
	};

	const stopAutoSync = () => {
		if (syncIntervalId) {
			clearInterval(syncIntervalId);
			syncIntervalId = null;
		}
	};

	const setSyncOptions = (options: Partial<Omit<CloudSyncState, "isSyncing" | "lastSyncedAt">>) => {
		Object.assign(state, options);
		saveConfig();
	};

	const exportSyncData = (): string => {
		return JSON.stringify(collectSyncData(), null, 2);
	};

	onMounted(() => {
		loadConfig();
		if (state.isEnabled && state.autoSync) {
			startAutoSync();
		}
	});

	onUnmounted(() => {
		stopAutoSync();
	});

	return {
		state: readonly(state),
		enableSync,
		disableSync,
		sync,
		setSyncOptions,
		exportSyncData,
	};
};
