import type { fabric } from "fabric";
import { computed, ref } from "vue";

const CURRENT_SCHEMA_VERSION = 1;
const AUTOSAVE_DEBOUNCE_MS = 1200;

export interface DesignerDocumentState {
	projectId: string;
	artboard: { width: number; height: number };
	backgroundColor: string;
	schemaVersion: number;
}

export interface DesignerPersistedDocument {
	document: DesignerDocumentState;
	canvas: string;
	versions?: unknown;
}

export interface UseDesignerPersistenceOptions {
	projectId: string;
	getCanvas: () => fabric.Canvas | null;
	canvasJsonExtraProps: string[];
	artboard: { width: number; height: number };
	backgroundColor: Ref<string>;
	versions: Ref<unknown>;
	onSave?: () => void;
	onLoad?: () => void;
}

export const useDesignerPersistence = (options: UseDesignerPersistenceOptions) => {
	const isDirty = ref(false);
	const lastSaveTime = ref<number | null>(null);
	const autoSaveEnabled = ref(true);
	const autoSaveIntervalMs = ref(30000);

	let autoSaveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let autoSaveIntervalTimer: ReturnType<typeof setInterval> | null = null;

	const storageKey = computed(() => `designer:${options.projectId}`);
	const serverDocumentUrl = computed(() => `/api/designer/projects/${options.projectId}/document`);

	const fetchServerDocument = async (): Promise<DesignerPersistedDocument | null> => {
		try {
			const res = await $fetch<{ success: boolean; data: unknown }>(serverDocumentUrl.value, {
				method: "GET",
			});
			if (!res?.success) return null;
			return (res.data ?? null) as DesignerPersistedDocument | null;
		} catch {
			return null;
		}
	};

	const saveServerDocument = async (data: DesignerPersistedDocument): Promise<boolean> => {
		try {
			const res = await $fetch<{ success: boolean }>(serverDocumentUrl.value, {
				method: "PUT",
				body: data,
			});
			return res?.success === true;
		} catch {
			return false;
		}
	};

	const save = async () => {
		const c = options.getCanvas();
		if (!c) return;

		const json = JSON.stringify((c as any).toJSON(options.canvasJsonExtraProps));
		const documentState: DesignerDocumentState = {
			projectId: options.projectId,
			artboard: { width: options.artboard.width, height: options.artboard.height },
			backgroundColor: options.backgroundColor.value,
			schemaVersion: CURRENT_SCHEMA_VERSION,
		};

		const data = {
			document: documentState,
			canvas: json,
			versions: options.versions.value,
		};

		const persisted: DesignerPersistedDocument = data;
		const ok = await saveServerDocument(persisted);
		try {
			localStorage.setItem(storageKey.value, JSON.stringify(data));
		} catch {
			// ignore
		}
		if (ok) {
			isDirty.value = false;
			lastSaveTime.value = Date.now();
			options.onSave?.();
		}
	};

	const scheduleAutoSave = () => {
		if (!autoSaveEnabled.value) return;
		if (!isDirty.value) return;
		if (autoSaveDebounceTimer) {
			clearTimeout(autoSaveDebounceTimer);
		}
		autoSaveDebounceTimer = setTimeout(() => {
			void save().catch(() => {
				// Silent fail - error handled by saveServerDocument
			});
		}, AUTOSAVE_DEBOUNCE_MS);
	};

	const startAutoSaveInterval = () => {
		stopAutoSaveInterval();
		if (!autoSaveEnabled.value) return;
		autoSaveIntervalTimer = setInterval(() => {
			if (!isDirty.value) return;
			void save().catch(() => {
				// Silent fail - error handled by saveServerDocument
			});
		}, autoSaveIntervalMs.value);
	};

	const stopAutoSaveInterval = () => {
		if (autoSaveIntervalTimer) {
			clearInterval(autoSaveIntervalTimer);
			autoSaveIntervalTimer = null;
		}
	};

	const migrateDocument = async (data: any) => {
		const version = data.document?.schemaVersion || 0;

		if (version < 1) {
			if (data.canvas) {
				try {
					const canvasData = JSON.parse(data.canvas);
					if (canvasData.objects) {
						canvasData.objects.forEach((obj: any) => {
							if (!obj.visible) obj.visible = true;
							if (obj.locked === undefined) obj.locked = false;
						});
						data.canvas = JSON.stringify(canvasData);
					}
				} catch {
					// Silent fail - migration will be retried on next load
				}
			}
		}

		data.document.schemaVersion = CURRENT_SCHEMA_VERSION;
	};

	const load = async (loadFromJson: (json: string) => Promise<void>, pushHistory: (json: string) => void) => {
		const serverData = await fetchServerDocument();
		const saved = (() => {
			try {
				return localStorage.getItem(storageKey.value);
			} catch {
				return null;
			}
		})();

		const data = serverData ?? (saved ? (JSON.parse(saved) as any) : null);
		if (!data) return;

		try {
			if (data.document) {
				options.artboard.width = data.document.artboard.width;
				options.artboard.height = data.document.artboard.height;
				options.backgroundColor.value = data.document.backgroundColor || "#ffffff";

				if (data.document.schemaVersion && data.document.schemaVersion < CURRENT_SCHEMA_VERSION) {
					await migrateDocument(data);
				}
			}

			if (Array.isArray(data.versions)) {
				options.versions.value = data.versions;
			}

			if (data.canvas) {
				await loadFromJson(data.canvas);
				try {
					localStorage.setItem(storageKey.value, JSON.stringify(data));
				} catch {
					// ignore
				}
			} else {
				pushHistory(data.canvas || "{}");
			}
			options.onLoad?.();
		} catch {
			// Silent fail - document will start fresh
			pushHistory("{}");
		}
	};

	const dispose = () => {
		if (autoSaveDebounceTimer) {
			clearTimeout(autoSaveDebounceTimer);
		}
		stopAutoSaveInterval();
	};

	return {
		isDirty,
		lastSaveTime,
		autoSaveEnabled,
		autoSaveIntervalMs,
		save,
		scheduleAutoSave,
		startAutoSaveInterval,
		stopAutoSaveInterval,
		load,
		dispose,
	};
};
