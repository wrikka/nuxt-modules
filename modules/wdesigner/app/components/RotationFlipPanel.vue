<script setup lang="ts">
const props = defineProps<{
	angle: number;
}>();

const emit = defineEmits<{
	(e: "update:angle", value: number): void;
	(e: "rotate", degrees: number): void;
	(e: "flip", direction: "horizontal" | "vertical"): void;
}>();

const rotateLeft = () => emit("rotate", -90);
const rotateRight = () => emit("rotate", 90);
const flipHorizontal = () => emit("flip", "horizontal");
const flipVertical = () => emit("flip", "vertical");
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="rotateLeft"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
					/>
				</svg>
				<span class="text-xs">-90°</span>
			</button>
			<button
				type="button"
				class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="rotateRight"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
					/>
				</svg>
				<span class="text-xs">+90°</span>
			</button>
		</div>

		<div class="flex items-center gap-2">
			<button
				type="button"
				class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="flipHorizontal"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						transform="rotate(90 12 12)"
					/>
				</svg>
				<span class="text-xs">Flip H</span>
			</button>
			<button
				type="button"
				class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
				@click="flipVertical"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
					/>
				</svg>
				<span class="text-xs">Flip V</span>
			</button>
		</div>

		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400">Angle:</label>
				<span class="text-xs text-gray-500">{{ Math.round(angle) }}°</span>
			</div>
			<input
				type="range"
				min="-180"
				max="180"
				:value="angle"
				class="w-full"
				@input="$emit(
					'update:angle',
					Number(($event.target as HTMLInputElement).value),
				)"
			>
			<div class="flex justify-between text-xs text-gray-400">
				<span>-180°</span>
				<span>0°</span>
				<span>+180°</span>
			</div>
		</div>

		<div class="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
			<div
				class="w-12 h-12 bg-blue-500 rounded shadow-lg"
				:style="{ transform: `rotate(${angle}deg)` }"
			/>
		</div>
	</div>
</template>
