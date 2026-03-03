import type {
	DesignerSnapshot,
	ExportOptions,
	Project,
	ProjectSettings,
	TimelineItem,
	TimelineTrack,
	TransformProperties,
} from "#shared/types";
import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
	const currentProject = ref<Project | null>(null);
	const projects = ref<Project[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// Timeline and Playback State
	const currentTime = ref(0);
	const isPlaying = ref(false);
	const selectedItemId = ref<string | null>(null);
	const selectedTrackId = ref<string | null>(null);

	// History State (for undo/redo)
	const history = ref<DesignerSnapshot[]>([]);
	const historyIndex = ref(-1);
	const MAX_HISTORY_SIZE = 50;

	const createProject = async (data: {
		name: string;
		description?: string;
		width: number;
		height: number;
		backgroundColor?: string;
		folderId?: string;
	}) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: { projectId: string } }>("/api/projects", {
				method: "POST",
				body: data,
			});

			return response.data.projectId;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const loadProject = async (projectId: string) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: Project }>(`/api/projects/${projectId}`);
			currentProject.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const saveProject = async () => {
		if (!currentProject.value) {
			throw new Error("No project to save");
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: Project }>(`/api/projects/${currentProject.value.id}`, {
				method: "PUT",
				body: currentProject.value,
			});

			currentProject.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to save project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const updateProject = (updates: Partial<Project>) => {
		if (currentProject.value) {
			currentProject.value = {
				...currentProject.value,
				...updates,
				updatedAt: new Date(),
			};
		}
	};

	const updateSettings = (settings: Partial<ProjectSettings>) => {
		if (currentProject.value) {
			currentProject.value.settings = {
				...currentProject.value.settings,
				...settings,
			};
		}
	};

	const deleteProject = async (projectId: string) => {
		loading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/projects/${projectId}`, {
				method: "DELETE",
			});

			if (currentProject.value?.id === projectId) {
				currentProject.value = null;
			}

			projects.value = projects.value.filter((p) => p.id !== projectId);
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const duplicateProject = async (projectId: string) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: { projectId: string } }>(`/api/projects/${projectId}/duplicate`, {
				method: "POST",
			});

			return response.data.projectId;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to duplicate project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const exportProject = async (options: ExportOptions) => {
		if (!currentProject.value) {
			throw new Error("No project to export");
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: { url: string } }>(`/api/projects/${currentProject.value.id}/export`, {
				method: "POST",
				body: options,
			});

			return response.data.url;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to export project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// --- Timeline Actions ---

	const addTrack = (name: string) => {
		if (!currentProject.value) return;

		const track: TimelineTrack = {
			id: `track-${nanoid()}`,
			name: name || `Track ${currentProject.value.tracks.length + 1}`,
			locked: false,
			visible: true,
		};

		currentProject.value.tracks.push(track);
	};

	const removeTrack = (trackId: string) => {
		if (!currentProject.value) return;

		currentProject.value.tracks = currentProject.value.tracks.filter((t) => t.id !== trackId);
		currentProject.value.timelineItems = currentProject.value.timelineItems.filter((item) => item.trackId !== trackId);
	};

	const addItem = (item: Omit<TimelineItem, "id" | "transform"> & { transform?: Partial<TransformProperties> }) => {
		if (!currentProject.value) return;

		const newItem: TimelineItem = {
			...item,
			id: `item-${nanoid()}`,
			transform: {
				x: item.transform?.x || [{ id: `kf-x-${nanoid()}`, time: 0, value: 0, easing: "linear" }],
				y: item.transform?.y || [{ id: `kf-y-${nanoid()}`, time: 0, value: 0, easing: "linear" }],
				scale: item.transform?.scale || [{ id: `kf-scale-${nanoid()}`, time: 0, value: 1, easing: "linear" }],
				rotation: item.transform?.rotation || [{ id: `kf-rotation-${nanoid()}`, time: 0, value: 0, easing: "linear" }],
				opacity: item.transform?.opacity || [{ id: `kf-opacity-${nanoid()}`, time: 0, value: 1, easing: "linear" }],
			},
		};

		if (item.type === "audio") {
			delete (newItem as Partial<TimelineItem>).transform;
		}

		currentProject.value.timelineItems.push(newItem);
		currentProject.value.duration = Math.max(
			currentProject.value.duration,
			item.endTime,
		);
	};

	const removeItem = (itemId: string) => {
		if (!currentProject.value) return;
		currentProject.value.timelineItems = currentProject.value.timelineItems.filter((item) => item.id !== itemId);
	};

	const updateItem = (itemId: string, updates: Partial<TimelineItem>) => {
		if (!currentProject.value) return;
		const item = currentProject.value.timelineItems.find((i) => i.id === itemId);
		if (item) {
			Object.assign(item, updates);
		}
	};

	const splitItem = (itemId: string, splitTime: number) => {
		if (!currentProject.value) return;

		const itemIndex = currentProject.value.timelineItems.findIndex((i) => i.id === itemId);
		if (itemIndex === -1) return;

		const item = currentProject.value.timelineItems[itemIndex];
		if (!item || splitTime <= item.startTime || splitTime >= item.endTime) return;

		const firstItem: TimelineItem = {
			...JSON.parse(JSON.stringify(item)), // Deep copy
			id: `item-${nanoid()}`,
			endTime: splitTime,
			duration: splitTime - item.startTime,
		};

		const secondItem: TimelineItem = {
			...JSON.parse(JSON.stringify(item)), // Deep copy
			id: `item-${nanoid()}`,
			startTime: splitTime,
			duration: item.endTime - splitTime,
		};

		currentProject.value.timelineItems.splice(itemIndex, 1, firstItem, secondItem);
	};

	const trimItem = (itemId: string, newStartTime: number, newEndTime: number) => {
		if (!currentProject.value) return;
		const item = currentProject.value.timelineItems.find((i) => i.id === itemId);
		if (item) {
			item.startTime = newStartTime;
			item.endTime = newEndTime;
			item.duration = newEndTime - newStartTime;
		}
	};

	// --- Playback Actions ---
	const setCurrentTime = (time: number) => {
		currentTime.value = Math.max(0, time);
	};

	const togglePlayback = () => {
		isPlaying.value = !isPlaying.value;
	};

	const selectItem = (itemId: string | null) => {
		selectedItemId.value = itemId;
	};

	const selectTrack = (trackId: string | null) => {
		selectedTrackId.value = trackId;
	};

	// --- History Management (Undo/Redo) ---
	const pushHistory = () => {
		if (!currentProject.value) return;

		// Remove any future history if we're not at the end
		history.value = history.value.slice(0, historyIndex.value + 1);

		// Add new snapshot
		const snapshot: DesignerSnapshot = {
			version: historyIndex.value + 1,
			schemaVersion: 1,
			timestamp: Date.now(),
			json: JSON.stringify({
				project: currentProject.value,
				timelineItems: currentProject.value.timelineItems,
				tracks: currentProject.value.tracks,
			}),
		};

		history.value.push(snapshot);
		historyIndex.value++;

		// Limit history size
		if (history.value.length > MAX_HISTORY_SIZE) {
			history.value.shift();
			historyIndex.value--;
		}
	};

	const undo = () => {
		if (historyIndex.value > 0) {
			historyIndex.value--;
			loadFromHistory(historyIndex.value);
		}
	};

	const redo = () => {
		if (historyIndex.value < history.value.length - 1) {
			historyIndex.value++;
			loadFromHistory(historyIndex.value);
		}
	};

	const loadFromHistory = (index: number) => {
		const snapshot = history.value[index];
		if (!snapshot || !currentProject.value) return;

		try {
			const data = JSON.parse(snapshot.json);
			if (data.project) {
				Object.assign(currentProject.value, data.project);
			}
			if (data.timelineItems) {
				currentProject.value.timelineItems = data.timelineItems;
			}
			if (data.tracks) {
				currentProject.value.tracks = data.tracks;
			}
		} catch (err) {
			console.error("Failed to load from history:", err);
		}
	};

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	return {
		// State
		currentProject,
		projects,
		loading,
		error,
		currentTime,
		isPlaying,
		selectedItemId,
		selectedTrackId,
		history,
		historyIndex,
		canUndo,
		canRedo,

		// Project Actions
		createProject,
		loadProject,
		saveProject,
		updateProject,
		updateSettings,
		deleteProject,
		duplicateProject,
		exportProject,

		// Timeline Actions
		addTrack,
		removeTrack,
		addItem,
		removeItem,
		updateItem,
		splitItem,
		trimItem,

		// Playback Actions
		setCurrentTime,
		togglePlayback,
		selectItem,
		selectTrack,

		// History Actions
		pushHistory,
		undo,
		redo,
		loadFromHistory,
	};
});
