import { onUnmounted, readonly, ref } from "vue";

const isSpotlightActive = ref(false);
const spotlightPosition = ref({ x: 0, y: 0 });
const spotlightSize = ref(150);

export function useSpotlight() {
	function toggle() {
		isSpotlightActive.value = !isSpotlightActive.value;
	}

	function activate() {
		isSpotlightActive.value = true;
	}

	function deactivate() {
		isSpotlightActive.value = false;
	}

	function updatePosition(x: number, y: number) {
		spotlightPosition.value = { x, y };
	}

	function setSize(size: number) {
		spotlightSize.value = Math.max(50, Math.min(size, 400));
	}

	function handleMouseMove(event: MouseEvent) {
		if (isSpotlightActive.value) {
			updatePosition(event.clientX, event.clientY);
		}
	}

	onUnmounted(() => {
		deactivate();
	});

	return {
		isActive: readonly(isSpotlightActive),
		position: readonly(spotlightPosition),
		size: readonly(spotlightSize),
		toggle,
		activate,
		deactivate,
		updatePosition,
		setSize,
		handleMouseMove,
	};
}
