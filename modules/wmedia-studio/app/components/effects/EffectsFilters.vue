<script setup lang="ts">
const showFilters = ref(false);

const filters = ref({
	blur: 0,
	brightness: 100,
	contrast: 100,
	grayscale: 0,
	hueRotate: 0,
	invert: 0,
	opacity: 100,
	saturate: 100,
	sepia: 0,
	dropShadowX: 0,
	dropShadowY: 0,
	dropShadowBlur: 0,
	dropShadowColor: "#000000",
});

const presets = [
	{ name: "Vintage", filter: "sepia(50%) contrast(120%)" },
	{ name: "B&W", filter: "grayscale(100%)" },
	{ name: "High Contrast", filter: "contrast(150%)" },
	{ name: "Blur", filter: "blur(5px)" },
	{ name: "Vivid", filter: "saturate(200%)" },
	{ name: "Cool", filter: "hue-rotate(180deg)" },
];

const applyPreset = (preset: typeof presets[0]) => {
	console.log("Apply filter preset:", preset.filter);
};

const getFilterString = () => {
	return `blur(${filters.value.blur}px) brightness(${filters.value.brightness}%) contrast(${filters.value.contrast}%) grayscale(${filters.value.grayscale}%) hue-rotate(${filters.value.hueRotate}deg) invert(${filters.value.invert}%) opacity(${filters.value.opacity}%) saturate(${filters.value.saturate}%) sepia(${filters.value.sepia}%)`;
};
</script>

<template>
	<div>
		<button
			class="fixed right-4 top-56 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-rose-400 ring-offset-2': showFilters }"
			@click="showFilters = !showFilters"
			title="Effects & Filters"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="showFilters"
				class="fixed right-0 top-0 z-40 h-screen w-80 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-rose-600 to-red-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Filters</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showFilters = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Presets -->
					<div class="mb-6 flex flex-wrap gap-2">
						<button
							v-for="preset in presets"
							:key="preset.name"
							class="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300"
							@click="applyPreset(preset)"
						>
							{{ preset.name }}
						</button>
					</div>

					<!-- Filter Controls -->
					<div class="space-y-4">
						<div
							v-for="(value, key) in {
								blur: filters.blur,
								brightness: filters.brightness,
								contrast: filters.contrast,
								grayscale: filters.grayscale,
								saturate: filters.saturate,
								sepia: filters.sepia,
							}"
							:key="key"
						>
							<div class="mb-1 flex items-center justify-between">
								<label
									class="text-xs font-medium capitalize text-gray-700 dark:text-gray-300"
								>{{ key }}</label>
								<span class="text-xs text-gray-500">{{ value }}{{
									key === "blur" ? "px" : "%"
								}}</span>
							</div>
							<input
								v-model.number="filters[key]"
								type="range"
								min="0"
								max="key === 'blur' ? 20 : 200"
								class="w-full"
							/>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700">
						Apply Filters
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
