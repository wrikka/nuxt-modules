import type { VideoProject } from "#shared/types";

interface TimelineHistoryState {
	project: VideoProject;
	description: string;
	timestamp: Date;
}

export const useTimelineHistory = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject } = storeToRefs(videoStore);

	const history = ref<TimelineHistoryState[]>([]);
	const historyIndex = ref(-1);
	const maxHistory = 50;

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const saveState = (description: string) => {
		if (!currentVideoProject.value) return;

		const state: TimelineHistoryState = {
			project: JSON.parse(JSON.stringify(currentVideoProject.value)),
			description,
			timestamp: new Date(),
		};

		history.value = history.value.slice(0, historyIndex.value + 1);
		history.value.push(state);
		historyIndex.value = history.value.length - 1;

		if (history.value.length > maxHistory) {
			history.value.shift();
			historyIndex.value--;
		}
	};

	const undo = () => {
		if (!canUndo.value) return;

		historyIndex.value--;
		const state = history.value[historyIndex.value];

		if (state) {
			Object.assign(currentVideoProject.value!, state.project);
		}
	};

	const redo = () => {
		if (!canRedo.value) return;

		historyIndex.value++;
		const state = history.value[historyIndex.value];

		if (state) {
			Object.assign(currentVideoProject.value!, state.project);
		}
	};

	const clearHistory = () => {
		history.value = [];
		historyIndex.value = -1;
	};

	const getHistoryDescription = (index: number): string => {
		return history.value[index]?.description || "";
	};

	return {
		history,
		historyIndex,
		canUndo,
		canRedo,
		saveState,
		undo,
		redo,
		clearHistory,
		getHistoryDescription,
	};
};
