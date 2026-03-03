import type * as fabric from "fabric";
import { computed, ref } from "vue";

export interface GridConfig {
	enabled: boolean;
	size: number;
	color: string;
	opacity: number;
	snapToGrid: boolean;
	showMajorLines: boolean;
	majorLineInterval: number;
	majorLineColor: string;
	majorLineOpacity: number;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
	enabled: true,
	size: 20,
	color: "#E0E0E0",
	opacity: 0.5,
	snapToGrid: true,
	showMajorLines: true,
	majorLineInterval: 5,
	majorLineColor: "#B0B0B0",
	majorLineOpacity: 0.7,
};

export function useGridSystem(canvas: Ref<fabric.Canvas | null>, config: Partial<GridConfig> = {}) {
	const settings = ref<GridConfig>({ ...DEFAULT_GRID_CONFIG, ...config });

	const gridEnabled = computed(() => settings.value.enabled);
	const snapEnabled = computed(() => settings.value.snapToGrid);

	const createGridPattern = () => {
		if (!canvas.value) return null;

		const gridCanvas = document.createElement("canvas");
		const ctx = gridCanvas.getContext("2d");
		if (!ctx) return null;

		const size = settings.value.size * settings.value.majorLineInterval;
		gridCanvas.width = size;
		gridCanvas.height = size;

		ctx.clearRect(0, 0, size, size);

		ctx.strokeStyle = settings.value.color;
		ctx.lineWidth = 1;
		ctx.globalAlpha = settings.value.opacity;

		for (let i = 0; i <= settings.value.majorLineInterval; i++) {
			const pos = i * settings.value.size;

			if (i === 0 || i === settings.value.majorLineInterval) {
				ctx.strokeStyle = settings.value.majorLineColor;
				ctx.globalAlpha = settings.value.majorLineOpacity;
				ctx.lineWidth = 1.5;
			} else if (settings.value.showMajorLines && i % settings.value.majorLineInterval === 0) {
				ctx.strokeStyle = settings.value.majorLineColor;
				ctx.globalAlpha = settings.value.majorLineOpacity;
				ctx.lineWidth = 1.5;
			} else {
				ctx.strokeStyle = settings.value.color;
				ctx.globalAlpha = settings.value.opacity;
				ctx.lineWidth = 1;
			}

			ctx.beginPath();
			ctx.moveTo(pos, 0);
			ctx.lineTo(pos, size);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0, pos);
			ctx.lineTo(size, pos);
			ctx.stroke();
		}

		const pattern = canvas.value.contextTop?.createPattern(gridCanvas, "repeat");
		return pattern;
	};

	const drawGrid = () => {
		if (!canvas.value || !settings.value.enabled) {
			if (canvas.value) {
				(canvas.value as any).backgroundColor = undefined;
				canvas.value.renderAll();
			}
			return;
		}

		const pattern = createGridPattern();
		if (pattern) {
			(canvas.value as any).backgroundColor = pattern;
			canvas.value.renderAll();
		}
	};

	const snapToGrid = (value: number): number => {
		if (!settings.value.snapToGrid) return value;

		const size = settings.value.size;
		return Math.round(value / size) * size;
	};

	const snapPointToGrid = (x: number, y: number): { x: number; y: number } => {
		return {
			x: snapToGrid(x),
			y: snapToGrid(y),
		};
	};

	const snapObjectToGrid = (obj: any) => {
		if (!settings.value.snapToGrid || !obj) return;

		obj.left = snapToGrid(obj.left);
		obj.top = snapToGrid(obj.top);
		obj.setCoords();
	};

	const updateConfig = (newConfig: Partial<GridConfig>) => {
		settings.value = { ...settings.value, ...newConfig };
		drawGrid();
	};

	const toggleGrid = () => {
		settings.value.enabled = !settings.value.enabled;
		drawGrid();
	};

	const toggleSnap = () => {
		settings.value.snapToGrid = !settings.value.snapToGrid;
	};

	const setGridSize = (size: number) => {
		settings.value.size = size;
		drawGrid();
	};

	const setGridColor = (color: string) => {
		settings.value.color = color;
		drawGrid();
	};

	const setGridOpacity = (opacity: number) => {
		settings.value.opacity = opacity;
		drawGrid();
	};

	return {
		gridEnabled,
		snapEnabled,
		settings,
		drawGrid,
		snapToGrid,
		snapPointToGrid,
		snapObjectToGrid,
		updateConfig,
		toggleGrid,
		toggleSnap,
		setGridSize,
		setGridColor,
		setGridOpacity,
	};
}
