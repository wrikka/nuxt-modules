import type { DesignerSelectedObject } from "#shared/types/element";
import * as fabric from "fabric";
import { nanoid } from "nanoid";

export interface DesignerLayerItem {
	id: string;
	name: string;
	type: string;
	visible: boolean;
	locked: boolean;
}

export interface DesignerDocumentState {
	projectId: string;
	artboard: { width: number; height: number };
	backgroundColor: string;
	schemaVersion: number;
}

type DesignerPersistedDocument = {
	document: DesignerDocumentState;
	canvas: string;
	versions?: unknown;
};

const CURRENT_SCHEMA_VERSION = 1;
const MAX_HISTORY_SIZE = 50;
const HISTORY_DEBOUNCE_MS = 300;

const CANVAS_JSON_EXTRA_PROPS = ["dataId", "name", "visible", "locked", "commentText", "isComment", "isCropping"];
const AUTOSAVE_DEBOUNCE_MS = 1200;

export const useDesignerDocument = (projectId: string) => {
	const canvas = ref<fabric.Canvas | null>(null);
	const isInitialized = ref(false);
	const isDirty = ref(false);
	const lastSaveTime = ref<number | null>(null);

	const artboard = reactive({ width: 1200, height: 800 });
	const backgroundColor = ref("#ffffff");

	const showGrid = ref(true);
	const gridSize = ref(20);
	const snapToGrid = ref(true);

	const layers = ref<DesignerLayerItem[]>([]);
	const selected = ref<DesignerSelectedObject | null>(null);

	const history = ref<DesignerSnapshot[]>([]);
	const historyIndex = ref(-1);

	let isPenMode = ref(false);
	let currentPath: fabric.Polyline | null = null;
	let isEyedropperMode = ref(false);
	let eyedropperCallback: ((color: string) => void) | null = null;
	let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let autoSaveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let autoSaveIntervalTimer: ReturnType<typeof setInterval> | null = null;
	let isHistoryEnabled = true;
	const autoSaveEnabled = ref(true);
	const autoSaveIntervalMs = ref(30000);

	const storageKey = computed(() => `designer:${projectId}`);
	const serverDocumentUrl = computed(() => `/api/designer/projects/${projectId}/document`);

	const getCanvas = () => canvas.value ?? null;

	const fetchServerDocument = async (): Promise<DesignerPersistedDocument | null> => {
		try {
			const res = await $fetch<{ success: boolean; data: unknown }>(serverDocumentUrl.value, {
				method: "GET",
			});
			if (!res?.success) return null;
			return (res.data ?? null) as DesignerPersistedDocument | null;
		} catch {
			return null;
		}
	};

	const saveServerDocument = async (data: DesignerPersistedDocument): Promise<boolean> => {
		try {
			const res = await $fetch<{ success: boolean }>(serverDocumentUrl.value, {
				method: "PUT",
				body: data,
			});
			return res?.success === true;
		} catch {
			return false;
		}
	};

	const rebuildLayers = () => {
		const c = getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		const items = objects
			.map((obj) => {
				const id = String((obj as any).dataId || "");
				const type = String((obj as any).type || "object");
				const name = String((obj as any).name || type);
				const visible = (obj as any).visible !== false;
				const locked = (obj as any).locked === true;
				return { id, type, name, visible, locked };
			})
			.filter((x) => x.id);

		layers.value = items.reverse();
	};

	const toSelected = (obj: any): DesignerSelectedObject => {
		const w = typeof obj.getScaledWidth === "function" ? obj.getScaledWidth() : (obj.width ?? 0);
		const h = typeof obj.getScaledHeight === "function" ? obj.getScaledHeight() : (obj.height ?? 0);
		const fill = typeof obj.fill === "string" ? obj.fill : "#000000";
		const stroke = typeof obj.stroke === "string" ? obj.stroke : undefined;
		const strokeWidth = typeof obj.strokeWidth === "number" ? obj.strokeWidth : undefined;
		const rx = typeof obj.rx === "number" ? obj.rx : undefined;
		const ry = typeof obj.ry === "number" ? obj.ry : undefined;
		const shadow = typeof obj.shadow === "object" ? JSON.stringify(obj.shadow) : undefined;
		return {
			id: String(obj.dataId),
			objectType: String(obj.type || "object"),
			left: Number(obj.left ?? 0),
			top: Number(obj.top ?? 0),
			width: Number(w ?? 0),
			height: Number(h ?? 0),
			angle: Number(obj.angle ?? 0),
			opacity: Number(obj.opacity ?? 1),
			hasFill: typeof obj.fill === "string",
			fill,
			hasStroke: typeof obj.stroke === "string" && obj.stroke !== "",
			stroke,
			strokeWidth,
			rx,
			ry,
			text: typeof obj.text === "string" ? obj.text : undefined,
			fontSize: typeof obj.fontSize === "number" ? obj.fontSize : undefined,
			fontFamily: typeof obj.fontFamily === "string" ? obj.fontFamily : undefined,
			fontWeight: typeof obj.fontWeight === "string" ? obj.fontWeight : undefined,
			lineHeight: typeof obj.lineHeight === "number" ? obj.lineHeight : undefined,
			letterSpacing: typeof obj.charSpacing === "number" ? obj.charSpacing : undefined,
			fillType: obj.fill?.type === "linear" || obj.fill?.type === "radial" ? "gradient" : "solid",
			gradientType: obj.fill?.type === "linear" ? "linear" : obj.fill?.type === "radial" ? "radial" : undefined,
			gradientColors: obj.fill?.colorStops?.map((s: any) => s.color) || ["#3b82f6", "#8b5cf6"],
			shadow,
			visible: (obj as any).visible !== false,
			locked: (obj as any).locked === true,
		};
	};

	const updateSelectedFromCanvas = () => {
		const c = getCanvas();
		if (!c) return;
		const obj = c.getActiveObject();
		selected.value = obj ? toSelected(obj as any) : null;
	};

	const pushHistory = () => {
		if (!isHistoryEnabled) return;

		if (historyDebounceTimer) {
			clearTimeout(historyDebounceTimer);
		}

		historyDebounceTimer = setTimeout(() => {
			const c = getCanvas();
			if (!c) return;

			const json = JSON.stringify((c as any).toJSON(CANVAS_JSON_EXTRA_PROPS));
			const snapshot: DesignerSnapshot = {
				version: historyIndex.value + 1,
				schemaVersion: CURRENT_SCHEMA_VERSION,
				timestamp: Date.now(),
				json,
			};

			history.value = history.value.slice(0, historyIndex.value + 1);
			history.value.push(snapshot);
			historyIndex.value = history.value.length - 1;

			if (history.value.length > MAX_HISTORY_SIZE) {
				const removed = history.value.shift();
				if (removed) {
					historyIndex.value--;
				}
			}

			isDirty.value = true;
			scheduleAutoSave();
		}, HISTORY_DEBOUNCE_MS);
	};

	const scheduleAutoSave = () => {
		if (!autoSaveEnabled.value) return;
		if (!isDirty.value) return;
		if (autoSaveDebounceTimer) {
			clearTimeout(autoSaveDebounceTimer);
		}
		autoSaveDebounceTimer = setTimeout(() => {
			void save().catch(() => {
				// Silent fail - error handled by saveServerDocument
			});
		}, AUTOSAVE_DEBOUNCE_MS);
	};

	const startAutoSaveInterval = () => {
		stopAutoSaveInterval();
		if (!autoSaveEnabled.value) return;
		autoSaveIntervalTimer = setInterval(() => {
			if (!isDirty.value) return;
			void save().catch(() => {
				// Silent fail - error handled by saveServerDocument
			});
		}, autoSaveIntervalMs.value);
	};

	const stopAutoSaveInterval = () => {
		if (autoSaveIntervalTimer) {
			clearInterval(autoSaveIntervalTimer);
			autoSaveIntervalTimer = null;
		}
	};

	const loadFromJson = async (json: string) => {
		const c = getCanvas();
		if (!c) return;

		isHistoryEnabled = false;

		await new Promise<void>((resolve, reject) => {
			try {
				void c.loadFromJSON(json, () => {
					c.renderAll();
					resolve();
				});
			} catch (err) {
				reject(err);
			}
		});

		isHistoryEnabled = true;

		rebuildLayers();
		updateSelectedFromCanvas();
	};

	const undo = async () => {
		if (historyIndex.value <= 0) return;
		historyIndex.value--;
		const snapshot = history.value[historyIndex.value];
		if (!snapshot) return;
		await loadFromJson(snapshot.json);
		isDirty.value = true;
	};

	const redo = async () => {
		if (historyIndex.value >= history.value.length - 1) return;
		historyIndex.value++;
		const snapshot = history.value[historyIndex.value];
		if (!snapshot) return;
		await loadFromJson(snapshot.json);
		isDirty.value = true;
	};

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const save = async () => {
		const c = getCanvas();
		if (!c) return;

		const json = JSON.stringify((c as any).toJSON(CANVAS_JSON_EXTRA_PROPS));
		const documentState: DesignerDocumentState = {
			projectId,
			artboard: { width: artboard.width, height: artboard.height },
			backgroundColor: backgroundColor.value,
			schemaVersion: CURRENT_SCHEMA_VERSION,
		};

		const data = {
			document: documentState,
			canvas: json,
			versions: versions.value,
		};

		const persisted: DesignerPersistedDocument = data;
		const ok = await saveServerDocument(persisted);
		try {
			localStorage.setItem(storageKey.value, JSON.stringify(data));
		} catch {
			// ignore
		}
		if (ok) {
			isDirty.value = false;
			lastSaveTime.value = Date.now();
		}
	};

	const load = async () => {
		const serverData = await fetchServerDocument();
		const saved = (() => {
			try {
				return localStorage.getItem(storageKey.value);
			} catch {
				return null;
			}
		})();

		const data = serverData ?? (saved ? (JSON.parse(saved) as any) : null);
		if (!data) return;

		try {
			if (data.document) {
				artboard.width = data.document.artboard.width;
				artboard.height = data.document.artboard.height;
				backgroundColor.value = data.document.backgroundColor || "#ffffff";

				if (data.document.schemaVersion && data.document.schemaVersion < CURRENT_SCHEMA_VERSION) {
					await migrateDocument(data);
				}
			}

			if (Array.isArray(data.versions)) {
				versions.value = data.versions;
			}

			if (data.canvas) {
				await loadFromJson(data.canvas);
				try {
					localStorage.setItem(storageKey.value, JSON.stringify(data));
				} catch {
					// ignore
				}
			} else {
				pushHistory();
			}
		} catch {
			// Silent fail - document will start fresh
			pushHistory();
		}
	};

	const migrateDocument = async (data: any) => {
		const version = data.document?.schemaVersion || 0;

		if (version < 1) {
			if (data.canvas) {
				try {
					const canvasData = JSON.parse(data.canvas);
					if (canvasData.objects) {
						canvasData.objects.forEach((obj: any) => {
							if (!obj.visible) obj.visible = true;
							if (obj.locked === undefined) obj.locked = false;
						});
						data.canvas = JSON.stringify(canvasData);
					}
				} catch {
					// Silent fail - migration will be retried on next load
				}
			}
		}

		data.document.schemaVersion = CURRENT_SCHEMA_VERSION;
	};

	const exportPng = (options?: {
		multiplier?: number;
		includeBackground?: boolean;
		selectionOnly?: boolean;
	}) => {
		const c = getCanvas();
		if (!c) return;

		const exportCanvas = options?.selectionOnly ? c.getActiveObject() : c;
		if (!exportCanvas) return;

		const dataUrl = (exportCanvas as any).toDataURL({
			format: "png",
			multiplier: options?.multiplier || 2,
		});

		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `designer-${projectId}.png`;
		a.click();
	};

	const exportSvg = () => {
		const c = getCanvas();
		if (!c) return;

		const svg = c.toSVG();
		const blob = new Blob([svg], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `designer-${projectId}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportJson = () => {
		const c = getCanvas();
		if (!c) return;

		const json = JSON.stringify(c.toJSON(), null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `designer-${projectId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const addImage = async (url: string) => {
		const c = getCanvas();
		if (!c) return;

		const img = await new Promise<fabric.Image>((resolve, reject) => {
			fabric.Image.fromURL(url, { crossOrigin: "anonymous" })
				.then((obj) => {
					obj.set({ left: 120, top: 120 });
					resolve(obj);
				})
				.catch(reject);
		});

		(img as any).dataId = nanoid();
		(img as any).name = "Image";
		(img as any).visible = true;
		(img as any).locked = false;
		c.add(img);
		c.setActiveObject(img);
		c.renderAll();
	};

	const loadTemplate = async (objects: any[]) => {
		const c = getCanvas();
		if (!c) return;

		isHistoryEnabled = false;

		await new Promise<void>((resolve, reject) => {
			try {
				void c.loadFromJSON({ objects }, () => {
					c.renderAll();
					resolve();
				});
			} catch (err) {
				reject(err);
			}
		});

		isHistoryEnabled = true;

		rebuildLayers();
		updateSelectedFromCanvas();
		pushHistory();
	};

	const addText = (text: string = "Text") => {
		const c = getCanvas();
		if (!c) return;

		const obj = new fabric.Textbox(text, {
			left: 120,
			top: 120,
			fontFamily: "Inter",
			fontSize: 32,
			fill: "#111827",
			editable: true,
		});
		(obj as any).dataId = nanoid();
		(obj as any).name = "Text";
		(obj as any).visible = true;
		(obj as any).locked = false;
		c.add(obj);
		c.setActiveObject(obj);
		c.renderAll();
	};

	const addRectangle = () => {
		const c = getCanvas();
		if (!c) return;

		const obj = new fabric.Rect({
			left: 120,
			top: 120,
			width: 240,
			height: 140,
			fill: "#3b82f6",
			rx: 12,
			ry: 12,
			strokeWidth: 0,
		});
		(obj as any).dataId = nanoid();
		(obj as any).name = "Rectangle";
		(obj as any).visible = true;
		(obj as any).locked = false;
		c.add(obj);
		c.setActiveObject(obj);
		c.renderAll();
	};

	const addCircle = () => {
		const c = getCanvas();
		if (!c) return;

		const obj = new fabric.Circle({
			left: 120,
			top: 120,
			radius: 80,
			fill: "#22c55e",
			strokeWidth: 0,
		});
		(obj as any).dataId = nanoid();
		(obj as any).name = "Circle";
		(obj as any).visible = true;
		(obj as any).locked = false;
		c.add(obj);
		c.setActiveObject(obj);
		c.renderAll();
	};

	const addPolygon = (sides = 6) => {
		const c = getCanvas();
		if (!c) return;

		const radius = 80;
		const points = [];
		for (let i = 0; i < sides; i++) {
			const angle = (i * 2 * Math.PI) / sides;
			points.push({
				x: radius + radius * Math.cos(angle),
				y: radius + radius * Math.sin(angle),
			});
		}

		const obj = new fabric.Polygon(points, {
			left: 120,
			top: 120,
			fill: "#f59e0b",
			strokeWidth: 0,
		});
		(obj as any).dataId = nanoid();
		(obj as any).name = "Polygon";
		(obj as any).visible = true;
		(obj as any).locked = false;
		c.add(obj);
		c.setActiveObject(obj);
		c.renderAll();
	};

	const addStar = (points = 5) => {
		const c = getCanvas();
		if (!c) return;

		const outerRadius = 80;
		const innerRadius = 40;
		const starPoints = [];
		for (let i = 0; i < points * 2; i++) {
			const angle = (i * Math.PI) / points - Math.PI / 2;
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			starPoints.push({
				x: outerRadius + radius * Math.cos(angle),
				y: outerRadius + radius * Math.sin(angle),
			});
		}

		const obj = new fabric.Polygon(starPoints, {
			left: 120,
			top: 120,
			fill: "#ec4899",
			strokeWidth: 0,
		});
		(obj as any).dataId = nanoid();
		(obj as any).name = "Star";
		(obj as any).visible = true;
		(obj as any).locked = false;
		c.add(obj);
		c.setActiveObject(obj);
		c.renderAll();
	};

	const updatePropertyMulti = (property: string, value: unknown) => {
		const c = getCanvas();
		if (!c) return;
		const activeObjects = c.getActiveObjects();
		if (activeObjects.length === 0) return;

		activeObjects.forEach((obj: any) => {
			if (property === "width" || property === "height") {
				const w = property === "width" ? Number(value) : Number(obj.getScaledWidth?.() ?? obj.width ?? 0);
				const h = property === "height" ? Number(value) : Number(obj.getScaledHeight?.() ?? obj.height ?? 0);
				if (
					typeof obj.set === "function" && typeof obj.scaleToWidth === "function"
					&& typeof obj.scaleToHeight === "function"
				) {
					obj.scaleToWidth(w);
					obj.scaleToHeight(h);
				} else {
					obj.set({ width: w, height: h });
				}
			} else if (property === "letterSpacing") {
				obj.set({ charSpacing: value });
			} else if (property === "fillType") {
				if (value === "gradient") {
					const colors = obj.gradientColors || ["#3b82f6", "#8b5cf6"];
					const gradient = new fabric.Gradient({
						type: "linear",
						gradientUnits: "percentage",
						coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
						colorStops: [
							{ offset: 0, color: colors[0] },
							{ offset: 1, color: colors[1] },
						],
					});
					obj.set({ fill: gradient });
				} else {
					obj.set({ fill: obj.fill?.colorStops?.[0]?.color || "#3b82f6" });
				}
			} else if (property === "gradientType") {
				const colors = obj.gradientColors || ["#3b82f6", "#8b5cf6"];
				const isRadial = value === "radial";
				const gradient = new fabric.Gradient({
					type: isRadial ? "radial" : "linear",
					gradientUnits: "percentage",
					coords: isRadial
						? { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 0.5 }
						: { x1: 0, y1: 0, x2: 1, y2: 0 },
					colorStops: [
						{ offset: 0, color: colors[0] },
						{ offset: 1, color: colors[1] },
					],
				});
				obj.set({ fill: gradient });
			} else if (property === "gradientColors") {
				const colors = value as string[];
				const currentFill = obj.fill;
				const isRadial = currentFill?.type === "radial";
				const gradient = new fabric.Gradient({
					type: isRadial ? "radial" : "linear",
					gradientUnits: "percentage",
					coords: isRadial
						? { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 0.5 }
						: { x1: 0, y1: 0, x2: 1, y2: 0 },
					colorStops: [
						{ offset: 0, color: colors[0] || "#3b82f6" },
						{ offset: 1, color: colors[1] || "#8b5cf6" },
					],
				});
				obj.set({ fill: gradient });
			} else {
				obj.set({ [property]: value });
			}
			obj.setCoords?.();
		});

		c.renderAll();
		updateSelectedFromCanvas();
	};

	const updateProperty = (property: string, value: unknown) => {
		updatePropertyMulti(property, value);
	};

	const alignObjects = (align: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
		const c = getCanvas();
		if (!c) return;
		const activeObjects = c.getActiveObjects();
		if (activeObjects.length < 2) return;

		const bounds = c.getActiveObject()?.getBoundingRect();
		if (!bounds) return;

		activeObjects.forEach((obj: any) => {
			const objBounds = obj.getBoundingRect();

			switch (align) {
				case "left":
					obj.set({ left: bounds.left });
					break;
				case "center":
					obj.set({ left: bounds.left + (bounds.width - objBounds.width) / 2 });
					break;
				case "right":
					obj.set({ left: bounds.left + bounds.width - objBounds.width });
					break;
				case "top":
					obj.set({ top: bounds.top });
					break;
				case "middle":
					obj.set({ top: bounds.top + (bounds.height - objBounds.height) / 2 });
					break;
				case "bottom":
					obj.set({ top: bounds.top + bounds.height - objBounds.height });
					break;
			}
			obj.setCoords?.();
		});

		c.renderAll();
		updateSelectedFromCanvas();
	};

	const drawGrid = () => {
		const c = getCanvas();
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

	const _snapToGridValue = (value: number): number => {
		if (!snapToGrid.value) return value;
		const size = gridSize.value;
		return Math.round(value / size) * size;
	};

	const guides = ref<{ horizontal: number[]; vertical: number[] }>({ horizontal: [], vertical: [] });
	const SNAP_TOLERANCE = 5;

	const addGuide = (orientation: "horizontal" | "vertical", position: number) => {
		const c = getCanvas();
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

	const clearGuides = () => {
		const c = getCanvas();
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

	const zoom = (factor: number) => {
		const c = getCanvas();
		if (!c) return;
		const newZoom = c.getZoom() * factor;
		c.setZoom(newZoom);
		c.renderAll();
	};

	const setZoom = (zoomLevel: number) => {
		const c = getCanvas();
		if (!c) return;
		c.setZoom(zoomLevel);
		c.renderAll();
	};

	const zoomIn = () => zoom(1.1);
	const zoomOut = () => zoom(0.9);
	const resetZoom = () => setZoom(1);

	const fitToViewport = (viewportWidth: number, viewportHeight: number, padding: number = 32) => {
		const c = getCanvas();
		if (!c) return;
		if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight)) return;
		if (viewportWidth <= 0 || viewportHeight <= 0) return;

		const availableWidth = Math.max(0, viewportWidth - padding * 2);
		const availableHeight = Math.max(0, viewportHeight - padding * 2);
		if (availableWidth <= 0 || availableHeight <= 0) return;

		const artW = Math.max(1, artboard.width);
		const artH = Math.max(1, artboard.height);

		const targetZoom = Math.min(availableWidth / artW, availableHeight / artH);
		const clampedZoom = Math.max(0.05, Math.min(6, targetZoom));

		c.setZoom(clampedZoom);

		const canvasW = c.getWidth();
		const canvasH = c.getHeight();
		const contentW = artW * clampedZoom;
		const contentH = artH * clampedZoom;
		const left = (canvasW - contentW) / 2;
		const top = (canvasH - contentH) / 2;

		c.viewportTransform = [clampedZoom, 0, 0, clampedZoom, left, top];
		c.renderAll();
	};

	const zoomLevel = computed(() => {
		const c = getCanvas();
		return c ? c.getZoom() : 1;
	});

	const handleWheel = (e: WheelEvent) => {
		const c = getCanvas();
		if (!c) return;

		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			zoom(delta);
		}
	};

	let isPanning = false;
	let lastPanX = 0;
	let lastPanY = 0;

	const handleMouseDown = (e: MouseEvent) => {
		if (isEyedropperMode.value) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			const ctx = c.getContext();
			if (ctx) {
				const pixel = ctx.getImageData(pointer.x, pointer.y, 1, 1).data;
				const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
				if (eyedropperCallback) {
					eyedropperCallback(color);
				}
			}
			isEyedropperMode.value = false;
			c.defaultCursor = "default";
			return;
		}
		if (isPenMode.value) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			const points = [pointer.x, pointer.y, pointer.x, pointer.y];
			currentPath = new fabric.Polyline(points, {
				stroke: "#000000",
				strokeWidth: 2,
				fill: undefined,
				selectable: false,
				evented: false,
			});
			c.add(currentPath);
			return;
		}

		if (e.buttons === 4 || (e.buttons === 1 && e.altKey)) {
			isPanning = true;
			lastPanX = e.clientX;
			lastPanY = e.clientY;
			e.preventDefault();
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isPenMode.value && currentPath) {
			const c = getCanvas();
			if (!c) return;
			const pointer = (c as any).getPointer(e);
			currentPath.points.push(new fabric.Point(pointer.x, pointer.y));
			c.renderAll();
			return;
		}

		if (!isPanning) return;
		const c = getCanvas();
		if (!c) return;

		const deltaX = e.clientX - lastPanX;
		const deltaY = e.clientY - lastPanY;

		const viewportTransform = c.viewportTransform;
		if (viewportTransform) {
			viewportTransform[4] += deltaX;
			viewportTransform[5] += deltaY;
			c.renderAll();
		}

		lastPanX = e.clientX;
		lastPanY = e.clientY;
	};

	const handleMouseUp = () => {
		if (isPenMode.value && currentPath) {
			const c = getCanvas();
			if (c) {
				(currentPath as any).dataId = nanoid();
				(currentPath as any).name = "Path";
				(currentPath as any).visible = true;
				(currentPath as any).locked = false;
				currentPath.set({
					selectable: true,
					evented: true,
				});
				c.setActiveObject(currentPath);
				c.renderAll();
				pushHistory();
				c.selection = true;
				c.defaultCursor = "default";
			}
			currentPath = null;
			isPenMode.value = false;
			return;
		}

		isPanning = false;
	};

	const selectLayer = (id: string) => {
		const c = getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;
		c.setActiveObject(obj);
		c.renderAll();
		updateSelectedFromCanvas();
	};

	const toggleLayerVisible = (id: string) => {
		const c = getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;

		(obj as any).visible = !(obj as any).visible;
		if (!(obj as any).visible) {
			c.discardActiveObject();
		}
		c.renderAll();
		rebuildLayers();
	};

	const toggleLayerLocked = (id: string) => {
		const c = getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;

		(obj as any).locked = !(obj as any).locked;
		obj.selectable = !(obj as any).locked;
		obj.evented = !(obj as any).locked;
		c.renderAll();
		rebuildLayers();
	};

	const renameLayer = (id: string, newName: string) => {
		const c = getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;

		(obj as any).name = newName;
		c.renderAll();
		rebuildLayers();
	};

	const bringForward = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).bringForward(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const sendBackward = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).sendBackwards(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const bringToFront = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).bringToFront(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const sendToBack = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).sendToBack(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const deleteSelected = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObjects = c.getActiveObjects();
		activeObjects.forEach((obj) => {
			c.remove(obj);
		});
		c.discardActiveObject();
		c.renderAll();
		pushHistory();
	};

	const duplicateSelected = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObjects = c.getActiveObjects();
		activeObjects.forEach((obj: any) => {
			obj.clone().then((cloned: any) => {
				cloned.set({
					left: (cloned.left ?? 0) + 20,
					top: (cloned.top ?? 0) + 20,
				});
				cloned.dataId = nanoid();
				cloned.name = obj.name || obj.type || "Object";
				cloned.visible = true;
				cloned.locked = false;
				c.add(cloned);
				c.setActiveObject(cloned);
				c.renderAll();
				pushHistory();
			});
		});
	};

	const group = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObjects = c.getActiveObjects();
		if (activeObjects.length < 2) return;

		const group = new fabric.Group(activeObjects, {
			...{
				dataId: nanoid(),
				name: "Group",
				visible: true,
				locked: false,
			} as any,
		});

		activeObjects.forEach((obj) => c.remove(obj));
		c.add(group);
		c.setActiveObject(group);
		c.renderAll();
		pushHistory();
		rebuildLayers();
	};

	const ungroup = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject || activeObject.type !== "group") return;

		const group = activeObject as fabric.Group;
		const objects = group.getObjects();

		(group as any).destroy();
		c.remove(group);

		objects.forEach((obj) => {
			c.add(obj);
		});

		if (objects[0]) {
			c.setActiveObject(objects[0]);
		}
		c.renderAll();
		pushHistory();
		rebuildLayers();
	};

	const setupCanvasEvents = () => {
		const c = getCanvas();
		if (!c) return;

		c.on("selection:created", () => {
			updateSelectedFromCanvas();
		});
		c.on("selection:updated", () => {
			updateSelectedFromCanvas();
		});
		c.on("selection:cleared", () => {
			selected.value = null;
		});

		c.on("object:modified", () => {
			rebuildLayers();
			updateSelectedFromCanvas();
			pushHistory();
		});
		c.on("object:added", () => {
			rebuildLayers();
			pushHistory();
		});
		c.on("object:removed", () => {
			rebuildLayers();
			pushHistory();
		});
	};

	const init = async (canvasInstance: fabric.Canvas, width: number, height: number) => {
		canvas.value = canvasInstance;
		artboard.width = width;
		artboard.height = height;

		setupCanvasEvents();
		await load();
		drawGrid();
		startAutoSaveInterval();

		isInitialized.value = true;
	};

	const enterPenMode = () => {
		const c = getCanvas();
		if (!c) return;
		isPenMode.value = true;
		c.selection = false;
		c.defaultCursor = "crosshair";
		c.discardActiveObject();
		c.renderAll();
	};

	const dispose = () => {
		if (historyDebounceTimer) {
			clearTimeout(historyDebounceTimer);
		}
		if (autoSaveDebounceTimer) {
			clearTimeout(autoSaveDebounceTimer);
		}
		stopAutoSaveInterval();
	};

	const cropImage = (clipPath: "rect" | "circle" | "none") => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject || activeObject.type !== "image") return;

		const img = activeObject as fabric.Image;
		if (clipPath === "none") {
			img.set({ clipPath: undefined });
		} else if (clipPath === "circle") {
			const clip = new fabric.Circle({
				radius: (img.width ?? 100) / 2,
				originX: "center",
				originY: "center",
			});
			img.set({ clipPath: clip });
		} else if (clipPath === "rect") {
			const clip = new fabric.Rect({
				width: img.width ?? 100,
				height: img.height ?? 100,
				originX: "center",
				originY: "center",
			});
			img.set({ clipPath: clip });
		}
		c.renderAll();
		pushHistory();
	};

	const toggleImageCropMode = () => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject || activeObject.type !== "image") return;

		const img = activeObject as fabric.Image;
		const isCropping = (img as any).isCropping;
		if (isCropping) {
			(img as any).isCropping = false;
			img.selectable = true;
			img.evented = true;
		} else {
			(img as any).isCropping = true;
			img.selectable = false;
			img.evented = false;
		}
		c.renderAll();
	};

	const applyGlowEffect = (color: string, blur: number) => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject) return;

		activeObject.set({
			shadow: {
				color: color,
				blur: blur,
				offsetX: 0,
				offsetY: 0,
			},
		});
		c.renderAll();
		pushHistory();
	};

	const activateEyedropper = (callback: (color: string) => void) => {
		const c = getCanvas();
		if (!c) return;
		isEyedropperMode.value = true;
		eyedropperCallback = callback;
		c.defaultCursor = "crosshair";
	};

	const booleanOperation = (operation: "union" | "intersect" | "subtract" | "xor") => {
		const c = getCanvas();
		if (!c) return;

		const activeObjects = c.getActiveObjects();
		if (activeObjects.length < 2) return;

		const target = activeObjects[0];
		const source = activeObjects[1];

		if (!target || !source) return;

		if (operation === "union") {
			const group = new fabric.Group(activeObjects, {
				...{ dataId: nanoid(), name: "Union", visible: true, locked: false } as any,
			});
			activeObjects.forEach((obj) => c.remove(obj));
			c.add(group);
			c.setActiveObject(group);
		} else if (operation === "intersect") {
			const clipPath = source!.clone();
			(clipPath as any).absolutePositioned = true;
			target!.set({ clipPath: clipPath as any });
			c.remove(source!);
			c.setActiveObject(target!);
		} else if (operation === "subtract") {
			const clipPath = source!.clone();
			(clipPath as any).absolutePositioned = true;
			(clipPath as any).inverted = true;
			target!.set({ clipPath: clipPath as any });
			c.remove(source!);
			c.setActiveObject(target!);
		}
		c.renderAll();
		pushHistory();
		rebuildLayers();
	};

	const versions = ref<{ id: string; name: string; timestamp: number; json: string }[]>([]);

	const saveVersion = (name: string) => {
		const c = getCanvas();
		if (!c) return;

		const json = JSON.stringify((c as any).toJSON(CANVAS_JSON_EXTRA_PROPS));
		versions.value.unshift({
			id: nanoid(),
			name: name || `Version ${versions.value.length + 1}`,
			timestamp: Date.now(),
			json,
		});
		isDirty.value = true;
		scheduleAutoSave();
	};

	const loadVersion = (versionId: string) => {
		const c = getCanvas();
		if (!c) return;

		const version = versions.value.find((v) => v.id === versionId);
		if (!version) return;

		c.clear();
		void c.loadFromJSON(version.json, () => {
			c.renderAll();
			rebuildLayers();
			pushHistory();
		});
	};

	const deleteVersion = (versionId: string) => {
		versions.value = versions.value.filter((v) => v.id !== versionId);
		isDirty.value = true;
		scheduleAutoSave();
	};

	const addComment = (x: number, y: number, text: string) => {
		const c = getCanvas();
		if (!c) return;

		const comment = new fabric.Circle({
			left: x,
			top: y,
			radius: 12,
			fill: "#fbbf24",
			stroke: "#f59e0b",
			strokeWidth: 2,
		});
		(comment as any).dataId = nanoid();
		(comment as any).name = "Comment";
		(comment as any).commentText = text;
		(comment as any).isComment = true;
		(comment as any).visible = true;
		(comment as any).locked = false;
		c.add(comment);
		c.renderAll();
		pushHistory();
		rebuildLayers();
	};

	const resolveComment = (commentId: string) => {
		const c = getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		const comment = objects.find((obj: any) => obj.dataId === commentId && obj.isComment);
		if (comment) {
			(comment as any).set({
				fill: "#10B981",
				stroke: "#059669",
				resolved: true,
			});
			c.renderAll();
			pushHistory();
		}
	};

	const deleteComment = (commentId: string) => {
		const c = getCanvas();
		if (!c) return;

		const objects = c.getObjects();
		const comment = objects.find((obj: any) => obj.dataId === commentId && obj.isComment);
		if (comment) {
			c.remove(comment);
			c.renderAll();
			pushHistory();
			rebuildLayers();
		}
	};

	const exportWebP = (options?: { multiplier?: number; selectionOnly?: boolean }) => {
		const c = getCanvas();
		if (!c) return;

		const dataUrl = c.toDataURL({
			format: "webp",
			quality: 0.9,
			multiplier: options?.multiplier ?? 1,
			...(options?.selectionOnly
				? {
					left: c.getActiveObject()?.getBoundingRect().left,
					top: c.getActiveObject()?.getBoundingRect().top,
					width: c.getActiveObject()?.getBoundingRect().width,
					height: c.getActiveObject()?.getBoundingRect().height,
				}
				: {}),
		});

		const link = document.createElement("a");
		link.download = `design-${Date.now()}.webp`;
		link.href = dataUrl;
		link.click();
	};

	const removeBackground = async (imageUrl: string): Promise<string> => {
		const response = await $fetch<{ success: boolean; url: string }>("/api/ai/remove-background", {
			method: "POST",
			body: { imageUrl },
		});
		if (!response.success) throw new Error("Failed to remove background");
		return response.url;
	};

	const generateImage = async (prompt: string): Promise<string> => {
		const response = await $fetch<{ success: boolean; url: string }>("/api/ai/generate-image", {
			method: "POST",
			body: { prompt },
		});
		if (!response.success) throw new Error("Failed to generate image");
		return response.url;
	};

	const animateObject = (animation: "fadeIn" | "fadeOut" | "slideIn" | "bounce", duration = 1000) => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject) return;

		const startTime = Date.now();
		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const ease = 1 - Math.pow(1 - progress, 3);

			if (animation === "fadeIn") {
				activeObject.set({ opacity: ease });
			} else if (animation === "fadeOut") {
				activeObject.set({ opacity: 1 - ease });
			} else if (animation === "slideIn") {
				activeObject.set({ left: (activeObject.left ?? 0) - (1 - ease) * 100 });
			} else if (animation === "bounce") {
				activeObject.set({ top: (activeObject.top ?? 0) - Math.sin(progress * Math.PI) * 50 });
			}
			c.renderAll();
			if (progress < 1) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	};

	const symbols = ref<{ id: string; name: string; json: any }[]>([]);

	const createSymbol = (name: string) => {
		const c = getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (!activeObject) return;

		symbols.value.push({
			id: nanoid(),
			name,
			json: (activeObject as any).toJSON(["dataId", "name", "visible", "locked"]),
		});
	};

	const insertSymbol = (symbolId: string) => {
		const c = getCanvas();
		if (!c) return;

		const symbol = symbols.value.find((s) => s.id === symbolId);
		if (!symbol) return;

		(fabric.util as any).enlivenObjects([symbol.json], (objects: fabric.Object[]) => {
			objects.forEach((obj) => {
				(obj as any).dataId = nanoid();
				c.add(obj);
			});
			c.renderAll();
			pushHistory();
			rebuildLayers();
		});
	};

	const loadGoogleFont = (fontFamily: string) => {
		const link = document.createElement("link");
		link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	};

	const exportCss = (): string => {
		const c = getCanvas();
		if (!c) return "";

		let css = "";
		c.getObjects().forEach((obj: any) => {
			css += `.${obj.name || "object"} {\n`;
			css += `  position: absolute;\n`;
			css += `  left: ${obj.left}px;\n`;
			css += `  top: ${obj.top}px;\n`;
			css += `  width: ${obj.getScaledWidth?.() || obj.width}px;\n`;
			css += `  height: ${obj.getScaledHeight?.() || obj.height}px;\n`;
			if (obj.fill) css += `  background: ${obj.fill};\n`;
			css += `}\n\n`;
		});
		return css;
	};

	return {
		canvas,
		isInitialized,
		isDirty,
		lastSaveTime,
		artboard,
		backgroundColor,
		showGrid,
		gridSize,
		snapToGrid,
		layers,
		selected,
		canUndo,
		canRedo,
		zoomLevel,

		undo,
		redo,
		save,
		exportPng,
		exportSvg,
		exportJson,

		addText,
		addRectangle,
		addCircle,
		addPolygon,
		addStar,
		addImage,
		enterPenMode,

		updateProperty,
		updatePropertyMulti,
		alignObjects,

		selectLayer,
		toggleLayerVisible,
		toggleLayerLocked,
		renameLayer,

		bringForward,
		sendBackward,
		bringToFront,
		sendToBack,

		deleteSelected,
		duplicateSelected,
		group,
		ungroup,
		cropImage,
		toggleImageCropMode,
		applyGlowEffect,
		activateEyedropper,
		booleanOperation,

		versions,
		saveVersion,
		loadVersion,
		deleteVersion,
		addComment,
		resolveComment,
		deleteComment,
		exportWebP,

		removeBackground,
		generateImage,
		animateObject,
		symbols,
		createSymbol,
		insertSymbol,
		loadGoogleFont,
		exportCss,

		drawGrid,
		guides,
		addGuide,
		clearGuides,
		snapToGuidesValue,

		zoom,
		setZoom,
		zoomIn,
		zoomOut,
		resetZoom,
		fitToViewport,
		handleWheel,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,

		init,
		dispose,
		loadTemplate,

		// Stub methods for designer properties panel (TODO: implement)
		addShape: (_shapeId: string) => {
			// TODO: Implement shape addition
		},
		applyTextStyle: (_style: { fontSize: number; fontWeight: string }) => {
			// TODO: Implement text style application
		},
		applyCrop: (_crop: { x: number; y: number; width: number; height: number }) => {
			// TODO: Implement crop application
		},
		rotateSelected: (_angle: number) => {
			// TODO: Implement rotation
		},
		flipSelected: (_direction: "horizontal" | "vertical") => {
			// TODO: Implement flip
		},
		distributeObjects: (_direction: "horizontal" | "vertical", _method: string) => {
			// TODO: Implement object distribution
		},
		setArtboardSize: (preset: { width: number; height: number }) => {
			artboard.width = preset.width;
			artboard.height = preset.height;
		},
		applyBackgroundPattern: (_pattern: string, _color: string) => {
			// TODO: Implement background pattern
		},
	};
};
