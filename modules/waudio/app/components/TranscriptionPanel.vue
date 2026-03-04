<script setup lang="ts">
import type { TranscriptionSegment } from "#shared/types/audio";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	transcribed: [segments: TranscriptionSegment[]];
	addMarker: [time: number, text: string];
}>();

const isTranscribing = ref(false);
const progress = ref(0);
const language = ref("en");
const model = ref<"fast" | "accurate">("accurate");
const segments = ref<TranscriptionSegment[]>([]);
const showTimestamps = ref(true);
const speakerDetection = ref(false);

const languages = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "zh", name: "Chinese" },
	{ code: "th", name: "Thai" },
];

const startTranscription = async () => {
	if (!props.audioBuffer) return;

	isTranscribing.value = true;
	progress.value = 0;
	segments.value = [];

	// Simulate transcription with progress
	const totalSteps = 100;
	for (let i = 0; i <= totalSteps; i++) {
		await new Promise(resolve => setTimeout(resolve, 50));
		progress.value = i;
	}

	// Generate mock transcription segments
	const duration = props.audioBuffer.duration;
	const numSegments = Math.floor(duration / 5);

	segments.value = Array.from({ length: numSegments }, (_, i) => ({
		id: `seg-${i}`,
		startTime: i * 5,
		endTime: Math.min((i + 1) * 5, duration),
		text: `Transcribed text segment ${i + 1}...`,
		confidence: 0.85 + Math.random() * 0.15,
		speaker: speakerDetection.value ? `Speaker ${(i % 2) + 1}` : undefined,
	}));

	emit("transcribed", segments.value);
	isTranscribing.value = false;
};

const addAsMarker = (segment: TranscriptionSegment) => {
	emit("addMarker", segment.startTime, segment.text);
};

const exportTranscription = () => {
	const text = segments.value.map(s =>
		showTimestamps.value
			? `[${formatTime(s.startTime)} - ${formatTime(s.endTime)}] ${
				s.speaker ? `(${s.speaker}) ` : ""
			}${s.text}`
			: s.text
	).join("\n");

	const blob = new Blob([text], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "transcription.txt";
	a.click();
	URL.revokeObjectURL(url);
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const clearTranscription = () => {
	segments.value = [];
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">AI Transcription</span>
			<span v-if="segments.length" class="text-green-400 text-xs">{{
					segments.length
				}} segments</span>
		</div>

		<!-- Settings -->
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label class="block text-gray-400 text-xs mb-1">Language</label>
				<select
					v-model="language"
					class="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm border border-gray-700"
				>
					<option v-for="lang in languages" :key="lang.code" :value="lang.code">
						{{ lang.name }}
					</option>
				</select>
			</div>

			<div>
				<label class="block text-gray-400 text-xs mb-1">Model</label>
				<select
					v-model="model"
					class="w-full bg-gray-800 text-white rounded px-2 py-1.5 text-sm border border-gray-700"
				>
					<option value="fast">Fast</option>
					<option value="accurate">Accurate</option>
				</select>
			</div>
		</div>

		<!-- Options -->
		<div class="flex gap-4 mb-4">
			<label
				class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
			>
				<input v-model="showTimestamps" type="checkbox" class="accent-blue-500">
				Show timestamps
			</label>
			<label
				class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
			>
				<input
					v-model="speakerDetection"
					type="checkbox"
					class="accent-blue-500"
				>
				Speaker detection
			</label>
		</div>

		<!-- Progress -->
		<div v-if="isTranscribing" class="mb-4">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-400">Transcribing...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-800 rounded overflow-hidden">
				<div
					class="h-full bg-blue-500 transition-all duration-100"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Transcribe Button -->
		<button
			v-if="segments.length === 0"
			@click="startTranscription"
			:disabled="!audioBuffer || isTranscribing"
			class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors mb-4"
		>
			{{ isTranscribing ? "Transcribing..." : "Start Transcription" }}
		</button>

		<!-- Results -->
		<div v-if="segments.length > 0" class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-400 text-xs">Transcription Results</span>
				<div class="flex gap-2">
					<button
						@click="exportTranscription"
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						Export
					</button>
					<button
						@click="clearTranscription"
						class="text-xs text-red-400 hover:text-red-300"
					>
						Clear
					</button>
				</div>
			</div>

			<div class="bg-gray-800 rounded p-2 max-h-48 overflow-y-auto space-y-1">
				<div
					v-for="segment in segments"
					:key="segment.id"
					class="p-2 rounded hover:bg-gray-700 cursor-pointer group"
					@click="addAsMarker(segment)"
				>
					<div class="flex items-start gap-2">
						<span class="text-xs text-gray-500 shrink-0">{{
							formatTime(segment.startTime)
						}}</span>
						<div class="flex-1">
							<p class="text-sm text-gray-300">{{ segment.text }}</p>
							<div class="flex items-center gap-2 mt-1">
								<span
									v-if="segment.speaker"
									class="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded"
								>
									{{ segment.speaker }}
								</span>
								<span
									class="text-xs"
									:class="segment.confidence > 0.9
									? 'text-green-400'
									: segment.confidence > 0.7
									? 'text-yellow-400'
									: 'text-red-400'"
								>
									{{ (segment.confidence * 100).toFixed(0) }}%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
