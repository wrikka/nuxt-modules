<script setup lang="ts">
const props = defineProps<{
	canvasWidth?: number;
	canvasHeight?: number;
}>();

const emit = defineEmits<{
	(e: "annotation-change", annotations: any[]): void;
	(e: "export-image", dataUrl: string): void;
}>();

const { canvasRef, state, presetColors, setTool, setColor, setStrokeWidth, startAnnotation, continueAnnotation, endAnnotation, addTextAnnotation, undo, clear, redrawAll, exportAnnotations, importAnnotations, getAnnotationsAsImage } = useAnnotations();

const textInput = ref("");
const showTextInput = ref(false);
const textPosition = ref({ x: 0, y: 0 });

const tools = [
	{ id: "pen", name: "Pen", icon: "mdi:pen" },
	{ id: "highlight", name: "Highlight", icon: "mdi:marker" },
	{ id: "rectangle", name: "Rectangle", icon: "mdi:rectangle-outline" },
	{ id: "circle", name: "Circle", icon: "mdi:circle-outline" },
	{ id: "arrow", name: "Arrow", icon: "mdi:arrow-top-right" },
	{ id: "text", name: "Text", icon: "mdi:format-text" },
];

const handleCanvasClick = (event: MouseEvent) => {
	if (state.currentTool === "text") {
		const rect = canvasRef.value?.getBoundingClientRect();
		if (rect) {
			textPosition.value = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};
			showTextInput.value = true;
		}
	}
};

const handleAddText = () => {
	if (textInput.value.trim()) {
		addTextAnnotation(textPosition.value.x, textPosition.value.y, textInput.value);
		textInput.value = "";
		showTextInput.value = false;
		emit("annotation-change", exportAnnotations());
	}
};

const handleMouseDown = (event: MouseEvent) => {
	if (state.currentTool === "text") return;

	const rect = canvasRef.value?.getBoundingClientRect();
	if (!rect) return;

	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	startAnnotation(x, y);
};

const handleMouseMove = (event: MouseEvent) => {
	const rect = canvasRef.value?.getBoundingClientRect();
	if (!rect) return;

	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	continueAnnotation(x, y);
};

const handleMouseUp = () => {
	endAnnotation();
	emit("annotation-change", exportAnnotations());
};

const handleUndo = () => {
	undo();
	emit("annotation-change", exportAnnotations());
};

const handleClear = () => {
	clear();
	emit("annotation-change", []);
};

const handleExport = () => {
	const dataUrl = getAnnotationsAsImage();
	if (dataUrl) {
		emit("export-image", dataUrl);
	}
};

const handleOpacityChange = (opacity: number) => {
	setStyle({ opacity });
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg space-y-4">
		<!-- Tools -->
		<div class="flex flex-wrap items-center gap-2">
			<button
				v-for="tool in tools"
				:key="tool.id"
				class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
				:class="state.currentTool === tool.id ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="setTool(tool.id as any)"
			>
				<Icon :name="tool.icon" class="w-4 h-4" />
				{{ tool.name }}
			</button>
		</div>

		<!-- Colors -->
		<div class="flex items-center gap-2">
			<input
				v-model="state.currentStyle.color"
				type="color"
				class="w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
				@change="setColor(state.currentStyle.color)"
			>
			<div class="flex gap-1">
				<button
					v-for="color in presetColors"
					:key="color"
					class="w-6 h-6 rounded-full border-2 transition-all"
					:class="state.currentStyle.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
					:style="{ backgroundColor: color }"
					@click="setColor(color)"
				/>
			</div>
		</div>

		<!-- Stroke Width & Opacity -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
					Stroke: {{ state.currentStyle.strokeWidth }}px
				</label>
				<input
					v-model.number="state.currentStyle.strokeWidth"
					type="range"
					min="1"
					max="20"
					class="w-full"
					@input="setStrokeWidth(state.currentStyle.strokeWidth)"
				>
			</div>
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
					Opacity: {{ Math.round((state.currentStyle.opacity ?? 1) * 100) }}%
				</label>
				<input
					v-model.number="state.currentStyle.opacity"
					type="range"
					min="0.1"
					max="1"
					step="0.1"
					class="w-full"
					@input="handleOpacityChange(state.currentStyle.opacity ?? 1)"
				>
			</div>
		</div>

		<!-- Canvas -->
		<div class="relative border rounded-lg overflow-hidden dark:border-gray-700" :style="{ width: '100%', height: '300px' }">
			<canvas
				ref="canvasRef"
				:width="canvasWidth || 800"
				:height="canvasHeight || 300"
				class="w-full h-full cursor-crosshair bg-transparent"
				@mousedown="handleMouseDown"
				@mousemove="handleMouseMove"
				@mouseup="handleMouseUp"
				@mouseleave="handleMouseUp"
				@click="handleCanvasClick"
			/>

			<!-- Text Input Overlay -->
			<div
				v-if="showTextInput"
				class="absolute p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700"
				:style="{ left: `${textPosition.x}px`, top: `${textPosition.y}px` }"
			>
				<input
					v-model="textInput"
					type="text"
					placeholder="Enter text..."
					class="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
					@keyup.enter="handleAddText"
				>
				<div class="flex gap-1 mt-2">
					<button
						class="px-2 py-1 bg-purple-600 text-white rounded text-xs"
						@click="handleAddText"
					>
						Add
					</button>
					<button
						class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs"
						@click="showTextInput = false; textInput = ''"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-between">
			<div class="text-sm text-gray-500 dark:text-gray-400">
				{{ state.annotations.length }} annotations
			</div>
			<div class="flex gap-2">
				<button
					class="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
					:disabled="state.annotations.length === 0"
					@click="handleUndo"
				>
					<Icon name="mdi:undo" class="w-4 h-4" />
					Undo
				</button>
				<button
					class="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
					:disabled="state.annotations.length === 0"
					@click="handleClear"
				>
					<Icon name="mdi:delete" class="w-4 h-4" />
					Clear
				</button>
				<button
					class="flex items-center gap-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
					:disabled="state.annotations.length === 0"
					@click="handleExport"
				>
					<Icon name="mdi:export" class="w-4 h-4" />
					Export
				</button>
			</div>
		</div>
	</div>
</template>
