<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const sensitivity = defineModel<number>("sensitivity", { default: 50 });
const minSilenceDuration = defineModel<number>("minSilenceDuration", {
	default: 2000,
});
const fadeDuration = defineModel<number>("fadeDuration", { default: 300 });
const preserveBreaths = defineModel<boolean>("preserveBreaths", {
	default: true,
});
const removeFillerWords = defineModel<boolean>("removeFillerWords", {
	default: true,
});

const fillerWords = [
	"um",
	"uh",
	"like",
	"you know",
	"so",
	"basically",
	"actually",
	"literally",
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<Icon
						name="mdi:volume-mute"
						class="w-5 h-5 text-green-600 dark:text-green-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						AI Silence Removal
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Auto-detect and remove dead air
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:sparkles" class="w-4 h-4 text-green-600 mt-0.5" />
					<p class="text-xs text-green-700 dark:text-green-300">
						AI analyzes audio in real-time and automatically removes silent
						sections. Applied during post-processing after recording stops.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Min Silence</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="minSilenceDuration"
							type="number"
							min="100"
							max="10000"
							step="100"
							class="w-20 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
						>
						<span class="text-sm text-gray-500">ms</span>
					</div>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Fade Duration</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="fadeDuration"
							type="number"
							min="0"
							max="1000"
							step="50"
							class="w-20 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
						>
						<span class="text-sm text-gray-500">ms</span>
					</div>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Detection Sensitivity</span>
					<span class="text-gray-500">{{ sensitivity }}%</span>
				</div>
				<input
					v-model.number="sensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-600"
				>
			</div>

			<div class="space-y-2">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="preserveBreaths"
						type="checkbox"
						class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Preserve natural breaths</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="removeFillerWords"
						type="checkbox"
						class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Also remove filler words</span>
				</label>
			</div>

			<div v-if="removeFillerWords" class="flex flex-wrap gap-1">
				<span
					v-for="word in fillerWords"
					:key="word"
					class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
				>
					"{{ word }}"
				</span>
			</div>
		</div>
	</div>
</template>
