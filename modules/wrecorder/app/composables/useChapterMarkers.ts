export interface ChapterMarker {
	id: string;
	timestamp: number;
	label: string;
	description?: string;
	color?: string;
}

export interface ChapterState {
	markers: ChapterMarker[];
	currentChapter?: ChapterMarker;
	isRecording: boolean;
}

export const useChapterMarkers = () => {
	const state = reactive<ChapterState>({
		markers: [],
		currentChapter: undefined,
		isRecording: false,
	});

	const recordingStartTime = ref<number>(0);

	const startRecording = () => {
		state.isRecording = true;
		recordingStartTime.value = Date.now();
		state.markers = [];
	};

	const stopRecording = () => {
		state.isRecording = false;
		state.currentChapter = undefined;
	};

	const addMarker = (label: string, description?: string, color?: string): string => {
		if (!state.isRecording) return "";

		const timestamp = Date.now() - recordingStartTime.value;
		const id = `chapter-${Date.now()}`;
		
		const marker: ChapterMarker = {
			id,
			timestamp,
			label,
			description,
			color: color || "#3b82f6",
		};

		state.markers.push(marker);
		state.currentChapter = marker;
		
		return id;
	};

	const updateMarker = (id: string, updates: Partial<ChapterMarker>) => {
		const index = state.markers.findIndex(m => m.id === id);
		if (index !== -1) {
			state.markers[index] = { ...state.markers[index], ...updates };
		}
	};

	const deleteMarker = (id: string) => {
		state.markers = state.markers.filter(m => m.id !== id);
		if (state.currentChapter?.id === id) {
			state.currentChapter = state.markers[state.markers.length - 1];
		}
	};

	const getMarkerAtTime = (timeMs: number): ChapterMarker | undefined => {
		return state.markers
			.filter(m => m.timestamp <= timeMs)
			.sort((a, b) => b.timestamp - a.timestamp)[0];
	};

	const getNextMarker = (timeMs: number): ChapterMarker | undefined => {
		return state.markers
			.filter(m => m.timestamp > timeMs)
			.sort((a, b) => a.timestamp - b.timestamp)[0];
	};

	const getMarkersInRange = (startMs: number, endMs: number): ChapterMarker[] => {
		return state.markers.filter(m => m.timestamp >= startMs && m.timestamp <= endMs);
	};

	const jumpToMarker = (id: string): number | null => {
		const marker = state.markers.find(m => m.id === id);
		return marker ? marker.timestamp : null;
	};

	const exportChapters = (): string => {
		return JSON.stringify(state.markers, null, 2);
	};

	const importChapters = (json: string) => {
		try {
			const parsed = JSON.parse(json);
			if (Array.isArray(parsed)) {
				state.markers = parsed;
			}
		} catch {
			// ไม่สามารถ import ได้
		}
	};

	const generateVTT = (): string => {
		let vtt = "WEBVTT\n\n";
		
		state.markers.forEach((marker, index) => {
			const startTime = formatTime(marker.timestamp);
			const nextMarker = state.markers[index + 1];
			const endTime = nextMarker ? formatTime(nextMarker.timestamp) : "99:59:59.999";
			
			vtt += `${startTime} --> ${endTime}\n`;
			vtt += `${marker.label}\n`;
			if (marker.description) {
				vtt += `${marker.description}\n`;
			}
			vtt += "\n";
		});
		
		return vtt;
	};

	const formatTime = (ms: number): string => {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = Math.floor(ms % 1000);
		
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
	};

	return {
		state: readonly(state),
		markers: computed(() => state.markers),
		currentChapter: computed(() => state.currentChapter),
		startRecording,
		stopRecording,
		addMarker,
		updateMarker,
		deleteMarker,
		getMarkerAtTime,
		getNextMarker,
		getMarkersInRange,
		jumpToMarker,
		exportChapters,
		importChapters,
		generateVTT,
		formatTime,
	};
};
