<script setup lang="ts">
const blendModes = [
	{ label: "Normal", value: "source-over" },
	{ label: "Multiply", value: "multiply" },
	{ label: "Screen", value: "screen" },
	{ label: "Overlay", value: "overlay" },
	{ label: "Darken", value: "darken" },
	{ label: "Lighten", value: "lighten" },
	{ label: "Color Dodge", value: "color-dodge" },
	{ label: "Color Burn", value: "color-burn" },
	{ label: "Hard Light", value: "hard-light" },
	{ label: "Soft Light", value: "soft-light" },
	{ label: "Difference", value: "difference" },
	{ label: "Exclusion", value: "exclusion" },
];

const props = defineProps<{
	opacity: number;
	blendMode: string;
}>();

const emit = defineEmits<{
	(e: "update:opacity", value: number): void;
	(e: "update:blendMode", value: string): void;
}>();
</script>

<template>
	<div class="space-y-3">
		<div>
			<div class="flex items-center justify-between mb-1">
				<label class="text-xs text-gray-600 dark:text-gray-400">Opacity:</label>
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

		<div>
			<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
			>Blend Mode</label>
			<select
				:value="blendMode"
				class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
				@change="$emit('update:blendMode', ($event.target as HTMLSelectElement).value)"
			>
				<option
					v-for="mode in blendModes"
					:key="mode.value"
					:value="mode.value"
				>
					{{ mode.label }}
				</option>
			</select>
		</div>

		<div class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded gap-2">
			<div class="w-12 h-12 rounded bg-blue-500" />
			<div
				class="w-12 h-12 rounded bg-red-500"
				:style="{
					opacity: opacity,
					mixBlendMode:
						(blendMode === 'source-over' ? 'normal' : blendMode) as any,
					marginLeft: '-24px',
				}"
			/>
		</div>
	</div>
</template>
