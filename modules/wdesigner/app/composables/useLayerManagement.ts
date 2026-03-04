import * as fabric from "fabric";
import { computed, ref } from "vue";
import type { Ref } from "vue";

export interface LayerItem {
	id: string;
	name: string;
	type: string;
	visible: boolean;
	locked: boolean;
	selected: boolean;
	zIndex: number;
}

export function useLayerManagement(canvas: Ref<fabric.Canvas | null>) {
	const layers = ref<LayerItem[]>([]);
	const selectedLayerId = ref<string | null>(null);

	type CanvasObject = fabric.Object & { id?: string; name?: string };

	const selectedLayer = computed(() => {
		return layers.value.find(l => l.id === selectedLayerId.value) || null;
	});

	const hasLayers = computed(() => layers.value.length > 0);

	const refreshLayers = () => {
		if (!canvas.value) {
			layers.value = [];
			return;
		}

		const objects = canvas.value.getObjects() as CanvasObject[];
		const activeObject = canvas.value.getActiveObject() as CanvasObject | null;

		layers.value = objects.map((obj, index: number) => ({
			id: obj.id || `layer-${index}`,
			name: obj.name || `${obj.type} ${index + 1}`,
			type: obj.type || "object",
			visible: obj.visible,
			locked: obj.lockMovementX && obj.lockMovementY && obj.lockRotation && obj.lockScalingX && obj.lockScalingY,
			selected: activeObject === obj,
			zIndex: index,
		}));

		if (activeObject) {
			selectedLayerId.value = activeObject.id || `layer-${objects.indexOf(activeObject)}`;
		} else {
			selectedLayerId.value = null;
		}
	};

	const selectLayer = (layerId: string) => {
		if (!canvas.value) return;

		const layer = layers.value.find(l => l.id === layerId);
		if (!layer) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			canvas.value.setActiveObject(obj);
			canvas.value.renderAll();
			selectedLayerId.value = layerId;
		}
	};

	const selectMultipleLayers = (layerIds: string[]) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const selectedObjects = layerIds
			.map(id => objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === id))
			.filter(Boolean) as CanvasObject[];

		if (selectedObjects.length > 0) {
			canvas.value.discardActiveObject();
			const selection = new (canvas.value.constructor as any).ActiveSelection(selectedObjects, {
				canvas: canvas.value,
			});
			canvas.value.setActiveObject(selection as unknown as fabric.Object);
			canvas.value.renderAll();
		}
	};

	const toggleLayerVisibility = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			obj.visible = !obj.visible;
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const toggleLayerLock = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			const layer = layers.value.find(l => l.id === layerId);
			const lockState = !layer?.locked;

			obj.lockMovementX = lockState;
			obj.lockMovementY = lockState;
			obj.lockRotation = lockState;
			obj.lockScalingX = lockState;
			obj.lockScalingY = lockState;

			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const moveLayerUp = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const index = objects.findIndex(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (index >= 0 && index < objects.length - 1 && objects[index]) {
			canvas.value.bringObjectForward(objects[index]!);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const moveLayerDown = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const index = objects.findIndex(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (index > 0 && objects[index]) {
			canvas.value.sendObjectBackwards(objects[index]);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const moveLayerToTop = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			canvas.value.bringObjectToFront(obj);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const moveLayerToBottom = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			canvas.value.sendObjectToBack(obj);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const duplicateLayer = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			void obj.clone(["id", "name"]).then((cloned) => {
				const clonedObj = cloned as CanvasObject;
				clonedObj.left = (clonedObj.left ?? 0) + 10;
				clonedObj.top = (clonedObj.top ?? 0) + 10;
				clonedObj.set("id", `layer-${Date.now()}`);
				canvas.value!.add(clonedObj);
				canvas.value!.setActiveObject(clonedObj);
				canvas.value!.renderAll();
				refreshLayers();
			});
		}
	};

	const deleteLayer = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			canvas.value.remove(obj);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const deleteSelectedLayers = () => {
		if (!canvas.value) return;

		const activeObject = canvas.value.getActiveObject();
		if (!activeObject) return;

		if (activeObject.type === "activeSelection") {
			const objects = (activeObject as any).getObjects();
			objects.forEach((obj: fabric.Object) => {
				canvas.value!.remove(obj);
			});
		} else {
			canvas.value.remove(activeObject);
		}

		canvas.value.discardActiveObject();
		canvas.value.renderAll();
		refreshLayers();
	};

	const renameLayer = (layerId: string, name: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj) {
			obj.set("name", name);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const groupLayers = (layerIds: string[]) => {
		if (!canvas.value || layerIds.length < 2) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const selectedObjects = layerIds
			.map(id => objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === id))
			.filter(Boolean) as CanvasObject[];

		if (selectedObjects.length >= 2) {
			const group = new (canvas.value.constructor as any).Group(selectedObjects, {
				canvas: canvas.value,
			});
			group.set("id", `group-${Date.now()}`);
			canvas.value.setActiveObject(group);
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const ungroupLayer = (layerId: string) => {
		if (!canvas.value) return;

		const objects = canvas.value.getObjects() as CanvasObject[];
		const obj = objects.find(o => (o.id || `layer-${objects.indexOf(o)}`) === layerId);

		if (obj && obj.type === "group") {
			const group = obj as any;
			group.ungroupOnCanvas();
			canvas.value.renderAll();
			refreshLayers();
		}
	};

	const lockAllLayers = () => {
		if (!canvas.value) return;

		canvas.value.getObjects().forEach((obj) => {
			obj.lockMovementX = true;
			obj.lockMovementY = true;
			obj.lockRotation = true;
			obj.lockScalingX = true;
			obj.lockScalingY = true;
		});

		canvas.value.renderAll();
		refreshLayers();
	};

	const unlockAllLayers = () => {
		if (!canvas.value) return;

		canvas.value.getObjects().forEach((obj) => {
			obj.lockMovementX = false;
			obj.lockMovementY = false;
			obj.lockRotation = false;
			obj.lockScalingX = false;
			obj.lockScalingY = false;
		});

		canvas.value.renderAll();
		refreshLayers();
	};

	const showAllLayers = () => {
		if (!canvas.value) return;

		canvas.value.getObjects().forEach((obj) => {
			obj.visible = true;
		});

		canvas.value.renderAll();
		refreshLayers();
	};

	const hideAllLayers = () => {
		if (!canvas.value) return;

		canvas.value.getObjects().forEach((obj) => {
			obj.visible = false;
		});

		canvas.value.renderAll();
		refreshLayers();
	};

	return {
		layers,
		selectedLayer,
		selectedLayerId,
		hasLayers,
		refreshLayers,
		selectLayer,
		selectMultipleLayers,
		toggleLayerVisibility,
		toggleLayerLock,
		moveLayerUp,
		moveLayerDown,
		moveLayerToTop,
		moveLayerToBottom,
		duplicateLayer,
		deleteLayer,
		deleteSelectedLayers,
		renameLayer,
		groupLayers,
		ungroupLayer,
		lockAllLayers,
		unlockAllLayers,
		showAllLayers,
		hideAllLayers,
	};
}
