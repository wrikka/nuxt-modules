<script setup lang="ts">
import type { Element } from "#shared/types";
import { nanoid } from "nanoid";

interface Tool {
	id: string;
	icon: string;
	label: string;
}

const tools: Tool[] = [
	{ id: "select", icon: "↖", label: "Select" },
	{ id: "text", icon: "T", label: "Text" },
	{ id: "image", icon: "🖼️", label: "Image" },
	{ id: "shape", icon: "◻️", label: "Shape" },
	{ id: "line", icon: "╱", label: "Line" },
];

const activeTool = ref("select");
const zoom = ref(100);

const elementStore = useElementStore();
const { canUndo, canRedo, selectedElements } = storeToRefs(elementStore);

const emit = defineEmits<{
	toolSelected: [toolId: string];
	undo: [];
	redo: [];
	zoomIn: [];
	zoomOut: [];
	fitToScreen: [];
	export: [];
}>();

const createTextElement = (): Element => ({
	id: nanoid(),
	type: "text",
	x: 100,
	y: 100,
	width: 240,
	height: 60,
	rotation: 0,
	opacity: 1,
	locked: false,
	visible: true,
	zIndex: Date.now(),
	content: "Text",
	fontFamily: "Inter",
	fontSize: 24,
	fontWeight: 400,
	fontStyle: "normal",
	textAlign: "left",
	color: "#111827",
	lineHeight: 1.2,
	letterSpacing: 0,
});

const createRectElement = (): Element => ({
	id: nanoid(),
	type: "shape",
	x: 120,
	y: 120,
	width: 200,
	height: 120,
	rotation: 0,
	opacity: 1,
	locked: false,
	visible: true,
	zIndex: Date.now(),
	shape: "rectangle",
	fill: "#3b82f6",
	stroke: "#000000",
	strokeWidth: 0,
	borderRadius: 8,
});

const createCircleElement = (): Element => ({
	id: nanoid(),
	type: "shape",
	x: 140,
	y: 140,
	width: 120,
	height: 120,
	rotation: 0,
	opacity: 1,
	locked: false,
	visible: true,
	zIndex: Date.now(),
	shape: "circle",
	fill: "#22c55e",
	stroke: "#000000",
	strokeWidth: 0,
});

const addText = () => {
	elementStore.addElement(createTextElement());
};

const addRectangle = () => {
	elementStore.addElement(createRectElement());
};

const addCircle = () => {
	elementStore.addElement(createCircleElement());
};

const groupSelection = () => {
	const ids = Array.from(selectedElements.value);
	if (ids.length < 2) return;

	const children = ids
		.map((id) => elementStore.elements.get(id))
		.filter((e): e is Element => e != null);
	if (children.length < 2) return;

	const minX = Math.min(...children.map((c) => c.x));
	const minY = Math.min(...children.map((c) => c.y));
	const maxX = Math.max(...children.map((c) => c.x + c.width));
	const maxY = Math.max(...children.map((c) => c.y + c.height));

	const groupId = nanoid();
	elementStore.addElement({
		id: groupId,
		type: "group",
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
		rotation: 0,
		opacity: 1,
		locked: false,
		visible: true,
		zIndex: Date.now(),
		elements: children.map((c) => c.id),
		layoutMode: "horizontal",
		padding: 16,
		gap: 12,
		primaryAlign: "start",
		counterAlign: "center",
	});

	elementStore.selectElement(groupId);
};

const handleToolClick = (toolId: string) => {
	activeTool.value = toolId;
	emit("toolSelected", toolId);
	if (toolId === "text") addText();
	if (toolId === "shape") addRectangle();
};

const handleUndo = () => {
	elementStore.undo();
	emit("undo");
};

const handleRedo = () => {
	elementStore.redo();
	emit("redo");
};

const handleZoomIn = () => {
	zoom.value = Math.min(500, zoom.value + 10);
	emit("zoomIn");
};

const handleZoomOut = () => {
	zoom.value = Math.max(10, zoom.value - 10);
	emit("zoomOut");
};

const handleFitToScreen = () => {
	zoom.value = 100;
	emit("fitToScreen");
};

const handleExport = () => {
	emit("export");
};
</script>

<template>
	<div class="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center gap-2">
		<button
			v-for="tool in tools"
			:key="tool.id"
			:class="[
				'p-2 rounded-lg transition-colors',
				activeTool === tool.id
					? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
					: 'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			:title="tool.label"
			@click="handleToolClick(tool.id)"
		>
			<span class="text-xl">{{ tool.icon }}</span>
		</button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Group"
			@click="groupSelection"
		>
			<span class="text-xl">⧉</span>
		</button>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Undo"
			:disabled="!canUndo"
			@click="handleUndo"
		>
			<span class="text-xl">↶</span>
		</button>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Redo"
			:disabled="!canRedo"
			@click="handleRedo"
		>
			<span class="text-xl">↷</span>
		</button>

		<div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Zoom In"
			@click="handleZoomIn"
		>
			<span class="text-xl">🔍+</span>
		</button>

		<span class="text-sm text-gray-600 dark:text-gray-300">{{ zoom }}%</span>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Zoom Out"
			@click="handleZoomOut"
		>
			<span class="text-xl">🔍-</span>
		</button>

		<button
			:class="[
				'p-2 rounded-lg transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-600',
			]"
			title="Fit to Screen"
			@click="handleFitToScreen"
		>
			<span class="text-xl">⊡</span>
		</button>

		<div class="flex-1"></div>

		<Button variant="primary" @click="handleExport">
			Export
		</Button>
	</div>
</template>
