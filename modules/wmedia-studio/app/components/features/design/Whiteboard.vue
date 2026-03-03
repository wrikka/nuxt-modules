<script setup lang="ts">
const tools = ref([
	{ id: "pen", name: "Pen", icon: "mdi:pencil" },
	{ id: "marker", name: "Marker", icon: "mdi:marker" },
	{ id: "shape", name: "Shape", icon: "mdi:shape" },
	{ id: "text", name: "Text", icon: "mdi:format-text" },
	{ id: "sticky", name: "Sticky Note", icon: "mdi:note" },
	{ id: "eraser", name: "Eraser", icon: "mdi:eraser" },
]);
const activeTool = ref("pen");
const color = ref("#3B82F6");
const strokeWidth = ref(3);
const zoom = ref(100);
const elements = ref([{
	id: "1",
	type: "sticky",
	x: 100,
	y: 100,
	text: "Brainstorm ideas here!",
}, { id: "2", type: "shape", x: 300, y: 200, shape: "circle" }]);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Whiteboard
			</h3>
			<div class="flex items-center gap-2">
				<button class="p-1.5 hover:bg-gray-100 rounded">
					<Icon name="mdi:magnify-minus" class="w-4 h-4" />
				</button>
				<span class="text-sm">{{ zoom }}%</span>
				<button class="p-1.5 hover:bg-gray-100 rounded">
					<Icon name="mdi:magnify-plus" class="w-4 h-4" />
				</button>
			</div>
		</div>

		<div class="flex gap-2 mb-4 overflow-x-auto">
			<button
				v-for="tool in tools"
				:key="tool.id"
				@click="activeTool = tool.id"
				:class="{ 'bg-blue-500 text-white': activeTool === tool.id }"
				class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
			>
				<Icon :name="tool.icon" class="w-5 h-5" />
			</button>
			<div class="w-px bg-gray-300 mx-1" />
			<input
				v-model="color"
				type="color"
				class="w-8 h-8 rounded cursor-pointer"
			/>
			<input
				v-model.number="strokeWidth"
				type="range"
				min="1"
				max="10"
				class="w-20"
			/>
		</div>

		<div class="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg relative overflow-hidden cursor-crosshair">
			<div
				class="absolute inset-0 opacity-10"
				style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 20px 20px"
			/>
			<div
				v-for="el in elements"
				:key="el.id"
				class="absolute p-2"
				:style="{ left: `${el.x}px`, top: `${el.y}px` }"
			>
				<div
					v-if="el.type === 'sticky'"
					class="w-32 h-32 bg-yellow-200 rounded shadow-lg p-2 text-sm text-gray-800"
				>
					{{ el.text }}
				</div>
				<div v-else class="w-16 h-16 bg-blue-500 rounded-full" />
			</div>
		</div>
	</div>
</template>
