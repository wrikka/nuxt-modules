<script setup lang="ts">
export interface ShapeTemplate {
	id: string;
	name: string;
	category: string;
	svg: string;
}

const shapeCategories = [
	{ id: "arrows", name: "Arrows" },
	{ id: "bubbles", name: "Speech Bubbles" },
	{ id: "badges", name: "Badges" },
	{ id: "basic", name: "Basic Shapes" },
	{ id: "decorative", name: "Decorative" },
];

const shapes: ShapeTemplate[] = [
	// Arrows
	{
		id: "arrow-right",
		name: "Arrow Right",
		category: "arrows",
		svg: "<polygon points=\"0,4 12,4 12,0 20,8 12,16 12,12 0,12\" />",
	},
	{
		id: "arrow-left",
		name: "Arrow Left",
		category: "arrows",
		svg: "<polygon points=\"20,4 8,4 8,0 0,8 8,16 8,12 20,12\" />",
	},
	{
		id: "arrow-up",
		name: "Arrow Up",
		category: "arrows",
		svg: "<polygon points=\"4,20 4,8 0,8 8,0 16,8 12,8 12,20\" />",
	},
	{
		id: "arrow-down",
		name: "Arrow Down",
		category: "arrows",
		svg: "<polygon points=\"4,0 4,12 0,12 8,20 16,12 12,12 12,0\" />",
	},
	{
		id: "arrow-curved",
		name: "Curved Arrow",
		category: "arrows",
		svg: "<path d=\"M4 16 Q4 4 16 4 L14 2 L18 6 L14 10 L16 8 Q6 8 6 16 Z\" />",
	},

	// Speech Bubbles
	{
		id: "bubble-round",
		name: "Speech Bubble",
		category: "bubbles",
		svg:
			"<ellipse cx=\"10\" cy=\"10\" rx=\"10\" ry=\"8\"/><polygon points=\"4,15 0,20 8,16\" />",
	},
	{
		id: "bubble-rect",
		name: "Rect Bubble",
		category: "bubbles",
		svg:
			"<rect x=\"0\" y=\"0\" width=\"20\" height=\"14\" rx=\"2\" /><polygon points=\"4,14 0,20 8,14\" />",
	},
	{
		id: "bubble-thought",
		name: "Thought Bubble",
		category: "bubbles",
		svg:
			"<ellipse cx=\"10\" cy=\"8\" rx=\"8\" ry=\"6\"/><circle cx=\"4\" cy=\"16\" r=\"1.5\"/><circle cx=\"2\" cy=\"19\" r=\"1\"/>",
	},

	// Badges
	{
		id: "badge-star",
		name: "Star Badge",
		category: "badges",
		svg:
			"<polygon points=\"10,0 13,7 20,8 15,13 16,20 10,17 4,20 5,13 0,8 7,7\" />",
	},
	{
		id: "badge-shield",
		name: "Shield",
		category: "badges",
		svg: "<path d=\"M10 0 L20 4 L20 10 Q20 18 10 20 Q0 18 0 10 L0 4 Z\" />",
	},
	{
		id: "badge-ribbon",
		name: "Ribbon",
		category: "badges",
		svg: "<polygon points=\"10,0 20,4 18,14 10,20 2,14 0,4\" />",
	},
	{
		id: "badge-circle",
		name: "Circle Badge",
		category: "badges",
		svg:
			"<circle cx=\"10\" cy=\"10\" r=\"9\" /><circle cx=\"10\" cy=\"10\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\"/>",
	},

	// Basic Shapes
	{
		id: "heart",
		name: "Heart",
		category: "basic",
		svg:
			"<path d=\"M10 18 L2 10 Q0 6 3 3 Q6 0 10 4 Q14 0 17 3 Q20 6 18 10 Z\" />",
	},
	{
		id: "diamond",
		name: "Diamond",
		category: "basic",
		svg: "<polygon points=\"10,0 20,10 10,20 0,10\" />",
	},
	{
		id: "triangle",
		name: "Triangle",
		category: "basic",
		svg: "<polygon points=\"10,0 20,20 0,20\" />",
	},
	{
		id: "hexagon",
		name: "Hexagon",
		category: "basic",
		svg: "<polygon points=\"10,0 19,5 19,15 10,20 1,15 1,5\" />",
	},
	{
		id: "crescent",
		name: "Crescent",
		category: "basic",
		svg: "<path d=\"M10 0 A10 10 0 1 1 10 20 A6 6 0 1 0 10 0 Z\" />",
	},

	// Decorative
	{
		id: "burst",
		name: "Star Burst",
		category: "decorative",
		svg:
			"<polygon points=\"10,0 12,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 8,7\" />",
	},
	{
		id: "cloud",
		name: "Cloud",
		category: "decorative",
		svg:
			"<ellipse cx=\"8\" cy=\"12\" rx=\"6\" ry=\"5\"/><ellipse cx=\"15\" cy=\"10\" rx=\"5\" ry=\"4\"/><ellipse cx=\"12\" cy=\"6\" rx=\"5\" ry=\"4\"/>",
	},
	{
		id: "flower",
		name: "Flower",
		category: "decorative",
		svg:
			"<circle cx=\"10\" cy=\"10\" r=\"3\"/><ellipse cx=\"10\" cy=\"3\" rx=\"2\" ry=\"4\"/><ellipse cx=\"10\" cy=\"17\" rx=\"2\" ry=\"4\"/><ellipse cx=\"3\" cy=\"10\" rx=\"4\" ry=\"2\"/><ellipse cx=\"17\" cy=\"10\" rx=\"4\" ry=\"2\"/>",
	},
];

const activeCategory = ref("arrows");

const filteredShapes = computed(() =>
	shapes.filter(s => s.category === activeCategory.value)
);

const emit = defineEmits<{
	(e: "select", shape: ShapeTemplate): void;
}>();
</script>

<template>
	<div class="space-y-3">
		<div class="flex gap-1 overflow-x-auto pb-1">
			<button
				v-for="cat in shapeCategories"
				:key="cat.id"
				type="button"
				class="px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors"
				:class="activeCategory === cat.id
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="activeCategory = cat.id"
			>
				{{ cat.name }}
			</button>
		</div>

		<div class="grid grid-cols-4 gap-2">
			<button
				v-for="shape in filteredShapes"
				:key="shape.id"
				type="button"
				class="aspect-square p-2 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
				:title="shape.name"
				@click="$emit('select', shape)"
			>
				<svg
					class="w-full h-full text-gray-700 dark:text-gray-300"
					viewBox="0 0 20 20"
					fill="currentColor"
					v-html="shape.svg"
				/>
			</button>
		</div>
	</div>
</template>
