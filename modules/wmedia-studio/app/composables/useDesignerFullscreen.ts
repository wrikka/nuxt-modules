import { onMounted, onUnmounted, ref } from "vue";

export const useDesignerFullscreen = () => {
	const isFullscreen = ref(false);

	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
				isFullscreen.value = true;
			} else {
				await document.exitFullscreen();
				isFullscreen.value = false;
			}
		} catch (err) {
			console.error("Fullscreen error:", err);
		}
	};

	const handleFullscreenChange = () => {
		isFullscreen.value = !!document.fullscreenElement;
	};

	onMounted(() => {
		document.addEventListener("fullscreenchange", handleFullscreenChange);
	});

	onUnmounted(() => {
		document.removeEventListener("fullscreenchange", handleFullscreenChange);
	});

	return {
		isFullscreen,
		toggleFullscreen,
	};
};
