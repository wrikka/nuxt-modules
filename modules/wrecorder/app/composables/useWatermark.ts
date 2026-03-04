import { reactive, readonly, computed } from "vue";

export interface WatermarkOptions {
	text?: string;
	imageUrl?: string;
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom";
	x?: number;
	y?: number;
	fontSize?: number;
	fontFamily?: string;
	color?: string;
	opacity?: number;
	rotation?: number;
	scale?: number;
}

export interface WatermarkState {
	isVisible: boolean;
	options: WatermarkOptions;
}

export const useWatermark = (options: WatermarkOptions = {}) => {
	const defaultOptions: WatermarkOptions = {
		text: "Recorded with WRecorder",
		position: "bottom-right",
		fontSize: 20,
		fontFamily: "Arial",
		color: "#ffffff",
		opacity: 0.7,
		rotation: 0,
		scale: 1,
		x: 20,
		y: 20,
	};

	const mergedOptions = { ...defaultOptions, ...options };

	const state = reactive<WatermarkState>({
		isVisible: true,
		options: mergedOptions,
	});

	const setText = (text: string) => {
		state.options.text = text;
	};

	const setImage = (url: string) => {
		state.options.imageUrl = url;
		state.options.text = undefined;
	};

	const setPosition = (position: WatermarkOptions["position"]) => {
		state.options.position = position;
	};

	const setCustomPosition = (x: number, y: number) => {
		state.options.position = "custom";
		state.options.x = x;
		state.options.y = y;
	};

	const setStyle = (style: Partial<Omit<WatermarkOptions, "text" | "imageUrl" | "position" | "x" | "y">>) => {
		Object.assign(state.options, style);
	};

	const show = () => {
		state.isVisible = true;
	};

	const hide = () => {
		state.isVisible = false;
	};

	const drawOnCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		if (!state.isVisible) return;

		const { width, height } = canvas;
		const opt = state.options;

		ctx.save();
		ctx.globalAlpha = opt.opacity || 0.7;

		let x = opt.x || 20;
		let y = opt.y || 20;

		// คำนวณตำแหน่งตาม position
		switch (opt.position) {
			case "top-left":
				x = 20;
				y = 20;
				break;
			case "top-right":
				x = width - 20;
				y = 20;
				break;
			case "bottom-left":
				x = 20;
				y = height - 20;
				break;
			case "bottom-right":
				x = width - 20;
				y = height - 20;
				break;
			case "center":
				x = width / 2;
				y = height / 2;
				break;
		}

		ctx.translate(x, y);
		ctx.rotate(((opt.rotation || 0) * Math.PI) / 180);
		ctx.scale(opt.scale || 1, opt.scale || 1);

		if (opt.imageUrl) {
			const img = new Image();
			img.onload = () => {
				const imgWidth = 100;
				const imgHeight = (img.height / img.width) * imgWidth;
				
				let drawX = 0;
				let drawY = 0;
				
				if (opt.position === "top-right" || opt.position === "bottom-right") {
					drawX = -imgWidth;
				}
				if (opt.position === "bottom-left" || opt.position === "bottom-right") {
					drawY = -imgHeight;
				}
				if (opt.position === "center") {
					drawX = -imgWidth / 2;
					drawY = -imgHeight / 2;
				}
				
				ctx.drawImage(img, drawX, drawY, imgWidth, imgHeight);
				ctx.restore();
			};
			img.src = opt.imageUrl;
		} else if (opt.text) {
			ctx.font = `${opt.fontSize}px ${opt.fontFamily}`;
			ctx.fillStyle = opt.color || "#ffffff";
			ctx.textAlign = opt.position === "center" ? "center" : opt.position?.includes("right") ? "right" : "left";
			ctx.textBaseline = opt.position === "center" ? "middle" : opt.position?.includes("bottom") ? "bottom" : "top";

			let textX = 0;
			let textY = 0;

			if (opt.position === "top-right" || opt.position === "bottom-right") {
				textX = 0;
			}
			if (opt.position === "bottom-left" || opt.position === "bottom-right") {
				textY = 0;
			}

			ctx.fillText(opt.text, textX, textY);
			ctx.restore();
		}
	};

	return {
		state: readonly(state),
		options: computed(() => state.options),
		setText,
		setImage,
		setPosition,
		setCustomPosition,
		setStyle,
		show,
		hide,
		drawOnCanvas,
	};
};
