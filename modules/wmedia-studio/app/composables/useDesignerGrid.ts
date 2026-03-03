import * as fabric from "fabric";
import { ref } from "vue";

export interface UseDesignerGridOptions {
	getCanvas: () => fabric.Canvas | null;
	artboard: { width: number; height: number };
}

export const useDesignerGrid = (options: UseDesignerGridOptions) => {
	const showGrid = ref(true);
	const gridSize = ref(20);
	const snapToGrid = ref(true);

	const guides = ref<{ horizontal: number[]; vertical: number[] }>({ horizontal: [], vertical: [] });
	const SNAP_TOLERANCE = 5;

	const drawGrid = () => {
		const c = options.getCanvas();
		if (!c || !showGrid.value) return;

		const gridLines: fabric.Line[] = [];
		const size = gridSize.value;

		for (let x = 0; x <= c.width; x += size) {
			gridLines.push(
				new fabric.Line([x, 0, x, c.height], {
					stroke: "#e5e7eb",
					strokeWidth: 1,
					selectable: false,
					evented: false,
				}),
			);
		}

		for (let y = 0; y <= c.height; y += size) {
			gridLines.push(
				new fabric.Line([0, y, c.width, y], {
					stroke: "#e5e7eb",
					strokeWidth: 1,
					selectable: false,
					evented: false,
				}),
			);
		}

		gridLines.forEach((line) => {
			(line as any).isGrid = true;
			c.add(line);
		});

		c.renderAll();
	};

	const clearGrid = () => {
		const c = options.getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		objects.forEach((obj) => {
			if ((obj as any).isGrid) {
				c.remove(obj);
			}
		});
		c.renderAll();
	};

	const snapToGridValue = (value: number): number => {
		if (!snapToGrid.value) return value;
		const size = gridSize.value;
		return Math.round(value / size) * size;
	};

	const addGuide = (orientation: "horizontal" | "vertical", position: number) => {
		const c = options.getCanvas();
		if (!c) return;

		if (orientation === "horizontal") {
			guides.value.horizontal.push(position);
			const line = new fabric.Line([0, position, c.width, position], {
				stroke: "#3b82f6",
				strokeWidth: 1,
				selectable: false,
				evented: false,
			});
			(line as any).isGuide = true;
			c.add(line);
		} else {
			guides.value.vertical.push(position);
			const line = new fabric.Line([position, 0, position, c.height], {
				stroke: "#3b82f6",
				strokeWidth: 1,
				selectable: false,
				evented: false,
			});
			(line as any).isGuide = true;
			c.add(line);
		}
		c.renderAll();
	};

	const removeGuide = (orientation: "horizontal" | "vertical", position: number) => {
		if (orientation === "horizontal") {
			guides.value.horizontal = guides.value.horizontal.filter((p) => p !== position);
		} else {
			guides.value.vertical = guides.value.vertical.filter((p) => p !== position);
		}
		clearGuides();
		guides.value.horizontal.forEach((p) => addGuide("horizontal", p));
		guides.value.vertical.forEach((p) => addGuide("vertical", p));
	};

	const clearGuides = () => {
		const c = options.getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		objects.forEach((obj) => {
			if ((obj as any).isGuide) {
				c.remove(obj);
			}
		});
		guides.value = { horizontal: [], vertical: [] };
		c.renderAll();
	};

	const snapToGuidesValue = (value: number, orientation: "horizontal" | "vertical"): number => {
		const guidePositions = orientation === "horizontal" ? guides.value.horizontal : guides.value.vertical;
		for (const guidePos of guidePositions) {
			if (Math.abs(value - guidePos) <= SNAP_TOLERANCE) {
				return guidePos;
			}
		}
		return value;
	};

	const toggleGrid = () => {
		showGrid.value = !showGrid.value;
		if (showGrid.value) {
			drawGrid();
		} else {
			clearGrid();
		}
	};

	return {
		showGrid,
		gridSize,
		snapToGrid,
		guides,
		drawGrid,
		clearGrid,
		toggleGrid,
		snapToGridValue,
		addGuide,
		removeGuide,
		clearGuides,
		snapToGuidesValue,
	};
};
