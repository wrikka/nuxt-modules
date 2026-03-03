<script setup lang="ts">
const emit = defineEmits<
	{ close: []; generate: [lang: string, style: string] }
>();
const language = ref("en");
const style = ref("default");
const position = ref("bottom");
const isGenerating = ref(false);
const progress = ref(0);

const languages = [
	{ id: "en", name: "English" },
	{ id: "th", name: "Thai" },
	{ id: "ja", name: "Japanese" },
	{ id: "ko", name: "Korean" },
	{ id: "es", name: "Spanish" },
];
const styles_list = [
	{ id: "default", name: "Default" },
	{ id: "minimal", name: "Minimal" },
	{ id: "large", name: "Large Text" },
	{ id: "karaoke", name: "Karaoke Style" },
];

const generate = () => {
	isGenerating.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
			emit("generate", language.value, style.value);
		}
	}, 200);
};
</script>
<template>
	<div class="ai-subtitle-generator bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:subtitles" class="w-5 h-5 text-purple-500" />
				AI Subtitle Generator
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
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Language</label>
			<select
				v-model="language"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="l in languages" :key="l.id" :value="l.id">
					{{ l.name }}
				</option>
			</select>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Subtitle Style</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="s in styles_list"
					:key="s.id"
					class="p-2 rounded-lg text-center text-sm transition-all"
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
			>Position</label>
			<div class="flex gap-2">
				<button
					v-for='p in ["top", "bottom", "middle"]'
					:key="p"
					class="flex-1 p-2 rounded-lg text-sm capitalize transition-all"
					:class="position === p
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="position = p"
				>
					{{ p }}
				</button>
			</div>
		</div>
		<div v-if="isGenerating" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Transcribing...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isGenerating"
			@click="generate"
		>
			Generate Subtitles
		</button>
	</div>
</template>
