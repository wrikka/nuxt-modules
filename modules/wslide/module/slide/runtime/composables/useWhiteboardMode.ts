import { ref, computed } from "vue";

export interface WhiteboardElement {
	id: string;
	type: "path" | "text" | "shape" | "image" | "sticky";
	data: unknown;
	position: { x: number; y: number };
	scale: number;
	rotation: number;
	zIndex: number;
	createdBy: string;
	createdAt: Date;
}

export interface WhiteboardPath extends WhiteboardElement {
	type: "path";
	data: {
		points: { x: number; y: number }[];
		color: string;
		strokeWidth: number;
	};
}

export interface WhiteboardViewport {
	x: number;
	y: number;
	zoom: number;
}

export function useWhiteboardMode() {
	const elements = ref<WhiteboardElement[]>([]);
	const viewport = ref<WhiteboardViewport>({ x: 0, y: 0, zoom: 1 });
	const isActive = ref(false);
	const currentTool = ref<WhiteboardElement["type"]>("path");
	const selectedElement = ref<WhiteboardElement | null>(null);
	const isDrawing = ref(false);
	const wsConnection = ref<WebSocket | null>(null);

	const bounds = computed(() => {
		if (elements.value.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
		
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		
		for (const el of elements.value) {
			minX = Math.min(minX, el.position.x);
			minY = Math.min(minY, el.position.y);
			maxX = Math.max(maxX, el.position.x + 100);
			maxY = Math.max(maxY, el.position.y + 100);
		}
		
		return { minX, minY, maxX, maxY };
	});

	const elementCount = computed(() => elements.value.length);

	function activate() {
		isActive.value = true;
	}

	function deactivate() {
		isActive.value = false;
		isDrawing.value = false;
		selectedElement.value = null;
	}

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/whiteboard?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
	}

	function handleMessage(data: { 
		type: string; 
		element?: WhiteboardElement; 
		elementId?: string;
		viewport?: WhiteboardViewport;
	}) {
		switch (data.type) {
			case "element_added":
				if (data.element) elements.value.push(data.element);
				break;
			case "element_updated":
				if (data.element) {
					const index = elements.value.findIndex(e => e.id === data.element!.id);
					if (index > -1) elements.value[index] = data.element;
				}
				break;
			case "element_deleted":
				if (data.elementId) {
					const index = elements.value.findIndex(e => e.id === data.elementId);
					if (index > -1) elements.value.splice(index, 1);
				}
				break;
			case "viewport_sync":
				if (data.viewport) viewport.value = data.viewport;
				break;
		}
	}

	function addPath(points: { x: number; y: number }[], color = "#000", strokeWidth = 3) {
		const path: WhiteboardPath = {
			id: `wb-${Date.now()}`,
			type: "path",
			data: { points, color, strokeWidth },
			position: { x: 0, y: 0 },
			scale: 1,
			rotation: 0,
			zIndex: elements.value.length,
			createdBy: "current-user",
			createdAt: new Date(),
		};
		
		elements.value.push(path);
		wsConnection.value?.send(JSON.stringify({ type: "add_element", element: path }));
		return path;
	}

	function addText(text: string, position: { x: number; y: number }) {
		const element: WhiteboardElement = {
			id: `wb-${Date.now()}`,
			type: "text",
			data: { text, color: "#000", fontSize: 24 },
			position,
			scale: 1,
			rotation: 0,
			zIndex: elements.value.length,
			createdBy: "current-user",
			createdAt: new Date(),
		};
		
		elements.value.push(element);
		wsConnection.value?.send(JSON.stringify({ type: "add_element", element }));
		return element;
	}

	function addStickyNote(text: string, position: { x: number; y: number }, color = "#fef3c7") {
		const element: WhiteboardElement = {
			id: `wb-${Date.now()}`,
			type: "sticky",
			data: { text, color },
			position,
			scale: 1,
			rotation: 0,
			zIndex: elements.value.length,
			createdBy: "current-user",
			createdAt: new Date(),
		};
		
		elements.value.push(element);
		wsConnection.value?.send(JSON.stringify({ type: "add_element", element }));
		return element;
	}

	function moveElement(elementId: string, position: { x: number; y: number }) {
		const element = elements.value.find(e => e.id === elementId);
		if (element) {
			element.position = position;
			wsConnection.value?.send(JSON.stringify({ 
				type: "update_element", 
				element: { ...element, position } 
			}));
		}
	}

	function deleteElement(elementId: string) {
		const index = elements.value.findIndex(e => e.id === elementId);
		if (index > -1) {
			elements.value.splice(index, 1);
			wsConnection.value?.send(JSON.stringify({ type: "delete_element", elementId }));
		}
	}

	function pan(deltaX: number, deltaY: number) {
		viewport.value.x += deltaX / viewport.value.zoom;
		viewport.value.y += deltaY / viewport.value.zoom;
	}

	function zoom(factor: number, center?: { x: number; y: number }) {
		const oldZoom = viewport.value.zoom;
		const newZoom = Math.max(0.1, Math.min(5, oldZoom * factor));
		
		if (center) {
			viewport.value.x += (center.x - viewport.value.x) * (1 - newZoom / oldZoom);
			viewport.value.y += (center.y - viewport.value.y) * (1 - newZoom / oldZoom);
		}
		
		viewport.value.zoom = newZoom;
		
		wsConnection.value?.send(JSON.stringify({ 
			type: "sync_viewport", 
			viewport: viewport.value 
		}));
	}

	function resetViewport() {
		viewport.value = { x: 0, y: 0, zoom: 1 };
	}

	function fitToScreen() {
		const { minX, minY, maxX, maxY } = bounds.value;
		const width = maxX - minX;
		const height = maxY - minY;
		
		viewport.value.x = minX;
		viewport.value.y = minY;
		viewport.value.zoom = Math.min(1, 800 / width, 600 / height);
	}

	function clear() {
		elements.value = [];
		wsConnection.value?.send(JSON.stringify({ type: "clear_all" }));
	}

	function exportWhiteboard(): string {
		return JSON.stringify({
			elements: elements.value,
			viewport: viewport.value,
		}, null, 2);
	}

	function importWhiteboard(json: string): boolean {
		try {
			const data = JSON.parse(json);
			elements.value = data.elements.map((e: WhiteboardElement) => ({
				...e,
				createdAt: new Date(e.createdAt),
			}));
			viewport.value = data.viewport;
			return true;
		} catch {
			return false;
		}
	}

	return {
		elements: readonly(elements),
		viewport: readonly(viewport),
		isActive: readonly(isActive),
		isDrawing: readonly(isDrawing),
		selectedElement: readonly(selectedElement),
		currentTool: readonly(currentTool),
		bounds,
		elementCount,
		activate,
		deactivate,
		connect,
		addPath,
		addText,
		addStickyNote,
		moveElement,
		deleteElement,
		pan,
		zoom,
		resetViewport,
		fitToScreen,
		clear,
		exportWhiteboard,
		importWhiteboard,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
