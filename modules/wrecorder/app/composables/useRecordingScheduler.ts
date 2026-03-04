export interface RecordingSchedule {
	id: string;
	name: string;
	startTime: Date;
	duration?: number;
	recurring?: "once" | "daily" | "weekly" | "monthly";
	presetId?: string;
	enabled: boolean;
	notifyBefore?: number;
}

export interface ScheduleState {
	schedules: RecordingSchedule[];
	isRecording: boolean;
	nextRecording?: RecordingSchedule;
	timeUntilNext: number;
}

const STORAGE_KEY = "wrecorder-schedules";

export const useRecordingScheduler = () => {
	const state = reactive<ScheduleState>({
		schedules: [],
		isRecording: false,
		nextRecording: undefined,
		timeUntilNext: 0,
	});

	let checkInterval: ReturnType<typeof setInterval> | null = null;

	const loadSchedules = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				state.schedules = parsed.map((s: RecordingSchedule) => ({
					...s,
					startTime: new Date(s.startTime),
				}));
			} catch {
				state.schedules = [];
			}
		}
	};

	const saveSchedules = () => {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.schedules));
	};

	const addSchedule = (schedule: Omit<RecordingSchedule, "id">) => {
		const id = `schedule-${Date.now()}`;
		const newSchedule = { ...schedule, id };
		state.schedules.push(newSchedule);
		saveSchedules();
		updateNextRecording();
		return id;
	};

	const updateSchedule = (id: string, updates: Partial<RecordingSchedule>) => {
		const index = state.schedules.findIndex(s => s.id === id);
		if (index !== -1) {
			state.schedules[index] = { ...state.schedules[index], ...updates };
			saveSchedules();
			updateNextRecording();
		}
	};

	const deleteSchedule = (id: string) => {
		state.schedules = state.schedules.filter(s => s.id !== id);
		saveSchedules();
		updateNextRecording();
	};

	const toggleSchedule = (id: string) => {
		const schedule = state.schedules.find(s => s.id === id);
		if (schedule) {
			schedule.enabled = !schedule.enabled;
			saveSchedules();
			updateNextRecording();
		}
	};

	const getNextRecording = (): RecordingSchedule | undefined => {
		const now = new Date().getTime();
		const enabled = state.schedules.filter(s => s.enabled);
		
		if (enabled.length === 0) return undefined;

		return enabled
			.map(s => {
				let nextTime = s.startTime.getTime();
				
				while (nextTime < now) {
					if (s.recurring === "daily") {
						nextTime += 24 * 60 * 60 * 1000;
					} else if (s.recurring === "weekly") {
						nextTime += 7 * 24 * 60 * 60 * 1000;
					} else if (s.recurring === "monthly") {
						nextTime += 30 * 24 * 60 * 60 * 1000;
					} else {
						break;
					}
				}
				
				return { ...s, startTime: new Date(nextTime) };
			})
			.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
	};

	const updateNextRecording = () => {
		state.nextRecording = getNextRecording();
		if (state.nextRecording) {
			state.timeUntilNext = state.nextRecording.startTime.getTime() - Date.now();
		}
	};

	const checkSchedule = () => {
		if (state.isRecording) return;
		
		const now = Date.now();
		const next = state.nextRecording;
		
		if (next && next.enabled) {
			const diff = next.startTime.getTime() - now;
			state.timeUntilNext = diff;
			
			if (diff <= 0 && diff > -60000) {
				return next;
			}
		}
		
		return null;
	};

	const startChecking = (onScheduleTrigger: (schedule: RecordingSchedule) => void) => {
		updateNextRecording();
		checkInterval = setInterval(() => {
			const triggered = checkSchedule();
			if (triggered) {
				onScheduleTrigger(triggered);
			}
		}, 1000);
	};

	const stopChecking = () => {
		if (checkInterval) {
			clearInterval(checkInterval);
			checkInterval = null;
		}
	};

	const getUpcomingSchedules = (hours = 24): RecordingSchedule[] => {
		const now = Date.now();
		const limit = now + hours * 60 * 60 * 1000;
		
		return state.schedules.filter(s => {
			if (!s.enabled) return false;
			return s.startTime.getTime() >= now && s.startTime.getTime() <= limit;
		});
	};

	onMounted(() => {
		loadSchedules();
	});

	onUnmounted(() => {
		stopChecking();
	});

	return {
		state: readonly(state),
		schedules: computed(() => state.schedules),
		nextRecording: computed(() => state.nextRecording),
		timeUntilNext: computed(() => state.timeUntilNext),
		addSchedule,
		updateSchedule,
		deleteSchedule,
		toggleSchedule,
		getNextRecording,
		startChecking,
		stopChecking,
		getUpcomingSchedules,
	};
};
