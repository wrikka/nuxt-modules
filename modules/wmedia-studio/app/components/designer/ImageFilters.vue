<script setup lang="ts">
export interface FilterConfig {
	blur: number;
	brightness: number;
	contrast: number;
	saturation: number;
	hueRotate: number;
	sepia: number;
	grayscale: number;
	invert: number;
}

const props = defineProps<{
	modelValue: FilterConfig;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: FilterConfig): void;
	(e: "reset"): void;
}>();

const filters = [
	{ key: "blur", label: "Blur", min: 0, max: 20, unit: "px", step: 0.5 },
	{
		key: "brightness",
		label: "Brightness",
		min: 0,
		max: 200,
		unit: "%",
		step: 1,
	},
	{ key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%", step: 1 },
	{
		key: "saturation",
		label: "Saturation",
		min: 0,
		max: 200,
		unit: "%",
		step: 1,
	},
	{
		key: "hueRotate",
		label: "Hue Rotate",
		min: 0,
		max: 360,
		unit: "deg",
		step: 1,
	},
	{ key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", step: 1 },
	{
		key: "grayscale",
		label: "Grayscale",
		min: 0,
		max: 100,
		unit: "%",
		step: 1,
	},
	{ key: "invert", label: "Invert", min: 0, max: 100, unit: "%", step: 1 },
] as const;

const updateFilter = (key: keyof FilterConfig, value: number) => {
	emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const filterStyle = computed(() => {
	const {
		blur,
		brightness,
		contrast,
		saturation,
		hueRotate,
		sepia,
		grayscale,
		invert,
	} = props.modelValue;
	return [
		blur > 0 && `blur(${blur}px)`,
		brightness !== 100 && `brightness(${brightness}%)`,
		contrast !== 100 && `contrast(${contrast}%)`,
		saturation !== 100 && `saturate(${saturation}%)`,
		hueRotate > 0 && `hue-rotate(${hueRotate}deg)`,
		sepia > 0 && `sepia(${sepia}%)`,
		grayscale > 0 && `grayscale(${grayscale}%)`,
		invert > 0 && `invert(${invert}%)`,
	].filter(Boolean).join(" ") || "none";
});

const presets = [
	{
		name: "None",
		filters: {
			blur: 0,
			brightness: 100,
			contrast: 100,
			saturation: 100,
			hueRotate: 0,
			sepia: 0,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "Vintage",
		filters: {
			blur: 0,
			brightness: 110,
			contrast: 90,
			saturation: 80,
			hueRotate: 0,
			sepia: 30,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "B&W",
		filters: {
			blur: 0,
			brightness: 100,
			contrast: 120,
			saturation: 0,
			hueRotate: 0,
			sepia: 0,
			grayscale: 100,
			invert: 0,
		},
	},
	{
		name: "Vivid",
		filters: {
			blur: 0,
			brightness: 110,
			contrast: 130,
			saturation: 150,
			hueRotate: 0,
			sepia: 0,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "Warm",
		filters: {
			blur: 0,
			brightness: 105,
			contrast: 100,
			saturation: 110,
			hueRotate: 15,
			sepia: 20,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "Cool",
		filters: {
			blur: 0,
			brightness: 100,
			contrast: 110,
			saturation: 90,
			hueRotate: -20,
			sepia: 0,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "Dramatic",
		filters: {
			blur: 0,
			brightness: 90,
			contrast: 150,
			saturation: 80,
			hueRotate: 0,
			sepia: 0,
			grayscale: 0,
			invert: 0,
		},
	},
	{
		name: "Soft",
		filters: {
			blur: 2,
			brightness: 110,
			contrast: 90,
			saturation: 95,
			hueRotate: 0,
			sepia: 0,
			grayscale: 0,
			invert: 0,
		},
	},
];

const applyPreset = (preset: typeof presets[0]) => {
	emit("update:modelValue", preset.filters as FilterConfig);
};
</script>

<template>
	<div class="space-y-3">
		<div class="grid grid-cols-4 gap-1">
			<button
				v-for="preset in presets"
				:key="preset.name"
				type="button"
				class="p-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				@click="applyPreset(preset)"
			>
				<div
					class="w-full h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500 mb-1"
					:style="{
						filter: [
							preset.filters.blur > 0 && `blur(${preset.filters.blur}px)`,
							preset.filters.brightness !== 100
							&& `brightness(${preset.filters.brightness}%)`,
							preset.filters.contrast !== 100
							&& `contrast(${preset.filters.contrast}%)`,
							preset.filters.saturation !== 100
							&& `saturate(${preset.filters.saturation}%)`,
							preset.filters.hueRotate > 0
							&& `hue-rotate(${preset.filters.hueRotate}deg)`,
							preset.filters.sepia > 0 && `sepia(${preset.filters.sepia}%)`,
							preset.filters.grayscale > 0
							&& `grayscale(${preset.filters.grayscale}%)`,
							preset.filters.invert > 0 && `invert(${preset.filters.invert}%)`,
						].filter(Boolean).join(' ') || undefined,
					}"
				/>
				<span class="text-gray-600 dark:text-gray-400">{{ preset.name }}</span>
			</button>
		</div>

		<div class="space-y-2 max-h-48 overflow-y-auto">
			<div v-for="filter in filters" :key="filter.key" class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400">{{
							filter.label
						}}:</label>
					<span class="text-xs text-gray-500">{{ modelValue[filter.key] }}{{
						filter.unit
					}}</span>
				</div>
				<input
					type="range"
					:min="filter.min"
					:max="filter.max"
					:step="filter.step"
					:value="modelValue[filter.key]"
					class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					@input="updateFilter(
						filter.key,
						Number(($event.target as HTMLInputElement).value),
					)"
				>
			</div>
		</div>

		<div class="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
			<img
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234F46E5' width='100' height='100'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23FBBF24'/%3E%3Cpath d='M20 80 Q50 60 80 80' stroke='%2310B981' stroke-width='8' fill='none'/%3E%3C/svg%3E"
				alt="Preview"
				class="w-16 h-16 rounded object-cover"
				:style="{ filter: filterStyle }"
			>
		</div>

		<button
			type="button"
			class="w-full py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
			@click="$emit('reset')"
		>
			Reset Filters
		</button>
	</div>
</template>
