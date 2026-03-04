export type AnnotationTool = "text" | "rectangle" | "circle" | "arrow" | "pen" | "highlight";

export interface AnnotationStyle {
	color: string;
	strokeWidth: number;
	fontSize?: number;
	opacity?: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface Annotation {
	id: string;
	type: AnnotationTool;
	points: Point[];
	text?: string;
	style: AnnotationStyle;
	timestamp: number;
}

export interface AnnotationsState {
	isDrawing: boolean;
	currentTool: AnnotationTool;
	currentStyle: AnnotationStyle;
	annotations: Annotation[];
	currentAnnotation: Annotation | null;
}

export const useAnnotations = () => {
	const canvasRef = ref<HTMLCanvasElement | null>(null);
	const ctx = computed(() => canvasRef.value?.getContext("2d"));

	const state = reactive<AnnotationsState>({
		isDrawing: false,
		currentTool: "pen",
		currentStyle: {
			color: "#ff0000",
			strokeWidth: 3,
			fontSize: 24,
			opacity: 1,
		},
		annotations: [],
		currentAnnotation: null,
	});

	const presetColors = [
		"#ff0000",
		"#00ff00",
		"#0000ff",
		"#ffff00",
		"#ff00ff",
		"#00ffff",
		"#ffffff",
		"#000000",
		"#ff9500",
		"#af52de",
	];

	const setTool = (tool: AnnotationTool): void => {
		state.currentTool = tool;
	};

	const setStyle = (style: Partial<AnnotationStyle>): void => {
		Object.assign(state.currentStyle, style);
	};

	const setColor = (color: string): void => {
		state.currentStyle.color = color;
	};

	const setStrokeWidth = (width: number): void => {
		state.currentStyle.strokeWidth = width;
	};

	const startAnnotation = (x: number, y: number): void => {
		if (!ctx.value) return;

		state.isDrawing = true;

		const annotation: Annotation = {
			id: crypto.randomUUID(),
			type: state.currentTool,
			points: [{ x, y }],
			style: { ...state.currentStyle },
			timestamp: Date.now(),
		};

		state.currentAnnotation = annotation;

		ctx.value.globalAlpha = state.currentStyle.opacity ?? 1;
		ctx.value.strokeStyle = state.currentStyle.color;
		ctx.value.lineWidth = state.currentStyle.strokeWidth;
		ctx.value.lineCap = "round";
		ctx.value.lineJoin = "round";

		if (state.currentTool === "pen" || state.currentTool === "highlight") {
			ctx.value.beginPath();
			ctx.value.moveTo(x, y);
		}
	};

	const continueAnnotation = (x: number, y: number): void => {
		if (!state.isDrawing || !ctx.value || !state.currentAnnotation) return;

		state.currentAnnotation.points.push({ x, y });

		switch (state.currentTool) {
			case "pen":
				ctx.value.lineTo(x, y);
				ctx.value.stroke();
				break;
			case "highlight":
				ctx.value.globalCompositeOperation = "multiply";
				ctx.value.lineTo(x, y);
				ctx.value.stroke();
				ctx.value.globalCompositeOperation = "source-over";
				break;
		}
	};

	const endAnnotation = (x?: number, y?: number): void => {
		if (!state.isDrawing || !ctx.value || !state.currentAnnotation) return;

		if (x !== undefined && y !== undefined) {
			state.currentAnnotation.points.push({ x, y });
		}

		const { points, type } = state.currentAnnotation;

		switch (type) {
			case "rectangle":
				if (points.length >= 2) {
					const start = points[0];
					const end = points[points.length - 1];
					const width = end.x - start.x;
					const height = end.y - start.y;
					ctx.value.strokeRect(start.x, start.y, width, height);
				}
				break;
			case "circle":
				if (points.length >= 2) {
					const start = points[0];
					const end = points[points.length - 1];
					const radius = Math.sqrt(
						Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
					);
					ctx.value.beginPath();
					ctx.value.arc(start.x, start.y, radius, 0, Math.PI * 2);
					ctx.value.stroke();
				}
				break;
			case "arrow":
				if (points.length >= 2) {
					const start = points[0];
					const end = points[points.length - 1];
					drawArrow(ctx.value, start, end);
				}
				break;
			case "text":
				if (points.length > 0) {
					const pos = points[0];
					ctx.value.font = `${state.currentStyle.fontSize ?? 24}px sans-serif`;
					ctx.value.fillStyle = state.currentStyle.color;
					ctx.value.fillText(state.currentAnnotation.text || "", pos.x, pos.y);
				}
				break;
		}

		state.annotations.push(state.currentAnnotation);
		state.currentAnnotation = null;
		state.isDrawing = false;
	};

	const drawArrow = (
		ctx: CanvasRenderingContext2D,
		start: Point,
		end: Point,
	): void => {
		const headLength = 15;
		const angle = Math.atan2(end.y - start.y, end.x - start.x);

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(end.x, end.y);
		ctx.lineTo(
			end.x - headLength * Math.cos(angle - Math.PI / 6),
			end.y - headLength * Math.sin(angle - Math.PI / 6),
		);
		ctx.lineTo(
			end.x - headLength * Math.cos(angle + Math.PI / 6),
			end.y - headLength * Math.sin(angle + Math.PI / 6),
		);
		ctx.lineTo(end.x, end.y);
		ctx.fillStyle = state.currentStyle.color;
		ctx.fill();
	};

	const addTextAnnotation = (x: number, y: number, text: string): void => {
		const annotation: Annotation = {
			id: crypto.randomUUID(),
			type: "text",
			points: [{ x, y }],
			text,
			style: { ...state.currentStyle },
			timestamp: Date.now(),
		};

		state.annotations.push(annotation);

		if (ctx.value) {
			ctx.value.font = `${state.currentStyle.fontSize ?? 24}px sans-serif`;
			ctx.value.fillStyle = state.currentStyle.color;
			ctx.value.fillText(text, x, y);
		}
	};

	const undo = (): void => {
		if (state.annotations.length === 0) return;

		state.annotations.pop();
		redrawAll();
	};

	const clear = (): void => {
		state.annotations = [];
		if (ctx.value && canvasRef.value) {
			ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
		}
	};

	const redrawAll = (): void => {
		if (!ctx.value || !canvasRef.value) return;

		ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

		for (const annotation of state.annotations) {
			ctx.value.globalAlpha = annotation.style.opacity ?? 1;
			ctx.value.strokeStyle = annotation.style.color;
			ctx.value.lineWidth = annotation.style.strokeWidth;
			ctx.value.fillStyle = annotation.style.color;

			switch (annotation.type) {
				case "pen":
					ctx.value.beginPath();
					if (annotation.points.length > 0) {
						ctx.value.moveTo(annotation.points[0].x, annotation.points[0].y);
						for (let i = 1; i < annotation.points.length; i++) {
							ctx.value.lineTo(annotation.points[i].x, annotation.points[i].y);
						}
					}
					ctx.value.stroke();
					break;
				case "highlight":
					ctx.value.globalCompositeOperation = "multiply";
					ctx.value.beginPath();
					if (annotation.points.length > 0) {
						ctx.value.moveTo(annotation.points[0].x, annotation.points[0].y);
						for (let i = 1; i < annotation.points.length; i++) {
							ctx.value.lineTo(annotation.points[i].x, annotation.points[i].y);
						}
					}
					ctx.value.stroke();
					ctx.value.globalCompositeOperation = "source-over";
					break;
				case "rectangle":
					if (annotation.points.length >= 2) {
						const start = annotation.points[0];
						const end = annotation.points[annotation.points.length - 1];
						ctx.value.strokeRect(
							start.x,
							start.y,
							end.x - start.x,
							end.y - start.y,
						);
					}
					break;
				case "circle":
					if (annotation.points.length >= 2) {
						const start = annotation.points[0];
						const end = annotation.points[annotation.points.length - 1];
						const radius = Math.sqrt(
							Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
						);
						ctx.value.beginPath();
						ctx.value.arc(start.x, start.y, radius, 0, Math.PI * 2);
						ctx.value.stroke();
					}
					break;
				case "arrow":
					if (annotation.points.length >= 2) {
						drawArrow(ctx.value, annotation.points[0], annotation.points[annotation.points.length - 1]);
					}
					break;
				case "text":
					if (annotation.points.length > 0 && annotation.text) {
						ctx.value.font = `${annotation.style.fontSize ?? 24}px sans-serif`;
						ctx.value.fillText(
							annotation.text,
							annotation.points[0].x,
							annotation.points[0].y,
						);
					}
					break;
			}
		}

		ctx.value.globalAlpha = 1;
	};

	const exportAnnotations = (): Annotation[] => {
		return [...state.annotations];
	};

	const importAnnotations = (annotations: Annotation[]): void => {
		state.annotations = [...annotations];
		redrawAll();
	};

	const getAnnotationsAsImage = (): string | null => {
		if (!canvasRef.value) return null;
		return canvasRef.value.toDataURL("image/png");
	};

	return {
		canvasRef,
		ctx,
		state,
		presetColors,
		setTool,
		setStyle,
		setColor,
		setStrokeWidth,
		startAnnotation,
		continueAnnotation,
		endAnnotation,
		addTextAnnotation,
		undo,
		clear,
		redrawAll,
		exportAnnotations,
		importAnnotations,
		getAnnotationsAsImage,
	};
};
