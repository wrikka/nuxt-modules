export interface ZoomState {
	scale: number;
	x: number;
	y: number;
	isZooming: boolean;
	minScale: number;
	maxScale: number;
}

export interface ZoomOptions {
	minScale?: number;
	maxScale?: number;
	step?: number;
	smooth?: boolean;
}

export const useZoomPan = (options: ZoomOptions = {}) => {
	const {
		minScale = 1,
		maxScale = 5,
		step = 0.1,
		smooth = true,
	} = options;

	const state = reactive<ZoomState>({
		scale: 1,
		x: 0,
		y: 0,
		isZooming: false,
		minScale,
		maxScale,
	});

	const targetScale = ref(1);
	const animationFrame: Ref<number | null> = ref(null);

	const zoomIn = (amount = step) => {
		targetScale.value = Math.min(maxScale, state.scale + amount);
		applyZoom();
	};

	const zoomOut = (amount = step) => {
		targetScale.value = Math.max(minScale, state.scale - amount);
		applyZoom();
	};

	const zoomTo = (scale: number, centerX?: number, centerY?: number) => {
		targetScale.value = Math.max(minScale, Math.min(maxScale, scale));

		if (centerX !== undefined && centerY !== undefined) {
			// Zoom to specific point
			const rect = { width: window.innerWidth, height: window.innerHeight };
			state.x = centerX - (centerX - state.x) * (targetScale.value / state.scale);
			state.y = centerY - (centerY - state.y) * (targetScale.value / state.scale);
		}

		applyZoom();
	};

	const resetZoom = () => {
		targetScale.value = 1;
		state.x = 0;
		state.y = 0;
		applyZoom();
	};

	const applyZoom = () => {
		if (!smooth) {
			state.scale = targetScale.value;
			return;
		}

		if (animationFrame.value) {
			cancelAnimationFrame(animationFrame.value);
		}

		const animate = () => {
			const diff = targetScale.value - state.scale;

			if (Math.abs(diff) < 0.001) {
				state.scale = targetScale.value;
				state.isZooming = false;
				return;
			}

			state.scale += diff * 0.1;
			state.isZooming = true;
			animationFrame.value = requestAnimationFrame(animate);
		};

		animate();
	};

	const pan = (deltaX: number, deltaY: number) => {
		if (state.scale === 1) return;

		state.x += deltaX;
		state.y += deltaY;

		// Limit panning
		const maxPan = (state.scale - 1) * 500;
		state.x = Math.max(-maxPan, Math.min(maxPan, state.x));
		state.y = Math.max(-maxPan, Math.min(maxPan, state.y));
	};

	const panTo = (x: number, y: number) => {
		state.x = x;
		state.y = y;
	};

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();

		if (e.ctrlKey || e.metaKey) {
			// Zoom with Ctrl/Cmd + scroll
			const delta = e.deltaY > 0 ? -step : step;
			zoomTo(state.scale + delta, e.clientX, e.clientY);
		} else {
			// Pan with scroll
			pan(-e.deltaX, -e.deltaY);
		}
	};

	const startDragPan = (e: MouseEvent) => {
		if (state.scale === 1) return;

		const startX = e.clientX - state.x;
		const startY = e.clientY - state.y;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			state.x = moveEvent.clientX - startX;
			state.y = moveEvent.clientY - startY;
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const getTransformStyle = () => {
		return {
			transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
			transformOrigin: "center center",
			transition: smooth ? "transform 0.1s ease-out" : "none",
		};
	};

	const enableWheelZoom = (element: HTMLElement) => {
		element.addEventListener("wheel", handleWheel, { passive: false });
		element.style.cursor = state.scale > 1 ? "grab" : "default";
	};

	const disableWheelZoom = (element: HTMLElement) => {
		element.removeEventListener("wheel", handleWheel);
	};

	onUnmounted(() => {
		if (animationFrame.value) {
			cancelAnimationFrame(animationFrame.value);
		}
	});

	return {
		state: readonly(state),
		zoomIn,
		zoomOut,
		zoomTo,
		resetZoom,
		pan,
		panTo,
		startDragPan,
		getTransformStyle,
		enableWheelZoom,
		disableWheelZoom,
	};
};
