export interface RecordingPreset {
	id: string;
	name: string;
	videoBitrate?: number;
	audioBitrate?: number;
	frameRate?: number;
	resolution?: "720p" | "1080p" | "1440p" | "4K" | "8K";
	format?: "webm" | "mp4" | "gif";
	includeAudio?: boolean;
	includeWebcam?: boolean;
	annotations?: boolean;
	watermark?: boolean;
	customSettings?: Record<string, unknown>;
}

export interface PresetState {
	presets: RecordingPreset[];
	activePresetId: string | null;
	isLoading: boolean;
}

const STORAGE_KEY = "wrecorder-presets";

const defaultPresets: RecordingPreset[] = [
	{
		id: "default",
		name: "Default (1080p)",
		videoBitrate: 2500000,
		audioBitrate: 128000,
		frameRate: 30,
		resolution: "1080p",
		format: "webm",
		includeAudio: true,
		includeWebcam: false,
		annotations: false,
		watermark: false,
	},
	{
		id: "high-quality",
		name: "High Quality (4K)",
		videoBitrate: 8000000,
		audioBitrate: 256000,
		frameRate: 60,
		resolution: "4K",
		format: "webm",
		includeAudio: true,
		includeWebcam: true,
		annotations: true,
		watermark: true,
	},
	{
		id: "webcam-only",
		name: "Webcam Only",
		videoBitrate: 1500000,
		audioBitrate: 128000,
		frameRate: 30,
		resolution: "720p",
		format: "webm",
		includeAudio: true,
		includeWebcam: true,
		annotations: false,
		watermark: false,
	},
	{
		id: "gif",
		name: "GIF Recording",
		videoBitrate: 500000,
		frameRate: 10,
		resolution: "720p",
		format: "gif",
		includeAudio: false,
		includeWebcam: false,
		annotations: false,
		watermark: false,
	},
];

export const useRecordingPresets = () => {
	const state = reactive<PresetState>({
		presets: [...defaultPresets],
		activePresetId: "default",
		isLoading: false,
	});

	const loadPresets = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				state.presets = [...defaultPresets, ...parsed.custom || []];
			} catch {
				// ใช้ค่าเริ่มต้น
			}
		}
	};

	const savePresets = () => {
		if (typeof window === "undefined") return;
		const custom = state.presets.filter(
			p => !defaultPresets.find(d => d.id === p.id)
		);
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ custom }));
	};

	const addPreset = (preset: Omit<RecordingPreset, "id">) => {
		const id = `custom-${Date.now()}`;
		const newPreset = { ...preset, id };
		state.presets.push(newPreset);
		savePresets();
		return id;
	};

	const updatePreset = (id: string, updates: Partial<RecordingPreset>) => {
		const index = state.presets.findIndex(p => p.id === id);
		if (index !== -1) {
			state.presets[index] = { ...state.presets[index], ...updates };
			savePresets();
		}
	};

	const deletePreset = (id: string) => {
		state.presets = state.presets.filter(p => p.id !== id);
		if (state.activePresetId === id) {
			state.activePresetId = "default";
		}
		savePresets();
	};

	const setActivePreset = (id: string) => {
		if (state.presets.find(p => p.id === id)) {
			state.activePresetId = id;
		}
	};

	const getActivePreset = (): RecordingPreset | undefined => {
		return state.presets.find(p => p.id === state.activePresetId);
	};

	const resetToDefaults = () => {
		state.presets = [...defaultPresets];
		state.activePresetId = "default";
		savePresets();
	};

	// โหลด presets เมื่อเริ่มต้น
	onMounted(() => {
		loadPresets();
	});

	return {
		state: readonly(state),
		presets: computed(() => state.presets),
		activePreset: computed(() => getActivePreset()),
		addPreset,
		updatePreset,
		deletePreset,
		setActivePreset,
		getActivePreset,
		resetToDefaults,
		loadPresets,
	};
};
