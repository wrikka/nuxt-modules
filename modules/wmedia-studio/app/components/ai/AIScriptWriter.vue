<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [topic: string, duration: number, tone: string] }
>();
const topic = ref("");
const duration = ref(5);
const tone = ref("professional");
const isGenerating = ref(false);
const generatedScript = ref("");

const tones = [
	{ id: "professional", name: "Professional" },
	{ id: "casual", name: "Casual" },
	{ id: "energetic", name: "Energetic" },
	{ id: "educational", name: "Educational" },
	{ id: "humorous", name: "Humorous" },
];
const wordCount = computed(() => duration.value * 150);

const generate = () => {
	if (!topic.value.trim()) return;
	isGenerating.value = true;
	generatedScript.value = "";
	setTimeout(() => {
		isGenerating.value = false;
		generatedScript.value =
			`[INTRO]\nWelcome everyone! Today we're talking about ${topic.value}.\n\n[MAIN CONTENT]\nThis is a ${duration.value}-minute script in a ${tone.value} tone. The topic covers key points and insights...\n\n[OUTRO]\nThanks for watching! Don't forget to like and subscribe.`;
		emit("generate", topic.value, duration.value, tone.value);
	}, 2000);
};

const copyScript = () => {
	navigator.clipboard.writeText(generatedScript.value);
};
</script>
<template>
	<div class="ai-script-writer bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:pencil" class="w-5 h-5 text-purple-500" />
				AI Script Writer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Topic/Title</label>
			<input
				v-model="topic"
				type="text"
				placeholder="Enter your video topic..."
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			/>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Duration (minutes)</span>
				<span class="text-purple-500 font-medium">{{ duration }} min (~{{
						wordCount
					}} words)</span>
			</div>
			<input
				v-model="duration"
				type="range"
				min="1"
				max="30"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Tone</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="t in tones"
					:key="t.id"
					class="px-3 py-1.5 rounded-full text-sm transition-all"
					:class="tone === t.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="tone = t.id"
				>
					{{ t.name }}
				</button>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium mb-4 transition-colors"
			:disabled="isGenerating || !topic.trim()"
			@click="generate"
		>
			<Icon
				v-if="isGenerating"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Generate Script
		</button>
		<div v-if="generatedScript" class="flex-1 flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<span
					class="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium"
				>Generated Script</span>
				<button
					class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					@click="copyScript"
				>
					Copy
				</button>
			</div>
			<textarea
				v-model="generatedScript"
				readonly
				class="flex-1 min-h-[150px] bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-mono resize-none border-0"
			/>
		</div>
	</div>
</template>
