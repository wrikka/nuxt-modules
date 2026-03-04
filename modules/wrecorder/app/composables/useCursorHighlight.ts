export interface CursorHighlightOptions {
	enabled?: boolean;
	style?: "circle" | "ring" | "spotlight" | "pointer";
	size?: number;
	color?: string;
	borderColor?: string;
	borderWidth?: number;
	opacity?: number;
	pulse?: boolean;
	clickAnimation?: boolean;
}

export interface CursorHighlightState {
	isActive: boolean;
	x: number;
	y: number;
	isClicking: boolean;
	options: CursorHighlightOptions;
}

export const useCursorHighlight = (options: CursorHighlightOptions = {}) => {
	const defaultOptions: CursorHighlightOptions = {
		enabled: true,
		style: "circle",
		size: 40,
		color: "rgba(255, 200, 0, 0.3)",
		borderColor: "#ffc800",
		borderWidth: 2,
		opacity: 0.8,
		pulse: true,
		clickAnimation: true,
	};

	const mergedOptions = { ...defaultOptions, ...options };

	const state = reactive<CursorHighlightState>({
		isActive: false,
		x: 0,
		y: 0,
		isClicking: false,
		options: mergedOptions,
	});

	let highlightElement: HTMLDivElement | null = null;
	let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
	let clickHandler: ((e: MouseEvent) => void) | null = null;

	const createHighlightElement = () => {
		if (typeof document === "undefined") return;

		const el = document.createElement("div");
		el.className = "cursor-highlight";
		el.style.cssText = `
			position: fixed;
			pointer-events: none;
			z-index: 999999;
			border-radius: 50%;
			transition: transform 0.05s ease-out, opacity 0.2s ease;
			display: none;
		`;

		document.body.appendChild(el);
		highlightElement = el;

		updateHighlightStyle();
	};

	const updateHighlightStyle = () => {
		if (!highlightElement) return;

		const { style, size, color, borderColor, borderWidth, opacity, pulse } = state.options;

		highlightElement.style.width = `${size}px`;
		highlightElement.style.height = `${size}px`;
		highlightElement.style.opacity = String(opacity);

		switch (style) {
			case "circle":
				highlightElement.style.backgroundColor = color || "rgba(255, 200, 0, 0.3)";
				highlightElement.style.border = `${borderWidth}px solid ${borderColor}`;
				highlightElement.style.boxShadow = pulse ? `0 0 ${size / 2}px ${color}` : "none";
				break;
			case "ring":
				highlightElement.style.backgroundColor = "transparent";
				highlightElement.style.border = `${borderWidth}px solid ${borderColor}`;
				highlightElement.style.boxShadow = `0 0 ${size / 4}px ${color}`;
				break;
			case "spotlight":
				highlightElement.style.backgroundColor = color || "rgba(255, 255, 0, 0.2)";
				highlightElement.style.border = "none";
				highlightElement.style.boxShadow = `0 0 ${size}px ${size / 2}px ${color}`;
				break;
			case "pointer":
				highlightElement.style.width = "0";
				highlightElement.style.height = "0";
				highlightElement.style.borderRadius = "0";
				highlightElement.style.borderLeft = `${size / 2}px solid transparent`;
				highlightElement.style.borderRight = `${size / 2}px solid transparent`;
				highlightElement.style.borderBottom = `${size}px solid ${borderColor}`;
				highlightElement.style.backgroundColor = "transparent";
				break;
		}
	};

	const updatePosition = (e: MouseEvent) => {
		state.x = e.clientX;
		state.y = e.clientY;

		if (highlightElement) {
			const { size } = state.options;
			highlightElement.style.left = `${e.clientX - (size || 40) / 2}px`;
			highlightElement.style.top = `${e.clientY - (size || 40) / 2}px`;
		}
	};

	const handleClick = () => {
		if (!state.options.clickAnimation || !highlightElement) return;

		state.isClicking = true;
		const originalTransform = highlightElement.style.transform;

		highlightElement.style.transform = `${originalTransform} scale(0.8)`;
		highlightElement.style.transition = "transform 0.1s ease";

		setTimeout(() => {
			highlightElement!.style.transform = originalTransform;
			state.isClicking = false;
		}, 100);
	};

	const start = () => {
		if (!highlightElement) {
			createHighlightElement();
		}

		if (!highlightElement) return;

		state.isActive = true;
		highlightElement.style.display = "block";

		mouseMoveHandler = updatePosition;
		clickHandler = handleClick;

		document.addEventListener("mousemove", mouseMoveHandler);
		document.addEventListener("click", clickHandler);
		document.addEventListener("mousedown", clickHandler);
	};

	const stop = () => {
		state.isActive = false;

		if (highlightElement) {
			highlightElement.style.display = "none";
		}

		if (mouseMoveHandler) {
			document.removeEventListener("mousemove", mouseMoveHandler);
			mouseMoveHandler = null;
		}

		if (clickHandler) {
			document.removeEventListener("click", clickHandler);
			document.removeEventListener("mousedown", clickHandler);
			clickHandler = null;
		}
	};

	const setOptions = (newOptions: Partial<CursorHighlightOptions>) => {
		Object.assign(state.options, newOptions);
		updateHighlightStyle();
	};

	const toggle = () => {
		if (state.isActive) {
			stop();
		} else {
			start();
		}
	};

	const dispose = () => {
		stop();
		if (highlightElement && highlightElement.parentNode) {
			highlightElement.parentNode.removeChild(highlightElement);
			highlightElement = null;
		}
	};

	onUnmounted(() => {
		dispose();
	});

	return {
		state: readonly(state),
		start,
		stop,
		toggle,
		setOptions,
		dispose,
	};
};
