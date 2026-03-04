export interface RecordingStats {
	totalRecordings: number;
	totalDuration: number;
	totalSize: number;
	averageDuration: number;
	formats: Record<string, number>;
	resolutions: Record<string, number>;
}

export interface DailyStats {
	date: string;
	recordings: number;
	duration: number;
	size: number;
}

export interface AnalyticsState {
	totalStats: RecordingStats;
	dailyStats: DailyStats[];
	recentRecordings: RecordingEntry[];
	isLoading: boolean;
}

export interface RecordingEntry {
	id: string;
	timestamp: number;
	duration: number;
	size: number;
	format: string;
	resolution: string;
	filename: string;
}

const STORAGE_KEY = "wrecorder-analytics";
const MAX_RECENT_RECORDINGS = 100;
const MAX_DAILY_STATS = 365;

export const useAnalytics = () => {
	const state = reactive<AnalyticsState>({
		totalStats: {
			totalRecordings: 0,
			totalDuration: 0,
			totalSize: 0,
			averageDuration: 0,
			formats: {},
			resolutions: {},
		},
		dailyStats: [],
		recentRecordings: [],
		isLoading: false,
	});

	const loadStats = () => {
		if (typeof window === "undefined") return;
		
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				Object.assign(state.totalStats, parsed.totalStats);
				state.dailyStats = parsed.dailyStats || [];
				state.recentRecordings = parsed.recentRecordings || [];
			} catch {
				// ใช้ค่าเริ่มต้น
			}
		}
	};

	const saveStats = () => {
		if (typeof window === "undefined") return;
		
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			totalStats: state.totalStats,
			dailyStats: state.dailyStats,
			recentRecordings: state.recentRecordings,
		}));
	};

	const recordRecording = (recording: Omit<RecordingEntry, "id" | "timestamp">) => {
		const entry: RecordingEntry = {
			...recording,
			id: `rec-${Date.now()}`,
			timestamp: Date.now(),
		};

		// อัปเดต total stats
		state.totalStats.totalRecordings++;
		state.totalStats.totalDuration += recording.duration;
		state.totalStats.totalSize += recording.size;
		state.totalStats.averageDuration = 
			state.totalStats.totalDuration / state.totalStats.totalRecordings;

		// อัปเดต formats
		state.totalStats.formats[recording.format] = 
			(state.totalStats.formats[recording.format] || 0) + 1;

		// อัปเดต resolutions
		state.totalStats.resolutions[recording.resolution] = 
			(state.totalStats.resolutions[recording.resolution] || 0) + 1;

		// เพิ่ม recent recordings
		state.recentRecordings.unshift(entry);
		if (state.recentRecordings.length > MAX_RECENT_RECORDINGS) {
			state.recentRecordings = state.recentRecordings.slice(0, MAX_RECENT_RECORDINGS);
		}

		// อัปเดต daily stats
		updateDailyStats(recording.duration, recording.size);

		saveStats();
	};

	const updateDailyStats = (duration: number, size: number) => {
		const today = new Date().toISOString().split("T")[0];
		const existingIndex = state.dailyStats.findIndex(s => s.date === today);

		if (existingIndex !== -1) {
			const existing = state.dailyStats[existingIndex];
			existing.recordings++;
			existing.duration += duration;
			existing.size += size;
		} else {
			state.dailyStats.push({
				date: today,
				recordings: 1,
				duration,
				size,
			});
		}

		// จำกัดจำนวน daily stats
		if (state.dailyStats.length > MAX_DAILY_STATS) {
			state.dailyStats = state.dailyStats.slice(-MAX_DAILY_STATS);
		}
	};

	const getStatsForPeriod = (days: number): RecordingStats => {
		const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
		const periodRecordings = state.recentRecordings.filter(r => r.timestamp >= cutoff);

		if (periodRecordings.length === 0) {
			return {
				totalRecordings: 0,
				totalDuration: 0,
				totalSize: 0,
				averageDuration: 0,
				formats: {},
				resolutions: {},
			};
		}

		const formats: Record<string, number> = {};
		const resolutions: Record<string, number> = {};
		let totalDuration = 0;
		let totalSize = 0;

		periodRecordings.forEach(r => {
			formats[r.format] = (formats[r.format] || 0) + 1;
			resolutions[r.resolution] = (resolutions[r.resolution] || 0) + 1;
			totalDuration += r.duration;
			totalSize += r.size;
		});

		return {
			totalRecordings: periodRecordings.length,
			totalDuration,
			totalSize,
			averageDuration: totalDuration / periodRecordings.length,
			formats,
			resolutions,
		};
	};

	const getMostUsedFormat = (): string | null => {
		const entries = Object.entries(state.totalStats.formats);
		if (entries.length === 0) return null;
		return entries.sort((a, b) => b[1] - a[1])[0][0];
	};

	const getMostUsedResolution = (): string | null => {
		const entries = Object.entries(state.totalStats.resolutions);
		if (entries.length === 0) return null;
		return entries.sort((a, b) => b[1] - a[1])[0][0];
	};

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	};

	const formatDuration = (ms: number): string => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		
		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		}
		return `${seconds}s`;
	};

	const resetStats = () => {
		state.totalStats = {
			totalRecordings: 0,
			totalDuration: 0,
			totalSize: 0,
			averageDuration: 0,
			formats: {},
			resolutions: {},
		};
		state.dailyStats = [];
		state.recentRecordings = [];
		saveStats();
	};

	onMounted(() => {
		loadStats();
	});

	return {
		state: readonly(state),
		totalStats: computed(() => state.totalStats),
		recentRecordings: computed(() => state.recentRecordings),
		recordRecording,
		getStatsForPeriod,
		getMostUsedFormat,
		getMostUsedResolution,
		formatBytes,
		formatDuration,
		resetStats,
	};
};
