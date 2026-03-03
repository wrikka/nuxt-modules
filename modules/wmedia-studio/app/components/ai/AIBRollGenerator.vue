<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [duration: number, style: string] }
>();
const duration = ref(10);
const style = ref("broll");
const source = ref("auto");
const isGenerating = ref(false);
const progress = ref(0);

const styles = [
	{ id: "broll", name: "B-Roll Footage" },
	{ id: "montage", name: "Quick Montage" },
	{ id: "slowmo", name: "Slow Motion" },
	{ id: "aerial", name: "Aerial Shots" },
	{ id: "closeup", name: "Close-ups" },
];

const sources = [
	{ id: "auto", name: "Auto Select" },
	{ id: "stock", name: "Stock Library" },
	{ id: "generated", name: "AI Generated" },
	{ id: "uploads", name: "My Uploads" },
];

const generate = () => {
	isGenerating.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
			emit("generate", duration.value, style.value);
		}
	}, 150);
};
</script>

<template>
	<div class="ai-broll-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:film" class="w-5 h-5 text-purple-500" />
				AI B-Roll Generator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Duration (seconds)</span>
				<span class="text-purple-500 font-medium">{{ duration }}s</span>
			</div>
			<input
				v-model="duration"
				type="range"
				min="5"
				max="60"
				step="5"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>B-Roll Style</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="s in styles"
					:key="s.id"
					class="px-3 py-1.5 rounded-full text-sm transition-all"
					:class="style === s.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="style = s.id"
				>
					{{ s.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Source</label>
			<select
				v-model="source"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="s in sources" :key="s.id" :value="s.id">
					{{ s.name }}
				</option>
			</select>
		</div>
		<div v-if="isGenerating" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Searching clips...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<div v-else class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Preview
			</div>
			<div class="grid grid-cols-3 gap-1">
				<div
					v-for="i in 6"
					:key="i"
					class="aspect-video bg-gray-200 dark:bg-gray-600 rounded"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>{{ isGenerating ? "Generating..." : "Generate B-Roll" }}
		</button>
	</div>
</template>
