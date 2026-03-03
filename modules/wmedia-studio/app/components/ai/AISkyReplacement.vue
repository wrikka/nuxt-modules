<script setup lang="ts">
const emit = defineEmits<
	{ close: []; replace: [sky: string, blend: number] }
>();
const selectedSky = ref("sunset");
const blend = ref(80);
const maskRefinement = ref(65);
const colorMatch = ref(true);
const isProcessing = ref(false);

const skies = [
	{ id: "sunset", name: "Golden Sunset", color: "bg-orange-500" },
	{ id: "blue", name: "Clear Blue", color: "bg-blue-500" },
	{ id: "storm", name: "Storm Clouds", color: "bg-gray-600" },
	{ id: "night", name: "Starry Night", color: "bg-indigo-900" },
	{ id: "aurora", name: "Aurora", color: "bg-green-600" },
	{
		id: "rainbow",
		name: "Rainbow",
		color: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
	},
];

const replace = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("replace", selectedSky.value, blend.value);
	}, 2500);
};
</script>

<template>
	<div class="ai-sky-replacement bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:cloud" class="w-5 h-5 text-purple-500" />
				AI Sky Replacement
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Sky Preview
			</div>
			<div class="absolute bottom-2 right-2 px-2 py-1 bg-black/30 backdrop-blur text-white text-xs rounded font-medium">
				AI Mask
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Select Sky</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="s in skies"
					:key="s.id"
					class="aspect-video rounded-lg relative overflow-hidden"
					:class="selectedSky === s.id ? 'ring-2 ring-purple-500' : ''"
					@click="selectedSky = s.id"
				>
					<div class="absolute inset-0" :class="s.color" />
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-white text-xs font-medium drop-shadow">{{
							s.name
						}}</span>
					</div>
				</button>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Blend Amount</span>
				<span class="text-purple-500 font-medium">{{ blend }}%</span>
			</div>
			<input
				v-model="blend"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Edge Refinement</span>
				<span class="text-purple-500 font-medium">{{ maskRefinement }}%</span>
			</div>
			<input
				v-model="maskRefinement"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-900 dark:text-white text-sm"
			>Auto Color Match</span>
			<input
				v-model="colorMatch"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
		</label>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="replace"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Replace Sky
		</button>
	</div>
</template>
