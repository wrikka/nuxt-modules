<script setup lang="ts">
const emit = defineEmits<
	{ close: []; transfer: [style: string, intensity: number] }
>();
const selectedStyle = ref("starry");
const intensity = ref(70);
const styles = [
	{ id: "starry", name: "Starry Night", artist: "Van Gogh" },
	{ id: "wave", name: "The Great Wave", artist: "Hokusai" },
	{ id: "scream", name: "The Scream", artist: "Munch" },
	{ id: "anime", name: "Anime Style", artist: "AI" },
	{ id: "watercolor", name: "Watercolor", artist: "Classic" },
];
const transfer = () => emit("transfer", selectedStyle.value, intensity.value);
</script>
<template>
	<div class="ai-style-transfer bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:palette" class="w-5 h-5 text-purple-500" />
				AI Style Transfer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="grid grid-cols-2 gap-2 mb-4">
			<button
				v-for="s in styles"
				:key="s.id"
				class="p-3 rounded-lg text-left transition-all"
				:class="selectedStyle === s.id
				? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
				: 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'"
				@click="selectedStyle = s.id"
			>
				<div class="w-full aspect-video bg-gray-200 dark:bg-gray-600 rounded mb-2" />
				<div class="text-gray-900 dark:text-white text-sm font-medium">
					{{ s.name }}
				</div>
				<div class="text-gray-500 dark:text-gray-400 text-xs">
					{{ s.artist }}
				</div>
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Style Intensity</span>
				<span class="text-purple-500 font-medium">{{ intensity }}%</span>
			</div>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="transfer"
		>
			Apply Style
		</button>
	</div>
</template>
