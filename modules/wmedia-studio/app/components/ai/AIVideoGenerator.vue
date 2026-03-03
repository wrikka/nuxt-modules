<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [prompt: string, duration: number] }
>();
const prompt = ref("");
const duration = ref(5);
const style = ref("cinematic");
const isGenerating = ref(false);
const progress = ref(0);

const styles = [
	{ id: "cinematic", name: "Cinematic" },
	{ id: "animated", name: "Animated" },
	{ id: "realistic", name: "Realistic" },
	{ id: "abstract", name: "Abstract" },
];

const generate = () => {
	if (!prompt.value.trim()) return;
	isGenerating.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
			emit("generate", prompt.value, duration.value);
		}
	}, 200);
};
</script>
<template>
	<div class="ai-video-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:video" class="w-5 h-5 text-purple-500" />
				AI Video Generator
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<textarea
			v-model="prompt"
			placeholder="Describe the video scene..."
			class="w-full h-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm resize-none mb-3 border-0"
		/>
		<div class="grid grid-cols-2 gap-3 mb-3">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium"
				>Style</label>
				<select
					v-model="style"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
				>
					<option v-for="s in styles" :key="s.id" :value="s.id">
						{{ s.name }}
					</option>
				</select>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium"
				>Duration (sec)</label>
				<input
					v-model="duration"
					type="number"
					min="3"
					max="15"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
				/>
			</div>
		</div>
		<div v-if="isGenerating" class="mb-3">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Generating video...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating || !prompt.trim()"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Generate Video
		</button>
	</div>
</template>
