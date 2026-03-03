import * as fabric from "fabric";
import { nanoid } from "nanoid";
import type { DesignerSelectedObject } from "#shared/types/element";

export interface UseDesignerObjectActionsOptions {
	getCanvas: () => fabric.Canvas | null;
	onObjectModified?: () => void;
}

export const useDesignerObjectActions = (options: UseDesignerObjectActionsOptions) => {
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

	const updateSelectedFromCanvas = (selected: Ref<DesignerSelectedObject | null>) => {
		const c = options.getCanvas();
		if (!c) return;
		const obj = c.getActiveObject();
		selected.value = obj ? toSelected(obj as any) : null;
	};

	const deleteSelected = (pushHistory: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObjects = c.getActiveObjects();
		activeObjects.forEach((obj) => {
			c.remove(obj);
		});
		c.discardActiveObject();
		c.renderAll();
		pushHistory();
	};

	const duplicateSelected = (pushHistory: () => void) => {
		const c = options.getCanvas();
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

	const group = (pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
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

	const ungroup = (pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
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

	const alignObjects = (align: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
		const c = options.getCanvas();
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
		options.onObjectModified?.();
	};

	const updatePropertyMulti = (property: string, value: unknown, pushHistory: () => void) => {
		const c = options.getCanvas();
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
		options.onObjectModified?.();
		pushHistory();
	};

	const updateProperty = (property: string, value: unknown, pushHistory: () => void) => {
		updatePropertyMulti(property, value, pushHistory);
	};

	const cropImage = (clipPath: "rect" | "circle" | "none", pushHistory: () => void) => {
		const c = options.getCanvas();
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
		const c = options.getCanvas();
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

	const applyGlowEffect = (color: string, blur: number, pushHistory: () => void) => {
		const c = options.getCanvas();
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

	const booleanOperation = (operation: "union" | "intersect" | "subtract" | "xor", pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
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

	const animateObject = (animation: "fadeIn" | "fadeOut" | "slideIn" | "bounce", duration = 1000) => {
		const c = options.getCanvas();
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

	return {
		toSelected,
		updateSelectedFromCanvas,
		deleteSelected,
		duplicateSelected,
		group,
		ungroup,
		alignObjects,
		updateProperty,
		updatePropertyMulti,
		cropImage,
		toggleImageCropMode,
		applyGlowEffect,
		booleanOperation,
		animateObject,
	};
};
