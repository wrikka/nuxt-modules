<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [category: string, intensity: number] }
>();
const category = ref("whoosh");
const intensity = ref(50);
const isGenerating = ref(false);
const generatedSounds = ref<string[]>([]);

const categories = [
	{ id: "whoosh", name: "Whoosh", icon: "i-ph-wind" },
	{ id: "explosion", name: "Explosion", icon: "i-ph-fire" },
	{ id: "impact", name: "Impact", icon: "i-ph-lightning" },
	{ id: "ambience", name: "Ambience", icon: "i-ph-cloud" },
	{ id: "ui", name: "UI Sound", icon: "i-ph-mouse" },
	{ id: "foley", name: "Foley", icon: "i-ph-footprints" },
	{ id: "nature", name: "Nature", icon: "i-ph-tree" },
	{ id: "tech", name: "Tech", icon: "i-ph-cpu" },
];

const generate = () => {
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
		generatedSounds.value.unshift(`${category.value}_${Date.now()}.wav`);
		emit("generate", category.value, intensity.value);
	}, 1500);
};
</script>
<template>
	<div class="ai-sound-effects bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:volume-high" class="w-5 h-5 text-purple-500" />
				AI Sound Effects
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
				v-for="c in categories"
				:key="c.id"
				class="p-3 rounded-lg flex items-center gap-2 transition-all"
				:class="category === c.id
				? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
				: 'bg-gray-50 dark:bg-gray-700/50'"
				@click="category = c.id"
			>
				<span :class="[c.icon, 'w-4 h-4 text-gray-500 dark:text-gray-400']" />
				<span class="text-gray-900 dark:text-white text-sm">{{ c.name }}</span>
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Intensity</span>
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
			:disabled="isGenerating"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>Generate Sound
		</button>
		<div v-if="generatedSounds.length > 0" class="mt-4 space-y-2">
			<div
				v-for="sound in generatedSounds"
				:key="sound"
				class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<Icon name="mdi:speaker" class="w-5 h-5 text-purple-500" />
				<span class="text-gray-900 dark:text-white text-sm">{{ sound }}</span>
				<button class="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
					<Icon name="mdi:play" class="w-4 h-4" />
				</button>
				<button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
					<Icon name="mdi:download" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
