<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	export: [format: string];
}>();

const transcript = ref(`[00:00:02] Welcome to this tutorial.
[00:00:05] Today we'll learn about video editing.
[00:00:10] First, let's look at the timeline.
[00:00:15] The timeline is where you arrange your clips.
[00:00:20] You can drag and drop media here.
[00:00:25] Now let's add some transitions.
[00:00:30] Transitions help smooth between clips.`);

const selectedFormat = ref("srt");
const includeTimestamps = ref(true);
const includeSpeakers = ref(false);
const wordLevelTimestamps = ref(false);

const formats = [
	{ id: "srt", name: "SRT", description: "SubRip Subtitle" },
	{ id: "vtt", name: "WebVTT", description: "Web Video Text Tracks" },
	{ id: "txt", name: "Plain Text", description: "Text transcript only" },
	{ id: "json", name: "JSON", description: "Structured data format" },
];

const handleExport = () => {
	emit("export", selectedFormat.value);
};

const copyToClipboard = () => {
	navigator.clipboard.writeText(transcript.value);
};
</script>

<template>
	<div class="transcription-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:file-document" class="w-5 h-5 text-blue-500" />
				Audio Transcription
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Format Selection -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Export Format</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="format in formats"
					:key="format.id"
					class="p-2 rounded-lg transition-colors text-left"
					:class="selectedFormat === format.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="selectedFormat = format.id"
				>
					<div class="text-gray-900 dark:text-white text-sm font-medium">
						{{ format.name }}
					</div>
					<div class="text-gray-500 dark:text-gray-400 text-xs">
						{{ format.description }}
					</div>
				</button>
			</div>
		</div>

		<!-- Options -->
		<div class="mb-4 space-y-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="includeTimestamps"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Include timestamps
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="includeSpeakers"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Include speaker labels
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="wordLevelTimestamps"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Word-level timestamps
			</label>
		</div>

		<!-- Preview -->
		<div class="flex-1 mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm font-medium"
				>Preview</label>
				<button
					class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
					@click="copyToClipboard"
				>
					<Icon name="mdi:content-copy" class="w-3 h-3" />
					Copy
				</button>
			</div>
			<textarea
				v-model="transcript"
				readonly
				class="w-full h-40 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-mono resize-none border-0"
			/>
		</div>

		<!-- Stats -->
		<div class="flex gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
			<span>Words: 45</span>
			<span>Duration: 0:32</span>
			<span>Confidence: 94%</span>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Close
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				@click="handleExport"
			>
				<Icon name="mdi:download" class="w-4 h-4" />
				Export {{ formats.find(f => f.id === selectedFormat)?.name }}
			</button>
		</div>
	</div>
</template>
