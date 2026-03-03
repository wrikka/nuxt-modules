<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	transcribe: [text: string];
	exportSRT: [subtitles: string];
}>();

const isTranscribing = ref(false);
const progress = ref(0);
const transcribedText = ref("");
const language = ref("th");
const includeTimestamps = ref(true);
const speakerDetection = ref(false);

const languages = [
	{ code: "th", name: "Thai" },
	{ code: "en", name: "English" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "zh", name: "Chinese" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
];

const startTranscription = async () => {
	isTranscribing.value = true;
	progress.value = 0;
	transcribedText.value = "";

	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isTranscribing.value = false;
			transcribedText.value =
				"สวัสดีครับ นี่คือการทดสอบการแปลงเสียงเป็นข้อความ\nHello, this is a voice transcription test.\n今日は、これは音声文字起こしのテストです。";
		}
	}, 200);
};

const copyText = () => {
	navigator.clipboard.writeText(transcribedText.value);
};

const exportSRT = () => {
	const srtContent = `1
00:00:00,000 --> 00:00:05,000
${transcribedText.value.split("\n")[0] || ""}

2
00:00:05,000 --> 00:00:10,000
${transcribedText.value.split("\n")[1] || ""}`;
	emit("exportSRT", srtContent);
};
</script>

<template>
	<div class="voice-transcription bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-transcript" class="w-5 h-5" />
				Voice Transcription
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Language Selection -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Language</label>
			<select
				v-model="language"
				class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
			>
				<option v-for="lang in languages" :key="lang.code" :value="lang.code">
					{{ lang.name }}
				</option>
			</select>
		</div>

		<!-- Options -->
		<div class="flex gap-4 mb-4">
			<label class="flex items-center gap-2 text-sm text-gray-300">
				<input
					v-model="includeTimestamps"
					type="checkbox"
					class="w-4 h-4 rounded"
				>
				Include timestamps
			</label>
			<label class="flex items-center gap-2 text-sm text-gray-300">
				<input
					v-model="speakerDetection"
					type="checkbox"
					class="w-4 h-4 rounded"
				>
				Speaker detection
			</label>
		</div>

		<!-- Start Button -->
		<button
			v-if="!isTranscribing && !transcribedText"
			class="w-full mb-4 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
			@click="startTranscription"
		>
			<Icon name="i-ph-magic-wand" class="w-5 h-5" />
			Start Transcription
		</button>

		<!-- Progress -->
		<div v-if="isTranscribing" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-300">Transcribing...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Result -->
		<div v-if="transcribedText" class="flex-1 flex flex-col">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-300 text-sm">Transcribed Text</label>
				<button
					class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
					@click="copyText"
				>
					<Icon name="i-ph-copy" class="w-3 h-3 inline mr-1" />
					Copy
				</button>
			</div>
			<textarea
				v-model="transcribedText"
				readonly
				class="flex-1 min-h-[150px] bg-gray-900 text-gray-300 px-3 py-2 rounded-lg text-sm font-mono resize-none mb-4"
			/>

			<div class="flex gap-2">
				<button
					class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
					@click='transcribedText = "";
					progress = 0;'
				>
					New Transcription
				</button>
				<button
					class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
					@click="exportSRT"
				>
					<Icon name="i-ph-download" class="w-4 h-4 inline mr-1" />
					Export SRT
				</button>
			</div>
		</div>
	</div>
</template>
