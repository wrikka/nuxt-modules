<script setup lang="ts">
export interface Pattern {
	id: string;
	name: string;
	css: string;
	preview: string;
}

const patterns: Pattern[] = [
	{
		id: "dots",
		name: "Dots",
		preview: "radial-gradient(circle, #666 1px, transparent 1px)",
		css: "radial-gradient(circle, {color} 1px, transparent 1px)",
	},
	{
		id: "grid",
		name: "Grid",
		preview:
			"linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)",
		css:
			"linear-gradient({color} 1px, transparent 1px), linear-gradient(90deg, {color} 1px, transparent 1px)",
	},
	{
		id: "diagonal",
		name: "Diagonal Lines",
		preview:
			"repeating-linear-gradient(45deg, #666, #666 1px, transparent 1px, transparent 10px)",
		css:
			"repeating-linear-gradient(45deg, {color}, {color} 1px, transparent 1px, transparent 10px)",
	},
	{
		id: "crosshatch",
		name: "Crosshatch",
		preview:
			"repeating-linear-gradient(45deg, #666, #666 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #666, #666 1px, transparent 1px, transparent 10px)",
		css:
			"repeating-linear-gradient(45deg, {color}, {color} 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, {color}, {color} 1px, transparent 1px, transparent 10px)",
	},
	{
		id: "checkerboard",
		name: "Checkerboard",
		preview:
			"conic-gradient(#666 90deg, transparent 90deg 180deg, #666 180deg 270deg, transparent 270deg)",
		css:
			"conic-gradient({color} 90deg, transparent 90deg 180deg, {color} 180deg 270deg, transparent 270deg)",
	},
	{
		id: "stripes-h",
		name: "H. Stripes",
		preview:
			"repeating-linear-gradient(0deg, #666, #666 2px, transparent 2px, transparent 10px)",
		css:
			"repeating-linear-gradient(0deg, {color}, {color} 2px, transparent 2px, transparent 10px)",
	},
	{
		id: "stripes-v",
		name: "V. Stripes",
		preview:
			"repeating-linear-gradient(90deg, #666, #666 2px, transparent 2px, transparent 10px)",
		css:
			"repeating-linear-gradient(90deg, {color}, {color} 2px, transparent 2px, transparent 10px)",
	},
	{
		id: "waves",
		name: "Waves",
		preview:
			"radial-gradient(circle at 50% 100%, transparent 20%, #666 21%, #666 34%, transparent 35%, transparent)",
		css:
			"radial-gradient(circle at 50% 100%, transparent 20%, {color} 21%, {color} 34%, transparent 35%, transparent)",
	},
	{
		id: "noise",
		name: "Noise",
		preview:
			"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
		css:
			"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
	},
	{
		id: "solid",
		name: "Solid Color",
		preview: "linear-gradient(#666, #666)",
		css: "linear-gradient({color}, {color})",
	},
];

const props = defineProps<{
	selectedPattern: string | null;
	color: string;
	opacity: number;
	size: number;
}>();

const emit = defineEmits<{
	(e: "update:selectedPattern", value: string | null): void;
	(e: "update:color", value: string): void;
	(e: "update:opacity", value: number): void;
	(e: "update:size", value: number): void;
}>();

const getPatternStyle = (pattern: Pattern) => {
	const css = pattern.css.replace(/{color}/g, props.color);
	return {
		backgroundImage: css,
		backgroundSize: `${props.size}px ${props.size}px`,
		opacity: props.opacity,
	};
};

const getPreviewStyle = (pattern: Pattern) => {
	return {
		backgroundImage: pattern.preview,
		backgroundSize: "8px 8px",
	};
};
</script>

<template>
	<div class="space-y-3">
		<div class="grid grid-cols-5 gap-1">
			<button
				v-for="pattern in patterns"
				:key="pattern.id"
				type="button"
				class="aspect-square rounded border-2 transition-all"
				:class="selectedPattern === pattern.id
				? 'border-blue-500 ring-2 ring-blue-200'
				: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
				:title="pattern.name"
				@click="$emit('update:selectedPattern', pattern.id)"
			>
				<div
					class="w-full h-full rounded"
					:style="getPreviewStyle(pattern)"
				/>
			</button>
		</div>

		<div
			v-if="selectedPattern"
			class="space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
		>
			<div class="flex items-center gap-2">
				<label class="text-xs text-gray-600 dark:text-gray-400 w-12"
				>Color:</label>
				<input
					type="color"
					:value="color"
					class="w-8 h-8 rounded cursor-pointer"
					@input="$emit('update:color', ($event.target as HTMLInputElement).value)"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Opacity:</label>
					<span class="text-xs text-gray-500">{{
							Math.round(opacity * 100)
						}}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					:value="opacity * 100"
					class="w-full"
					@input="$emit(
						'update:opacity',
						Number(($event.target as HTMLInputElement).value) / 100,
					)"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400">Size:</label>
					<span class="text-xs text-gray-500">{{ size }}px</span>
				</div>
				<input
					type="range"
					min="4"
					max="50"
					:value="size"
					class="w-full"
					@input="$emit(
						'update:size',
						Number(($event.target as HTMLInputElement).value),
					)"
				>
			</div>
		</div>

		<div
			v-if="selectedPattern"
			class="h-16 rounded border border-gray-200 dark:border-gray-700"
			:style="getPatternStyle(patterns.find(p => p.id === selectedPattern)!)"
		/>
	</div>
</template>
