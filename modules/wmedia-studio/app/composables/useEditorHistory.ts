import * as fabric from "fabric";
import { computed, ref } from "vue";

interface EditorHistoryState {
	canUndo: boolean;
	canRedo: boolean;
	currentIndex: number;
	totalStates: number;
}

export function useEditorHistory(canvas: Ref<fabric.Canvas | null>, maxHistory: number = 50) {
	const history = ref<any[]>([]);
	const currentIndex = ref(-1);
	const isRecording = ref(false);

	const canUndo = computed(() => currentIndex.value > 0);
	const canRedo = computed(() => currentIndex.value < history.value.length - 1);

	const recordState = () => {
		if (!canvas.value || isRecording.value) return;

		isRecording.value = true;

		try {
			const json = canvas.value.toJSON();

			if (currentIndex.value < history.value.length - 1) {
				history.value = history.value.slice(0, currentIndex.value + 1);
			}

			history.value.push(json);

			if (history.value.length > maxHistory) {
				history.value.shift();
			} else {
				currentIndex.value++;
			}
		} finally {
			isRecording.value = false;
		}
	};

	const undo = () => {
		if (!canUndo.value || !canvas.value) return;

		isRecording.value = true;

		try {
			currentIndex.value--;
			const state = history.value[currentIndex.value];
			void canvas.value.loadFromJSON(state, () => {
				canvas.value?.renderAll();
			});
		} finally {
			isRecording.value = false;
		}
	};

	const redo = () => {
		if (!canRedo.value || !canvas.value) return;

		isRecording.value = true;

		try {
			currentIndex.value++;
			const state = history.value[currentIndex.value];
			void canvas.value.loadFromJSON(state, () => {
				canvas.value?.renderAll();
			});
		} finally {
			isRecording.value = false;
		}
	};

	const clearHistory = () => {
		history.value = [];
		currentIndex.value = -1;
	};

	const getState = (): EditorHistoryState => ({
		canUndo: canUndo.value,
		canRedo: canRedo.value,
		currentIndex: currentIndex.value,
		totalStates: history.value.length,
	});

	const loadHistory = (states: any[], index: number = -1) => {
		history.value = states;
		currentIndex.value = index;
	};

	const getHistory = () => ({
		states: history.value,
		currentIndex: currentIndex.value,
	});

	return {
		canUndo,
		canRedo,
		recordState,
		undo,
		redo,
		clearHistory,
		getState,
		loadHistory,
		getHistory,
	};
}
