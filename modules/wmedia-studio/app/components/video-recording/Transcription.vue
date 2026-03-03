<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const language = defineModel<string>("language", { default: "en" });
const showSubtitles = defineModel<boolean>("showSubtitles", { default: true });
const subtitles = ref<Array<{ start: number; end: number; text: string }>>([]);
const isTranscribing = ref(false);

const languages = [
	{ code: "en", name: "English" },
	{ code: "th", name: "Thai" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "ja", name: "Japanese" },
	{ code: "zh", name: "Chinese" },
	{ code: "ko", name: "Korean" },
];

const mockTranscribe = async () => {
	isTranscribing.value = true;
	// Simulate transcription delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Mock subtitles
	subtitles.value = [
		{ start: 0, end: 5, text: "Welcome to this video tutorial." },
		{
			start: 5,
			end: 12,
			text: "Today we'll be learning about video recording features.",
		},
		{
			start: 12,
			end: 20,
			text: "Let's start with the basics of setting up your camera.",
		},
		{
			start: 20,
			end: 28,
			text: "Make sure you have good lighting and clear audio.",
		},
		{
			start: 28,
			end: 35,
			text: "These are the key elements for professional video quality.",
		},
	];

	isTranscribing.value = false;
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const ms = Math.floor((seconds % 1) * 100);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const downloadSRT = () => {
	let srt = "";
	subtitles.value.forEach((sub, index) => {
		srt += `${index + 1}\n`;
		srt += `${formatTime(sub.start)} --> ${formatTime(sub.end)}\n`;
		srt += `${sub.text}\n\n`;
	});

	const blob = new Blob([srt], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "transcript.srt";
	a.click();
	URL.revokeObjectURL(url);
};

const copyTranscript = () => {
	const text = subtitles.value.map((s) => s.text).join(" ");
	navigator.clipboard.writeText(text);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				AI Transcription
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<!-- Language -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
				>Language</label>
				<select
					v-model="language"
					class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
				>
					<option v-for="lang in languages" :key="lang.code" :value="lang.code">
						{{ lang.name }}
					</option>
				</select>
			</div>

			<!-- Transcribe Button -->
			<button
				class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
				:disabled="isTranscribing"
				@click="mockTranscribe"
			>
				<Icon
					:name="isTranscribing ? 'mdi:loading' : 'mdi:microphone'"
					class="w-5 h-5 inline mr-2"
					:class="isTranscribing ? 'animate-spin' : ''"
				/>
				{{ isTranscribing ? "Transcribing..." : "Transcribe Now" }}
			</button>

			<!-- Subtitles Toggle -->
			<label class="flex items-center gap-2">
				<input
					v-model="showSubtitles"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Show subtitles in preview</span>
			</label>

			<!-- Transcript -->
			<div v-if="subtitles.length > 0" class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Transcript</span>
					<div class="flex gap-2">
						<button
							class="p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
							@click="copyTranscript"
						>
							<Icon name="mdi:content-copy" class="w-4 h-4" />
						</button>
						<button
							class="p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
							@click="downloadSRT"
						>
							<Icon name="mdi:download" class="w-4 h-4" />
						</button>
					</div>
				</div>

				<div class="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<div
						v-for="(sub, i) in subtitles"
						:key="i"
						class="p-2 bg-white dark:bg-gray-600 rounded text-sm"
					>
						<span class="text-xs text-purple-600 font-mono">{{
							formatTime(sub.start)
						}}</span>
						<p class="text-gray-700 dark:text-gray-300">{{ sub.text }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
