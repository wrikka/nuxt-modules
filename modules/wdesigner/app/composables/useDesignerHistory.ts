import type { fabric } from "fabric";
import { ref } from "vue";

const CURRENT_SCHEMA_VERSION = 1;
const MAX_HISTORY_SIZE = 50;
const HISTORY_DEBOUNCE_MS = 300;

export interface DesignerSnapshot {
	version: number;
	schemaVersion: number;
	timestamp: number;
	json: string;
}

export interface UseDesignerHistoryOptions {
	getCanvas: () => fabric.Canvas | null;
	canvasJsonExtraProps: string[];
	onHistoryChange?: () => void;
}

export const useDesignerHistory = (options: UseDesignerHistoryOptions) => {
	const history = ref<DesignerSnapshot[]>([]);
	const historyIndex = ref(-1);
	const isHistoryEnabled = ref(true);

	let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	const pushHistory = () => {
		if (!isHistoryEnabled.value) return;

		if (historyDebounceTimer) {
			clearTimeout(historyDebounceTimer);
		}

		historyDebounceTimer = setTimeout(() => {
			const c = options.getCanvas();
			if (!c) return;

			const json = JSON.stringify((c as any).toJSON(options.canvasJsonExtraProps));
			const snapshot: DesignerSnapshot = {
				version: historyIndex.value + 1,
				schemaVersion: CURRENT_SCHEMA_VERSION,
				timestamp: Date.now(),
				json,
			};

			history.value = history.value.slice(0, historyIndex.value + 1);
			history.value.push(snapshot);
			historyIndex.value = history.value.length - 1;

			if (history.value.length > MAX_HISTORY_SIZE) {
				const removed = history.value.shift();
				if (removed) {
					historyIndex.value--;
				}
			}

			options.onHistoryChange?.();
		}, HISTORY_DEBOUNCE_MS);
	};

	const loadFromJson = async (json: string) => {
		const c = options.getCanvas();
		if (!c) return;

		isHistoryEnabled.value = false;

		await new Promise<void>((resolve, reject) => {
			try {
				void c.loadFromJSON(json, () => {
					c.renderAll();
					resolve();
				});
			} catch (err) {
				reject(err);
			}
		});

		isHistoryEnabled.value = true;
	};

	const undo = async () => {
		if (historyIndex.value <= 0) return;
		historyIndex.value--;
		const snapshot = history.value[historyIndex.value];
		if (!snapshot) return;
		await loadFromJson(snapshot.json);
	};

	const redo = async () => {
		if (historyIndex.value >= history.value.length - 1) return;
		historyIndex.value++;
		const snapshot = history.value[historyIndex.value];
		if (!snapshot) return;
		await loadFromJson(snapshot.json);
	};

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const dispose = () => {
		if (historyDebounceTimer) {
			clearTimeout(historyDebounceTimer);
		}
	};

	const clearHistory = () => {
		history.value = [];
		historyIndex.value = -1;
	};

	const initializeWithSnapshot = (json: string) => {
		const snapshot: DesignerSnapshot = {
			version: 0,
			schemaVersion: CURRENT_SCHEMA_VERSION,
			timestamp: Date.now(),
			json,
		};
		history.value = [snapshot];
		historyIndex.value = 0;
	};

	return {
		history,
		historyIndex,
		canUndo,
		canRedo,
		pushHistory,
		undo,
		redo,
		dispose,
		clearHistory,
		initializeWithSnapshot,
		isHistoryEnabled,
	};
};
