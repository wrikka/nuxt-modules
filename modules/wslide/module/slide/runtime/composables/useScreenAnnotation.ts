import { ref, computed } from "vue";

export interface Annotation {
	id: string;
	type: "draw" | "highlight" | "text" | "arrow" | "shape";
	points: { x: number; y: number }[];
	color: string;
	strokeWidth: number;
	text?: string;
	createdAt: Date;
	pageIndex?: number;
}

export interface ScreenAnnotation extends Annotation {
	screenPosition: { x: number; y: number; width: number; height: number };
}

export function useScreenAnnotation() {
	const annotations = ref<Annotation[]>([]);
	const isActive = ref(false);
	const currentTool = ref<Annotation["type"]>("draw");
	const currentColor = ref("#ff0000");
	const strokeWidth = ref(3);
	const isDrawing = ref(false);
	const currentAnnotation = ref<Partial<Annotation> | null>(null);

	const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000"];

	const canUndo = computed(() => annotations.value.length > 0);
	const annotationCount = computed(() => annotations.value.length);

	function activate() {
		isActive.value = true;
	}

	function deactivate() {
		isActive.value = false;
		cancelCurrent();
	}

	function setTool(tool: Annotation["type"]) {
		currentTool.value = tool;
	}

	function setColor(color: string) {
		currentColor.value = color;
	}

	function setStrokeWidth(width: number) {
		strokeWidth.value = width;
	}

	function startAnnotation(point: { x: number; y: number }, pageIndex?: number) {
		isDrawing.value = true;
		currentAnnotation.value = {
			type: currentTool.value,
			points: [point],
			color: currentColor.value,
			strokeWidth: strokeWidth.value,
			pageIndex,
		};
	}

	function addPoint(point: { x: number; y: number }) {
		if (!isDrawing.value || !currentAnnotation.value) return;
		currentAnnotation.value.points?.push(point);
	}

	function endAnnotation() {
		if (!isDrawing.value || !currentAnnotation.value?.points?.length) {
			cancelCurrent();
			return;
		}

		const annotation: Annotation = {
			id: `anno-${Date.now()}`,
			type: currentAnnotation.value.type || "draw",
			points: currentAnnotation.value.points || [],
			color: currentAnnotation.value.color || "#ff0000",
			strokeWidth: currentAnnotation.value.strokeWidth || 3,
			text: currentAnnotation.value.text,
			pageIndex: currentAnnotation.value.pageIndex,
			createdAt: new Date(),
		};

		annotations.value.push(annotation);
		cancelCurrent();
	}

	function cancelCurrent() {
		isDrawing.value = false;
		currentAnnotation.value = null;
	}

	function undo() {
		annotations.value.pop();
	}

	function clear() {
		annotations.value = [];
	}

	function deleteAnnotation(id: string) {
		const index = annotations.value.findIndex(a => a.id === id);
		if (index > -1) {
			annotations.value.splice(index, 1);
		}
	}

	function exportAnnotations(): string {
		return JSON.stringify(annotations.value, null, 2);
	}

	function importAnnotations(json: string): boolean {
		try {
			const parsed = JSON.parse(json);
			annotations.value = parsed.map((a: Annotation) => ({
				...a,
				createdAt: new Date(a.createdAt),
			}));
			return true;
		} catch {
			return false;
		}
	}

	function getAnnotationsForPage(pageIndex: number): Annotation[] {
		return annotations.value.filter(a => a.pageIndex === pageIndex);
	}

	return {
		annotations: readonly(annotations),
		isActive: readonly(isActive),
		isDrawing: readonly(isDrawing),
		currentAnnotation: readonly(currentAnnotation),
		currentTool: readonly(currentTool),
		currentColor: readonly(currentColor),
		strokeWidth: readonly(strokeWidth),
		colors,
		canUndo,
		annotationCount,
		activate,
		deactivate,
		setTool,
		setColor,
		setStrokeWidth,
		startAnnotation,
		addPoint,
		endAnnotation,
		cancelCurrent,
		undo,
		clear,
		deleteAnnotation,
		exportAnnotations,
		importAnnotations,
		getAnnotationsForPage,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
