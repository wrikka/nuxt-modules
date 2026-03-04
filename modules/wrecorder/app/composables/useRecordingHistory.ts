import { reactive, readonly, computed } from "vue";

export interface RecordingEntry {
	id: string;
	name: string;
	date: number;
	duration: number;
	size: number;
	thumbnail?: string;
	blob?: Blob;
	url?: string;
	tags: string[];
	folder?: string;
}

export interface RecordingHistoryState {
	recordings: RecordingEntry[];
	selectedIds: string[];
	searchQuery: string;
	filterTags: string[];
	sortBy: "date" | "name" | "duration" | "size";
	sortOrder: "asc" | "desc";
	viewMode: "grid" | "list";
}

const STORAGE_KEY = "wrecorder-history";

export const useRecordingHistory = () => {
	const state = reactive<RecordingHistoryState>({
		recordings: [],
		selectedIds: [],
		searchQuery: "",
		filterTags: [],
		sortBy: "date",
		sortOrder: "desc",
		viewMode: "grid",
	});

	const loadHistory = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				state.recordings = parsed.map((r: RecordingEntry) => ({
					...r,
					blob: undefined,
					url: undefined,
				}));
			} catch {
				state.recordings = [];
			}
		}
	};

	const saveHistory = () => {
		if (typeof window === "undefined") return;
		const storable = state.recordings.map(r => ({
			...r,
			blob: undefined,
			url: undefined,
		}));
		localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
	};

	const addRecording = (entry: Omit<RecordingEntry, "id">): string => {
		const id = `rec-${Date.now()}`;
		const recording: RecordingEntry = { ...entry, id };
		state.recordings.unshift(recording);
		saveHistory();
		return id;
	};

	const deleteRecording = (id: string) => {
		state.recordings = state.recordings.filter(r => r.id !== id);
		state.selectedIds = state.selectedIds.filter(sid => sid !== id);
		saveHistory();
	};

	const deleteSelected = () => {
		state.recordings = state.recordings.filter(r => !state.selectedIds.includes(r.id));
		state.selectedIds = [];
		saveHistory();
	};

	const selectRecording = (id: string, multi = false) => {
		if (multi) {
			if (state.selectedIds.includes(id)) {
				state.selectedIds = state.selectedIds.filter(sid => sid !== id);
			} else {
				state.selectedIds.push(id);
			}
		} else {
			state.selectedIds = [id];
		}
	};

	const selectAll = () => {
		state.selectedIds = filteredRecordings.value.map(r => r.id);
	};

	const clearSelection = () => {
		state.selectedIds = [];
	};

	const updateRecording = (id: string, updates: Partial<RecordingEntry>) => {
		const index = state.recordings.findIndex(r => r.id === id);
		if (index !== -1) {
			state.recordings[index] = { ...state.recordings[index], ...updates };
			saveHistory();
		}
	};

	const addTag = (id: string, tag: string) => {
		const recording = state.recordings.find(r => r.id === id);
		if (recording && !recording.tags.includes(tag)) {
			recording.tags.push(tag);
			saveHistory();
		}
	};

	const removeTag = (id: string, tag: string) => {
		const recording = state.recordings.find(r => r.id === id);
		if (recording) {
			recording.tags = recording.tags.filter(t => t !== tag);
			saveHistory();
		}
	};

	const setSearchQuery = (query: string) => {
		state.searchQuery = query;
	};

	const setSortBy = (sort: RecordingHistoryState["sortBy"]) => {
		state.sortBy = sort;
	};

	const toggleSortOrder = () => {
		state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
	};

	const setViewMode = (mode: RecordingHistoryState["viewMode"]) => {
		state.viewMode = mode;
	};

	const filteredRecordings = computed(() => {
		let result = state.recordings;

		// Filter by search
		if (state.searchQuery) {
			const query = state.searchQuery.toLowerCase();
			result = result.filter(r =>
				r.name.toLowerCase().includes(query) ||
				r.tags.some(t => t.toLowerCase().includes(query))
			);
		}

		// Filter by tags
		if (state.filterTags.length > 0) {
			result = result.filter(r =>
				state.filterTags.every(tag => r.tags.includes(tag))
			);
		}

		// Sort
		result = [...result].sort((a, b) => {
			let comparison = 0;
			switch (state.sortBy) {
				case "date":
					comparison = a.date - b.date;
					break;
				case "name":
					comparison = a.name.localeCompare(b.name);
					break;
				case "duration":
					comparison = a.duration - b.duration;
					break;
				case "size":
					comparison = a.size - b.size;
					break;
			}
			return state.sortOrder === "asc" ? comparison : -comparison;
		});

		return result;
	});

	const allTags = computed(() => {
		const tags = new Set<string>();
		state.recordings.forEach(r => r.tags.forEach(t => tags.add(t)));
		return Array.from(tags);
	});

	const exportHistory = (): string => {
		return JSON.stringify(state.recordings, null, 2);
	};

	const importHistory = (json: string): boolean => {
		try {
			const parsed = JSON.parse(json);
			state.recordings = parsed;
			saveHistory();
			return true;
		} catch {
			return false;
		}
	};

	onMounted(() => {
		loadHistory();
	});

	return {
		state: readonly(state),
		recordings: filteredRecordings,
		allTags,
		addRecording,
		deleteRecording,
		deleteSelected,
		selectRecording,
		selectAll,
		clearSelection,
		updateRecording,
		addTag,
		removeTag,
		setSearchQuery,
		setSortBy,
		toggleSortOrder,
		setViewMode,
		exportHistory,
		importHistory,
	};
};
