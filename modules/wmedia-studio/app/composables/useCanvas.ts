import * as fabric from "fabric";

// Type definitions for fabric-history
declare module "fabric" {
	interface Canvas {
		history?: {
			undo(): void;
			redo(): void;
			clear(): void;
			dispose(): void;
		};
		undo(): void;
		redo(): void;
	}

	interface CanvasEvents {
		"history:save": void;
	}
}

// @ts-ignore - fabric-history doesn't have type definitions
const fabricHistory = require("fabric-history");

export const useCanvas = (canvasId: string) => {
	const canvas = ref<fabric.Canvas | null>(null);
	const isInitialized = ref(false);

	const initCanvas = (width: number, height: number) => {
		if (canvas.value) {
			void canvas.value.dispose();
		}

		canvas.value = new fabric.Canvas(canvasId, {
			width,
			height,
			backgroundColor: "#ffffff",
			preserveObjectStacking: true,
			selection: true,
		});

		fabricHistory(canvas.value);

		isInitialized.value = true;

		canvas.value.on("object:modified", () => {
			saveCanvasState();
		});

		canvas.value.on("object:added", () => {
			saveCanvasState();
		});

		canvas.value.on("object:removed", () => {
			saveCanvasState();
		});
	};

	const saveCanvasState = () => {
		if (canvas.value) {
			canvas.value.fire("history:save");
		}
	};

	const undo = () => {
		if (canvas.value) {
			canvas.value.undo();
		}
	};

	const redo = () => {
		if (canvas.value) {
			canvas.value.redo();
		}
	};

	const clearCanvas = () => {
		if (canvas.value) {
			canvas.value.clear();
			canvas.value.backgroundColor = "#ffffff";
			canvas.value.renderAll();
		}
	};

	const resizeCanvas = (width: number, height: number) => {
		if (canvas.value) {
			canvas.value.width = width;
			canvas.value.height = height;
			canvas.value.renderAll();
		}
	};

	const setBackgroundColor = (color: string) => {
		if (canvas.value) {
			canvas.value.backgroundColor = color;
			canvas.value.renderAll();
		}
	};

	const exportCanvas = async (format: "png" | "jpeg" | "pdf" | "svg", options?: {
		quality?: number;
		multiplier?: number;
	}) => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		if (format === "pdf" || format === "svg") {
			throw new Error(`${format} export is not supported yet`);
		}

		const dataURL = canvas.value.toDataURL({
			format: format as "png" | "jpeg",
			quality: options?.quality || 1,
			multiplier: options?.multiplier || 1,
		});

		return dataURL;
	};

	const getCanvasJSON = () => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		return canvas.value.toJSON();
	};

	const loadCanvasJSON = (json: string) => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		void canvas.value.loadFromJSON(json, canvas.value.renderAll.bind(canvas.value));
	};

	const addText = (text: string, options?: Partial<fabric.TextProps>) => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		const textObject = new fabric.Textbox(text, {
			left: 100,
			top: 100,
			fontFamily: "Inter",
			fontSize: 24,
			fill: "#000000",
			...options,
		});

		canvas.value.add(textObject);
		canvas.value.setActiveObject(textObject);
		canvas.value.renderAll();

		return textObject;
	};

	const addImage = (url: string, options?: Partial<fabric.ImageProps>) => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		return new Promise<fabric.Image>((resolve, reject) => {
			fabric.Image.fromURL(url, {
				crossOrigin: "anonymous",
			}).then((img: fabric.Image) => {
				if (!img) {
					reject(new Error("Failed to load image"));
					return;
				}

				img.set({
					left: 100,
					top: 100,
					...options,
				});

				canvas.value?.add(img);
				canvas.value?.setActiveObject(img);
				canvas.value?.renderAll();

				resolve(img);
			}).catch(reject);
		});
	};

	const addShape = (type: "rectangle" | "circle" | "triangle", options?: {
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
		width?: number;
		height?: number;
	}) => {
		if (!canvas.value) {
			throw new Error("Canvas not initialized");
		}

		let shape: fabric.Object;

		const defaultOptions = {
			fill: options?.fill || "#3b82f6",
			stroke: options?.stroke || "#000000",
			strokeWidth: options?.strokeWidth || 0,
			left: 100,
			top: 100,
		};

		switch (type) {
			case "rectangle":
				shape = new fabric.Rect({
					...defaultOptions,
					width: options?.width || 100,
					height: options?.height || 100,
				});
				break;
			case "circle":
				shape = new fabric.Circle({
					...defaultOptions,
					radius: options?.width ? options.width / 2 : 50,
				});
				break;
			case "triangle":
				shape = new fabric.Triangle({
					...defaultOptions,
					width: options?.width || 100,
					height: options?.height || 100,
				});
				break;
			default:
				throw new Error(`Unknown shape type: ${type as string}`);
		}

		canvas.value.add(shape);
		canvas.value.setActiveObject(shape);
		canvas.value.renderAll();

		return shape;
	};

	const deleteSelected = () => {
		if (!canvas.value) {
			return;
		}

		const activeObjects = canvas.value.getActiveObjects();
		activeObjects.forEach((obj: fabric.Object) => {
			canvas.value?.remove(obj);
		});
		canvas.value.discardActiveObject();
		canvas.value.renderAll();
	};

	const duplicateSelected = () => {
		if (!canvas.value) {
			return;
		}

		const activeObjects = canvas.value.getActiveObjects();
		activeObjects.forEach((obj: fabric.Object) => {
			void obj.clone().then((cloned: fabric.Object) => {
				cloned.set({
					left: cloned.left! + 20,
					top: cloned.top! + 20,
				});
				canvas.value?.add(cloned);
				canvas.value?.setActiveObject(cloned);
				canvas.value?.renderAll();
			});
		});
	};

	const bringToFront = () => {
		if (!canvas.value) {
			return;
		}

		const activeObject = canvas.value.getActiveObject();
		if (activeObject) {
			canvas.value.bringObjectToFront(activeObject);
			canvas.value.renderAll();
		}
	};

	const sendToBack = () => {
		if (!canvas.value) {
			return;
		}

		const activeObject = canvas.value.getActiveObject();
		if (activeObject) {
			canvas.value.sendObjectToBack(activeObject);
			canvas.value.renderAll();
		}
	};

	const zoom = (factor: number) => {
		if (!canvas.value) {
			return;
		}

		canvas.value.setZoom(canvas.value.getZoom() * factor);
		canvas.value.renderAll();
	};

	const setZoom = (zoomLevel: number) => {
		if (!canvas.value) {
			return;
		}

		canvas.value.setZoom(zoomLevel);
		canvas.value.renderAll();
	};

	return {
		canvas,
		isInitialized,
		initCanvas,
		saveCanvasState,
		undo,
		redo,
		clearCanvas,
		resizeCanvas,
		setBackgroundColor,
		exportCanvas,
		getCanvasJSON,
		loadCanvasJSON,
		addText,
		addImage,
		addShape,
		deleteSelected,
		duplicateSelected,
		bringToFront,
		sendToBack,
		zoom,
		setZoom,
	};
};
