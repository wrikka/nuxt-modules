<script setup lang="ts">
const emit = defineEmits<
	{ close: []; sync: [language: string, mode: string] }
>();
const language = ref("en");
const mode = ref("auto");
const accuracy = ref(85);
const isProcessing = ref(false);
const previewUrl = ref("");

const languages = [
	{ id: "en", name: "English", flag: "🇺🇸" },
	{ id: "es", name: "Spanish", flag: "🇪🇸" },
	{ id: "fr", name: "French", flag: "🇫🇷" },
	{ id: "de", name: "German", flag: "🇩🇪" },
	{ id: "ja", name: "Japanese", flag: "🇯🇵" },
	{ id: "zh", name: "Chinese", flag: "🇨🇳" },
];
const modes = [{ id: "auto", name: "Auto Detect" }, {
	id: "manual",
	name: "Manual Sync",
}, { id: "forced", name: "Forced Align" }];

const sync = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("sync", language.value, mode.value);
	}, 3000);
};
</script>
<template>
	<div class="ai-lip-sync bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:microphone" class="w-5 h-5 text-purple-500" />
				AI Lip Sync
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
			Lip Sync Preview
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
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
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Sync Mode</label>
				<select
					v-model="mode"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option v-for="m in modes" :key="m.id" :value="m.id">
						{{ m.name }}
					</option>
				</select>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Sync Accuracy</span>
				<span class="text-purple-500 font-medium">{{ accuracy }}%</span>
			</div>
			<input
				v-model="accuracy"
				type="range"
				min="50"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div
			v-if="isProcessing"
			class="mb-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg"
		>
			<div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
				<Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
				<span class="text-sm">Analyzing audio and video...</span>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="sync"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Apply Lip Sync
		</button>
	</div>
</template>
