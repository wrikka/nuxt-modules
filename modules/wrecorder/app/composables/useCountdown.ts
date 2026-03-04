export interface CountdownOptions {
	duration?: number;
	showNumbers?: boolean;
	autoStart?: boolean;
	onComplete?: () => void;
}

export interface CountdownState {
	isActive: boolean;
	count: number;
	isComplete: boolean;
}

export const useCountdown = (options: CountdownOptions = {}) => {
	const {
		duration = 3,
		showNumbers = true,
		autoStart = false,
		onComplete,
	} = options;

	const state = reactive<CountdownState>({
		isActive: false,
		count: duration,
		isComplete: false,
	});

	let intervalId: ReturnType<typeof setInterval> | null = null;

	const start = () => {
		if (state.isActive) return;

		state.isActive = true;
		state.count = duration;
		state.isComplete = false;

		intervalId = setInterval(() => {
			state.count--;

			if (state.count <= 0) {
				stop();
				state.isComplete = true;
				onComplete?.();
			}
		}, 1000);
	};

	const stop = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		state.isActive = false;
	};

	const reset = () => {
		stop();
		state.count = duration;
		state.isComplete = false;
	};

	const setDuration = (newDuration: number) => {
		state.count = newDuration;
	};

	onUnmounted(() => {
		stop();
	});

	if (autoStart) {
		nextTick(() => start());
	}

	return {
		state: readonly(state),
		start,
		stop,
		reset,
		setDuration,
		showNumbers: readonly(toRef(showNumbers)),
	};
};
