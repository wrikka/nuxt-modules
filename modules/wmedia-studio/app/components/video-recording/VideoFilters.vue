<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const selectedFilter = defineModel<string>("filter", { default: "normal" });
const brightness = defineModel<number>("brightness", { default: 100 });
const contrast = defineModel<number>("contrast", { default: 100 });
const saturation = defineModel<number>("saturation", { default: 100 });
const blur = defineModel<number>("blur", { default: 0 });
const warmth = defineModel<number>("warmth", { default: 0 });

const filters = [
	{ id: "normal", name: "Normal", class: "" },
	{ id: "warm", name: "Warm", class: "sepia-[0.2] saturate-125" },
	{
		id: "cool",
		name: "Cool",
		class: "hue-rotate-15 saturate-90 brightness-110",
	},
	{ id: "vintage", name: "Vintage", class: "sepia-[0.4] contrast-125" },
	{
		id: "cinematic",
		name: "Cinematic",
		class: "contrast-110 saturate-110 brightness-95",
	},
	{ id: "noir", name: "Noir", class: "grayscale contrast-150" },
	{
		id: "dreamy",
		name: "Dreamy",
		class: "brightness-110 saturate-75 blur-[1px]",
	},
	{ id: "vibrant", name: "Vibrant", class: "saturate-150 contrast-110" },
	{ id: "soft", name: "Soft Focus", class: "blur-[0.5px] brightness-105" },
	{ id: "dramatic", name: "Dramatic", class: "contrast-150 saturate-80" },
] as const;

const luts = [
	{ name: "Teal & Orange", preset: "cinema" },
	{ name: "Blockbuster", preset: "action" },
	{ name: "Vintage Film", preset: "retro" },
	{ name: "Summer Vibes", preset: "warm" },
	{ name: "Winter Cold", preset: "cool" },
	{ name: "Cyberpunk", preset: "neon" },
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center">
					<Icon
						name="mdi:palette"
						class="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Video Filters & Color Grading
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Real-time LUTs and adjustments
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 dark:peer-focus:ring-fuchsia-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-fuchsia-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon
						name="mdi:information"
						class="w-4 h-4 text-fuchsia-600 mt-0.5"
					/>
					<p class="text-xs text-fuchsia-700 dark:text-fuchsia-300">
						Apply professional color grading and filters in real-time. Choose
						from presets or customize individual parameters.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Quick Filters</label>
				<div class="grid grid-cols-5 gap-2">
					<button
						v-for="filter in filters"
						:key="filter.id"
						:class="[
							'aspect-square rounded-lg border overflow-hidden transition-all',
							selectedFilter === filter.id
								? 'border-fuchsia-500 ring-2 ring-fuchsia-500'
								: 'border-gray-200 dark:border-gray-700',
						]"
						@click="selectedFilter = filter.id"
					>
						<div
							class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"
							:class="filter.class"
						/>
						<div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
							{{ filter.name }}
						</div>
					</button>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Cinematic LUTs</label>
				<div class="flex flex-wrap gap-1">
					<button
						v-for="lut in luts"
						:key="lut.preset"
						class="px-3 py-1 rounded-full text-xs border transition-colors"
						:class="selectedFilter === lut.preset
						? 'bg-fuchsia-100 dark:bg-fuchsia-900/30 border-fuchsia-500 text-fuchsia-700'
						: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600'"
						@click="selectedFilter = lut.preset"
					>
						{{ lut.name }}
					</button>
				</div>
			</div>

			<div class="space-y-3">
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Brightness</span>
						<span class="text-gray-500">{{ brightness }}%</span>
					</div>
					<input
						v-model.number="brightness"
						type="range"
						min="50"
						max="150"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-fuchsia-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Contrast</span>
						<span class="text-gray-500">{{ contrast }}%</span>
					</div>
					<input
						v-model.number="contrast"
						type="range"
						min="50"
						max="150"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-fuchsia-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Saturation</span>
						<span class="text-gray-500">{{ saturation }}%</span>
					</div>
					<input
						v-model.number="saturation"
						type="range"
						min="0"
						max="200"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-fuchsia-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Blur</span>
						<span class="text-gray-500">{{ blur }}px</span>
					</div>
					<input
						v-model.number="blur"
						type="range"
						min="0"
						max="10"
						step="0.5"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-fuchsia-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Warmth</span>
						<span class="text-gray-500">{{ warmth > 0 ? "+" : "" }}{{
							warmth
						}}</span>
					</div>
					<input
						v-model.number="warmth"
						type="range"
						min="-50"
						max="50"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-fuchsia-600"
					>
					<div class="flex justify-between text-xs text-gray-500 mt-1">
						<span>Cool</span>
						<span>Warm</span>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="flex-1 py-2 px-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-medium transition-colors">
					Save Custom Preset
				</button>
				<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<Icon name="mdi:refresh" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
