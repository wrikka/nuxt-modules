import { computed, onUnmounted, readonly, ref } from "vue";

const isAutoplayEnabled = ref(false);
const autoplayDelay = ref(5000); // 5 seconds default
const autoplayInterval = ref<ReturnType<typeof setInterval> | null>(null);
const currentCallback = ref<(() => void) | null>(null);

export function useAutoplay() {
	function start(callback: () => void, delay?: number) {
		if (isAutoplayEnabled.value) return;

		currentCallback.value = callback;
		if (delay !== undefined) {
			autoplayDelay.value = delay;
		}

		isAutoplayEnabled.value = true;
		autoplayInterval.value = setInterval(() => {
			callback();
		}, autoplayDelay.value);
	}

	function stop() {
		isAutoplayEnabled.value = false;
		if (autoplayInterval.value) {
			clearInterval(autoplayInterval.value);
			autoplayInterval.value = null;
		}
	}

	function toggle(callback: () => void, delay?: number) {
		if (isAutoplayEnabled.value) {
			stop();
		} else {
			start(callback, delay);
		}
	}

	function setDelay(delay: number) {
		autoplayDelay.value = Math.max(1000, delay);
		// Restart if running
		if (isAutoplayEnabled.value && currentCallback.value) {
			stop();
			start(currentCallback.value, autoplayDelay.value);
		}
	}

	const formattedDelay = computed(() => {
		const seconds = Math.floor(autoplayDelay.value / 1000);
		return `${seconds}s`;
	});

	onUnmounted(() => {
		stop();
	});

	return {
		isEnabled: readonly(isAutoplayEnabled),
		delay: readonly(autoplayDelay),
		formattedDelay: readonly(formattedDelay),
		start,
		stop,
		toggle,
		setDelay,
	};
}
