<script setup lang="ts">
export interface CropConfig {
	enabled: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	aspectRatio: number | null;
}

const props = defineProps<{
	modelValue: CropConfig;
	imageWidth: number;
	imageHeight: number;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: CropConfig): void;
	(e: "apply"): void;
	(e: "cancel"): void;
}>();

const aspectRatios = [
	{ label: "Free", value: null },
	{ label: "1:1", value: 1 },
	{ label: "4:3", value: 4 / 3 },
	{ label: "16:9", value: 16 / 9 },
	{ label: "3:4", value: 3 / 4 },
	{ label: "9:16", value: 9 / 16 },
];

const updateCrop = (updates: Partial<CropConfig>) => {
	emit("update:modelValue", { ...props.modelValue, ...updates });
};

const setAspectRatio = (ratio: number | null) => {
	let { width, height } = props.modelValue;

	if (ratio !== null) {
		if (width / height > ratio) {
			width = height * ratio;
		} else {
			height = width / ratio;
		}
	}

	updateCrop({ aspectRatio: ratio, width, height });
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>Crop Tool</label>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					:checked="modelValue.enabled"
					class="sr-only peer"
					@change="updateCrop({ enabled: ($event.target as HTMLInputElement).checked })"
				>
				<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
			</label>
		</div>

		<div
			v-if="modelValue.enabled"
			class="space-y-3 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
		>
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
				>Aspect Ratio</label>
				<div class="grid grid-cols-6 gap-1">
					<button
						v-for="ratio in aspectRatios"
						:key="ratio.label"
						type="button"
						class="px-2 py-1 text-xs rounded border transition-colors"
						:class="modelValue.aspectRatio === ratio.value
						? 'bg-blue-500 text-white border-blue-500'
						: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
						@click="setAspectRatio(ratio.value)"
					>
						{{ ratio.label }}
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400">X:</label>
					<input
						type="number"
						:value="modelValue.x"
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateCrop({
							x: Number(($event.target as HTMLInputElement).value),
						})"
					>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400">Y:</label>
					<input
						type="number"
						:value="modelValue.y"
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateCrop({
							y: Number(($event.target as HTMLInputElement).value),
						})"
					>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400">Width:</label>
					<input
						type="number"
						:value="modelValue.width"
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateCrop({
							width: Number(($event.target as HTMLInputElement).value),
						})"
					>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Height:</label>
					<input
						type="number"
						:value="modelValue.height"
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateCrop({
							height: Number(($event.target as HTMLInputElement).value),
						})"
					>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					type="button"
					class="flex-1 py-1.5 px-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
					@click="$emit('apply')"
				>
					Apply Crop
				</button>
				<button
					type="button"
					class="py-1.5 px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
					@click="$emit('cancel')"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
