export interface MagnifierOptions {
	size?: number;
	zoomLevel?: number;
	shape?: "circle" | "square" | "rectangle";
	borderColor?: string;
	borderWidth?: number;
	enabled?: boolean;
}

export interface MagnifierState {
	isActive: boolean;
	x: number;
	y: number;
	options: MagnifierOptions;
	magnifiedX: number;
	magnifiedY: number;
}

export const useScreenMagnifier = (options: MagnifierOptions = {}) => {
	const defaultOptions: MagnifierOptions = {
		size: 150,
		zoomLevel: 2,
		shape: "circle",
		borderColor: "#3b82f6",
		borderWidth: 3,
		enabled: true,
	};

	const mergedOptions = { ...defaultOptions, ...options };

	const state = reactive<MagnifierState>({
		isActive: false,
		x: 0,
		y: 0,
		options: mergedOptions,
		magnifiedX: 0,
		magnifiedY: 0,
	});

	let magnifierElement: HTMLDivElement | null = null;
	let sourceElement: HTMLElement | null = null;
	let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

	const createMagnifier = () => {
		if (typeof document === "undefined") return;

		const el = document.createElement("div");
		el.className = "screen-magnifier";
		updateMagnifierStyle(el);
		el.style.display = "none";
		document.body.appendChild(el);
		magnifierElement = el;
	};

	const updateMagnifierStyle = (el: HTMLDivElement) => {
		const { size, shape, borderColor, borderWidth } = state.options;
		const s = size || 150;

		el.style.cssText = `
			position: fixed;
			width: ${s}px;
			height: ${s}px;
			border: ${borderWidth}px solid ${borderColor};
			border-radius: ${shape === "circle" ? "50%" : shape === "square" ? "0" : "8px"};
			overflow: hidden;
			pointer-events: none;
			z-index: 999999;
			box-shadow: 0 4px 20px rgba(0,0,0,0.3);
		`;
	};

	const initialize = (source: HTMLElement) => {
		sourceElement = source;
		if (!magnifierElement) {
			createMagnifier();
		}
	};

	const updatePosition = (e: MouseEvent) => {
		if (!magnifierElement || !sourceElement) return;

		const rect = sourceElement.getBoundingClientRect();
		const { size, zoomLevel } = state.options;
		const s = size || 150;
		const zoom = zoomLevel || 2;

		// ตำแหน่ง cursor บน source
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// ตำแหน่ง magnifier
		state.x = e.clientX - s / 2;
		state.y = e.clientY - s / 2;

		// ตำแหน่งที่จะแสดงใน magnifier
		state.magnifiedX = -x * zoom + s / 2;
		state.magnifiedY = -y * zoom + s / 2;

		// อัปเดตตำแหน่ง element
		magnifierElement.style.left = `${state.x}px`;
		magnifierElement.style.top = `${state.y}px`;

		// สร้าง magnified view
		updateMagnifiedView(x, y, zoom);
	};

	const updateMagnifiedView = (x: number, y: number, zoom: number) => {
		if (!magnifierElement || !sourceElement) return;

		const rect = sourceElement.getBoundingClientRect();
		
		// ใช้ CSS transform สร้าง zoom effect
		magnifierElement.innerHTML = "";
		
		// สร้าง container สำหรับ magnified content
		const container = document.createElement("div");
		container.style.cssText = `
			position: absolute;
			width: ${rect.width * zoom}px;
			height: ${rect.height * zoom}px;
			transform: translate(${-x * zoom + (state.options.size || 150) / 2}px, ${-y * zoom + (state.options.size || 150) / 2}px);
		`;

		// Clone source content
		if (sourceElement instanceof HTMLVideoElement || sourceElement instanceof HTMLImageElement) {
			const cloned = sourceElement.cloneNode() as HTMLElement;
			cloned.style.width = `${rect.width * zoom}px`;
			cloned.style.height = `${rect.height * zoom}px`;
			container.appendChild(cloned);
		} else {
			// สำหรับ element อื่นๆ ใช้ html2canvas หรือ screenshot
			container.style.background = "rgba(0,0,0,0.8)";
			container.style.display = "flex";
			container.style.alignItems = "center";
			container.style.justifyContent = "center";
			container.style.color = "white";
			container.textContent = "🔍";
		}

		magnifierElement.appendChild(container);
	};

	const start = () => {
		if (!magnifierElement) {
			createMagnifier();
		}
		if (!magnifierElement || !sourceElement) return;

		state.isActive = true;
		magnifierElement.style.display = "block";

		mouseMoveHandler = updatePosition;
		sourceElement.addEventListener("mousemove", mouseMoveHandler);
	};

	const stop = () => {
		state.isActive = false;
		if (magnifierElement) {
			magnifierElement.style.display = "none";
		}
		if (mouseMoveHandler && sourceElement) {
			sourceElement.removeEventListener("mousemove", mouseMoveHandler);
			mouseMoveHandler = null;
		}
	};

	const setOptions = (newOptions: Partial<MagnifierOptions>) => {
		Object.assign(state.options, newOptions);
		if (magnifierElement) {
			updateMagnifierStyle(magnifierElement);
		}
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
		if (magnifierElement && magnifierElement.parentNode) {
			magnifierElement.parentNode.removeChild(magnifierElement);
			magnifierElement = null;
		}
	};

	onUnmounted(() => {
		dispose();
	});

	return {
		state: readonly(state),
		initialize,
		start,
		stop,
		toggle,
		setOptions,
		dispose,
	};
};
