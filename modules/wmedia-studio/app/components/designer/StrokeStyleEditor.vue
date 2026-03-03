<script setup lang="ts">
const props = defineProps<{
	strokeDashArray: number[] | null;
	strokeLineCap: string;
	rx: number;
	ry: number;
}>();

const emit = defineEmits<{
	(e: "update:strokeDashArray", value: number[] | null): void;
	(e: "update:strokeLineCap", value: string): void;
	(e: "update:rx", value: number): void;
	(e: "update:ry", value: number): void;
}>();

const strokeStyles = [
	{ label: "Solid", value: null, preview: "solid" },
	{ label: "Dashed", value: [10, 5], preview: "dashed" },
	{ label: "Dotted", value: [2, 4], preview: "dotted" },
	{ label: "Dash-Dot", value: [10, 3, 2, 3], preview: "dashdot" },
];

const lineCaps = [
	{ label: "Butt", value: "butt" },
	{ label: "Round", value: "round" },
	{ label: "Square", value: "square" },
];

const previewStyle = computed(() => {
	const dashArray = props.strokeDashArray;
	if (!dashArray || dashArray.length === 0) return "solid";
	if (dashArray.length === 2 && dashArray[0] === 10 && dashArray[1] === 5) {
		return "dashed";
	}
	if (dashArray.length === 2 && dashArray[0] === 2 && dashArray[1] === 4) {
		return "dotted";
	}
	return "dashdot";
});
</script>

<template>
	<div class="space-y-3">
		<div>
			<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
			>Stroke Style</label>
			<div class="grid grid-cols-4 gap-1">
				<button
					v-for="style in strokeStyles"
					:key="style.label"
					type="button"
					class="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center gap-1"
					:class="{
						'bg-blue-50 dark:bg-blue-900/30 border-blue-300':
							previewStyle === style.preview,
					}"
					@click="$emit('update:strokeDashArray', style.value)"
				>
					<svg class="w-8 h-3" viewBox="0 0 32 12">
						<line
							x1="2"
							y1="6"
							x2="30"
							y2="6"
							stroke="currentColor"
							stroke-width="2"
							:stroke-dasharray="style.value?.join(',') || '0'"
							class="text-gray-600 dark:text-gray-400"
						/>
					</svg>
					<span class="text-xs text-gray-600 dark:text-gray-400">{{
						style.label
					}}</span>
				</button>
			</div>
		</div>

		<div>
			<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
			>Line Cap</label>
			<select
				:value="strokeLineCap"
				class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
				@change="$emit(
					'update:strokeLineCap',
					($event.target as HTMLSelectElement).value,
				)"
			>
				<option v-for="cap in lineCaps" :key="cap.value" :value="cap.value">
					{{ cap.label }}
				</option>
			</select>
		</div>

		<div class="space-y-2">
			<div>
				<div class="flex items-center justify-between mb-1">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Corner Radius X:</label>
					<span class="text-xs text-gray-500">{{ rx }}px</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					:value="rx"
					class="w-full"
					@input="$emit(
						'update:rx',
						Number(($event.target as HTMLInputElement).value),
					)"
				>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Corner Radius Y:</label>
					<span class="text-xs text-gray-500">{{ ry }}px</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					:value="ry"
					class="w-full"
					@input="$emit(
						'update:ry',
						Number(($event.target as HTMLInputElement).value),
					)"
				>
			</div>
		</div>

		<div class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
			<div
				class="w-20 h-12 border-2 border-blue-500 bg-blue-100 dark:bg-blue-900/30"
				:style="{
					borderRadius: `${rx}px ${ry}px`,
					borderStyle: previewStyle === 'dashed'
						? 'dashed'
						: previewStyle === 'dotted'
						? 'dotted'
						: 'solid',
					strokeDasharray: strokeDashArray?.join(',') || undefined,
				}"
			/>
		</div>
	</div>
</template>
