import { onUnmounted, readonly, ref } from "vue";

const drawings = ref<DrawingStroke[]>([]);
const isDrawing = ref(false);
const currentStroke = ref<DrawingStroke | null>(null);
const strokeColor = ref("#ff0000");
const strokeWidth = ref(3);

export interface DrawingStroke {
	slideId: string;
	points: { x: number; y: number }[];
	color: string;
	width: number;
}

export function useDrawing() {
	function startStroke(slideId: string, x: number, y: number) {
		isDrawing.value = true;
		currentStroke.value = {
			slideId,
			points: [{ x, y }],
			color: strokeColor.value,
			width: strokeWidth.value,
		};
	}

	function addPoint(x: number, y: number) {
		if (!isDrawing.value || !currentStroke.value) return;
		currentStroke.value.points.push({ x, y });
	}

	function endStroke() {
		if (!isDrawing.value || !currentStroke.value) return;
		drawings.value.push(currentStroke.value);
		currentStroke.value = null;
		isDrawing.value = false;
	}

	function clearDrawings(slideId?: string) {
		if (slideId) {
			drawings.value = drawings.value.filter((d) => d.slideId !== slideId);
		} else {
			drawings.value = [];
		}
	}

	function setColor(color: string) {
		strokeColor.value = color;
	}

	function setWidth(width: number) {
		strokeWidth.value = width;
	}

	function getDrawingsForSlide(slideId: string) {
		return drawings.value.filter((d) => d.slideId === slideId);
	}

	onUnmounted(() => {
		drawings.value = [];
	});

	return {
		drawings: readonly(drawings),
		isDrawing: readonly(isDrawing),
		currentStroke: readonly(currentStroke),
		strokeColor: readonly(strokeColor),
		strokeWidth: readonly(strokeWidth),
		startStroke,
		addPoint,
		endStroke,
		clearDrawings,
		setColor,
		setWidth,
		getDrawingsForSlide,
	};
}
