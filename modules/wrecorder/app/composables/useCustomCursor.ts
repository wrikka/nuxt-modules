export type CursorStyle =
	| "default"
	| "circle"
	| "crosshair"
	| "dot"
	| "arrow"
	| "hand"
	| "custom";

export interface CursorOptions {
	style?: CursorStyle;
	customUrl?: string;
	size?: number;
	color?: string;
	opacity?: number;
	trail?: boolean;
	trailLength?: number;
}

export interface CursorState {
	style: CursorStyle;
	x: number;
	y: number;
	isVisible: boolean;
	trail: Array<{ x: number; y: number; timestamp: number }>;
}

export const useCustomCursor = (options: CursorOptions = {}) => {
	const {
		style = "default",
		customUrl,
		size = 32,
		color = "#ff0000",
		opacity = 1,
		trail = false,
		trailLength = 10,
	} = options;

	const state = reactive<CursorState>({
		style,
		x: 0,
		y: 0,
		isVisible: true,
		trail: [],
	});

	let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

	const updatePosition = (e: MouseEvent) => {
		state.x = e.clientX;
		state.y = e.clientY;

		if (trail) {
			state.trail.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
			if (state.trail.length > trailLength) {
				state.trail.shift();
			}
		}
	};

	const setStyle = (newStyle: CursorStyle) => {
		state.style = newStyle;
		applyCursor();
	};

	const setCustomUrl = (url: string) => {
		if (state.style === "custom") {
			applyCursor();
		}
	};

	const applyCursor = () => {
		switch (state.style) {
			case "default":
				document.body.style.cursor = "auto";
				break;
			case "circle":
				document.body.style.cursor = "none";
				break;
			case "crosshair":
				document.body.style.cursor = "crosshair";
				break;
			case "dot":
				document.body.style.cursor = "none";
				break;
			case "arrow":
				document.body.style.cursor = "default";
				break;
			case "hand":
				document.body.style.cursor = "pointer";
				break;
			case "custom":
				if (customUrl) {
					document.body.style.cursor = `url(${customUrl}) ${size / 2} ${size / 2}, auto`;
				}
				break;
		}
	};

	const show = () => {
		state.isVisible = true;
		if (mouseMoveHandler) {
			document.addEventListener("mousemove", mouseMoveHandler);
		}
	};

	const hide = () => {
		state.isVisible = false;
		if (mouseMoveHandler) {
			document.removeEventListener("mousemove", mouseMoveHandler);
		}
	};

	const clearTrail = () => {
		state.trail = [];
	};

	const enable = () => {
		mouseMoveHandler = updatePosition;
		document.addEventListener("mousemove", mouseMoveHandler);
		applyCursor();
	};

	const disable = () => {
		if (mouseMoveHandler) {
			document.removeEventListener("mousemove", mouseMoveHandler);
			mouseMoveHandler = null;
		}
		document.body.style.cursor = "auto";
	};

	onUnmounted(() => {
		disable();
	});

	return {
		state: readonly(state),
		setStyle,
		setCustomUrl,
		show,
		hide,
		clearTrail,
		enable,
		disable,
		options: readonly({ style, customUrl, size, color, opacity, trail, trailLength }),
	};
};
