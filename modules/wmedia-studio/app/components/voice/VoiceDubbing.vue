<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startDubbing: [settings: DubbingSettings];
}>();

interface DubbingSettings {
	sourceLanguage: string;
	targetLanguage: string;
	voiceStyle: string;
	lipSync: boolean;
	preserveEmotion: boolean;
}

const settings = ref<DubbingSettings>({
	sourceLanguage: "en",
	targetLanguage: "th",
	voiceStyle: "natural",
	lipSync: true,
	preserveEmotion: true,
});

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "th", name: "Thai", flag: "🇹🇭" },
	{ code: "ja", name: "Japanese", flag: "🇯🇵" },
	{ code: "ko", name: "Korean", flag: "🇰🇷" },
	{ code: "zh", name: "Chinese", flag: "🇨🇳" },
	{ code: "es", name: "Spanish", flag: "🇪🇸" },
	{ code: "fr", name: "French", flag: "🇫🇷" },
	{ code: "de", name: "German", flag: "🇩🇪" },
];

const voiceStyles = [
	{ id: "natural", name: "Natural", description: "Casual everyday speech" },
	{ id: "professional", name: "Professional", description: "Clear and formal" },
	{
		id: "dramatic",
		name: "Dramatic",
		description: "Theatrical and expressive",
	},
	{ id: "energetic", name: "Energetic", description: "Upbeat and lively" },
];

const isProcessing = ref(false);
const progress = ref(0);

const startDubbing = () => {
	isProcessing.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("startDubbing", settings.value);
		}
	}, 200);
};

const swapLanguages = () => {
	const temp = settings.value.sourceLanguage;
	settings.value.sourceLanguage = settings.value.targetLanguage;
	settings.value.targetLanguage = temp;
};
</script>

<template>
	<div class="voice-dubbing bg-gray-800 rounded-lg p-4 w-[500px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-translate" class="w-5 h-5" />
				AI Voice Dubbing
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Language Selection -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Languages</label>
			<div class="flex items-center gap-3">
				<div class="flex-1">
					<select
						v-model="settings.sourceLanguage"
						class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
					>
						<option
							v-for="lang in languages"
							:key="lang.code"
							:value="lang.code"
						>
							{{ lang.flag }} {{ lang.name }}
						</option>
					</select>
					<div class="text-center text-gray-500 text-xs mt-1">Source</div>
				</div>
				<button
					class="p-2 text-gray-400 hover:text-white"
					@click="swapLanguages"
				>
					<Icon name="i-ph-arrows-left-right" class="w-5 h-5" />
				</button>
				<div class="flex-1">
					<select
						v-model="settings.targetLanguage"
						class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
					>
						<option
							v-for="lang in languages"
							:key="lang.code"
							:value="lang.code"
						>
							{{ lang.flag }} {{ lang.name }}
						</option>
					</select>
					<div class="text-center text-gray-500 text-xs mt-1">Target</div>
				</div>
			</div>
		</div>

		<!-- Voice Style -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Voice Style</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="style in voiceStyles"
					:key="style.id"
					class="p-3 rounded-lg transition-colors text-left"
					:class="settings.voiceStyle === style.id
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/50 hover:bg-gray-700'"
					@click="settings.voiceStyle = style.id"
				>
					<div class="text-white text-sm font-medium">{{ style.name }}</div>
					<div class="text-gray-500 text-xs">{{ style.description }}</div>
				</button>
			</div>
		</div>

		<!-- Options -->
		<div class="mb-4 space-y-3">
			<label
				class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<div class="flex items-center gap-2">
					<Icon name="i-ph-mouth" class="w-4 h-4 text-gray-400" />
					<span class="text-white text-sm">Lip Sync</span>
				</div>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="settings.lipSync ? 'bg-blue-600' : 'bg-gray-600'"
					@click="settings.lipSync = !settings.lipSync"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="settings.lipSync ? 'left-7' : 'left-1'"
					/>
				</button>
			</label>

			<label
				class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<div class="flex items-center gap-2">
					<Icon name="i-ph-heart" class="w-4 h-4 text-gray-400" />
					<span class="text-white text-sm">Preserve Emotion</span>
				</div>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="settings.preserveEmotion ? 'bg-blue-600' : 'bg-gray-600'"
					@click="settings.preserveEmotion = !settings.preserveEmotion"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="settings.preserveEmotion ? 'left-7' : 'left-1'"
					/>
				</button>
			</label>
		</div>

		<!-- Progress -->
		<div v-if="isProcessing" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-300">Processing video...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
				:disabled="isProcessing"
				@click="startDubbing"
			>
				<Icon
					v-if="isProcessing"
					name="i-ph-spinner"
					class="w-4 h-4 animate-spin"
				/>
				Start Dubbing
			</button>
		</div>
	</div>
</template>
