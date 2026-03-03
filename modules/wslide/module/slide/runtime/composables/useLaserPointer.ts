import { onUnmounted, readonly, ref } from "vue";

const isLaserActive = ref(false);
const laserPosition = ref({ x: 0, y: 0 });
const laserColor = ref("#ff0000");
const laserSize = ref(20);

export function useLaserPointer() {
	function toggle() {
		isLaserActive.value = !isLaserActive.value;
	}

	function activate() {
		isLaserActive.value = true;
	}

	function deactivate() {
		isLaserActive.value = false;
	}

	function updatePosition(x: number, y: number) {
		laserPosition.value = { x, y };
	}

	function setColor(color: string) {
		laserColor.value = color;
	}

	function setSize(size: number) {
		laserSize.value = Math.max(10, Math.min(size, 50));
	}

	function handleMouseMove(event: MouseEvent) {
		if (isLaserActive.value) {
			updatePosition(event.clientX, event.clientY);
		}
	}

	onUnmounted(() => {
		deactivate();
	});

	return {
		isActive: readonly(isLaserActive),
		position: readonly(laserPosition),
		color: readonly(laserColor),
		size: readonly(laserSize),
		toggle,
		activate,
		deactivate,
		updatePosition,
		setColor,
		setSize,
		handleMouseMove,
	};
}
