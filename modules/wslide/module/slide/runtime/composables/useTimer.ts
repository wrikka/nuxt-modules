import { computed, onUnmounted, readonly, ref } from "vue";

const timerSeconds = ref(0);
const isRunning = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

export function useTimer() {
	function start() {
		if (isRunning.value) return;
		isRunning.value = true;
		intervalId = setInterval(() => {
			timerSeconds.value++;
		}, 1000);
	}

	function stop() {
		isRunning.value = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function reset() {
		stop();
		timerSeconds.value = 0;
	}

	function setTime(seconds: number) {
		timerSeconds.value = seconds;
	}

	const formattedTime = computed(() => {
		const hours = Math.floor(timerSeconds.value / 3600);
		const minutes = Math.floor((timerSeconds.value % 3600) / 60);
		const seconds = timerSeconds.value % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		}
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	});

	onUnmounted(() => {
		stop();
	});

	return {
		seconds: readonly(timerSeconds),
		isRunning: readonly(isRunning),
		formattedTime: readonly(formattedTime),
		start,
		stop,
		reset,
		setTime,
	};
}
