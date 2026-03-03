import * as fabric from "fabric";
import { nanoid } from "nanoid";

export interface UseDesignerObjectCreationOptions {
	getCanvas: () => fabric.Canvas | null;
	onObjectCreated?: () => void;
}

export const useDesignerObjectCreation = (options: UseDesignerObjectCreationOptions) => {
	const addImage = async (url: string) => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const loadTemplate = async (objects: any[], loadFromJson: (json: string) => Promise<void>, pushHistory: () => void, rebuildLayers: () => void) => {
		const c = options.getCanvas();
		if (!c) return;

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

		rebuildLayers();
		pushHistory();
	};

	const addText = (text: string = "Text") => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const addRectangle = () => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const addCircle = () => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const addPolygon = (sides = 6) => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const addStar = (points = 5) => {
		const c = options.getCanvas();
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
		options.onObjectCreated?.();
	};

	const loadGoogleFont = (fontFamily: string) => {
		const link = document.createElement("link");
		link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	};

	return {
		addImage,
		loadTemplate,
		addText,
		addRectangle,
		addCircle,
		addPolygon,
		addStar,
		loadGoogleFont,
	};
};
