import * as fabric from "fabric";
import { nanoid } from "nanoid";
import { ref } from "vue";

export interface DesignerLayerItem {
	id: string;
	name: string;
	type: string;
	visible: boolean;
	locked: boolean;
}

export interface UseDesignerLayersOptions {
	getCanvas: () => fabric.Canvas | null;
	onLayersChange?: () => void;
}

export const useDesignerLayers = (options: UseDesignerLayersOptions) => {
	const layers = ref<DesignerLayerItem[]>([]);

	const rebuildLayers = () => {
		const c = options.getCanvas();
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
		options.onLayersChange?.();
	};

	const selectLayer = (id: string) => {
		const c = options.getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;
		c.setActiveObject(obj);
		c.renderAll();
	};

	const toggleLayerVisible = (id: string) => {
		const c = options.getCanvas();
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
		const c = options.getCanvas();
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
		const c = options.getCanvas();
		if (!c) return;

		const obj = c.getObjects().find((o) => String((o as any).dataId) === id);
		if (!obj) return;

		(obj as any).name = newName;
		c.renderAll();
		rebuildLayers();
	};

	const bringForward = () => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).bringForward(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const sendBackward = () => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).sendBackwards(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const bringToFront = () => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).bringToFront(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	const sendToBack = () => {
		const c = options.getCanvas();
		if (!c) return;

		const activeObject = c.getActiveObject();
		if (activeObject) {
			(c as any).sendToBack(activeObject);
			c.renderAll();
			rebuildLayers();
		}
	};

	return {
		layers,
		rebuildLayers,
		selectLayer,
		toggleLayerVisible,
		toggleLayerLocked,
		renameLayer,
		bringForward,
		sendBackward,
		bringToFront,
		sendToBack,
	};
};
