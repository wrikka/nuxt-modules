<script setup lang="ts">
import type { AudioRegion, SoundDetectionResult } from "#shared/types/audio";
import { nanoid } from "nanoid";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	detected: [result: SoundDetectionResult];
	addRegions: [regions: AudioRegion[]];
}>();

const isAnalyzing = ref(false);
const progress = ref(0);
const silenceThreshold = ref(-50);
const minSilenceDuration = ref(0.5);
const minSoundDuration = ref(0.5);
const detectVoice = ref(true);
const detectMusic = ref(true);
const detectSilence = ref(true);

const detectedRegions = ref<AudioRegion[]>([]);

const startDetection = async () => {
	if (!props.audioBuffer) return;

	isAnalyzing.value = true;
	progress.value = 0;
	detectedRegions.value = [];

	const duration = props.audioBuffer.duration;
	const sampleRate = props.audioBuffer.sampleRate;

	// Simulate analysis with progress
	const steps = 20;
	for (let i = 0; i <= steps; i++) {
		await new Promise(resolve => setTimeout(resolve, 100));
		progress.value = (i / steps) * 100;
	}

	// Generate mock detection results
	const regions: AudioRegion[] = [];

	if (detectSilence.value) {
		// Add some silence regions
		for (let i = 1; i < duration; i += 10) {
			if (Math.random() > 0.5) {
				regions.push({
					id: nanoid(),
					name: `Silence ${
						regions.filter(r => r.type === "silence").length + 1
					}`,
					startTime: i,
					endTime: i + Math.random() * 2,
					color: "#6b7280",
					type: "silence",
					confidence: 0.8 + Math.random() * 0.15,
				});
			}
		}
	}

	if (detectVoice.value) {
		// Add some voice regions
		for (let i = 0; i < duration; i += 8) {
			if (Math.random() > 0.3) {
				regions.push({
					id: nanoid(),
					name: `Voice ${regions.filter(r => r.type === "voice").length + 1}`,
					startTime: i,
					endTime: i + 2 + Math.random() * 4,
					color: "#3b82f6",
					type: "voice",
					confidence: 0.85 + Math.random() * 0.1,
				});
			}
		}
	}

	if (detectMusic.value) {
		// Add some music regions
		for (let i = 5; i < duration; i += 15) {
			if (Math.random() > 0.4) {
				regions.push({
					id: nanoid(),
					name: `Music ${regions.filter(r => r.type === "music").length + 1}`,
					startTime: i,
					endTime: i + 5 + Math.random() * 5,
					color: "#22c55e",
					type: "music",
					confidence: 0.8 + Math.random() * 0.15,
				});
			}
		}
	}

	// Sort by start time
	regions.sort((a, b) => a.startTime - b.startTime);
	detectedRegions.value = regions;

	const result: SoundDetectionResult = {
		regions,
		silenceThreshold: silenceThreshold.value,
		voiceConfidence: detectVoice.value ? 0.88 : 0,
		musicConfidence: detectMusic.value ? 0.82 : 0,
	};

	emit("detected", result);
	isAnalyzing.value = false;
};

const addRegionsToTimeline = () => {
	emit("addRegions", detectedRegions.value);
};

const clearResults = () => {
	detectedRegions.value = [];
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getTypeIcon = (type?: string): string => {
	switch (type) {
		case "silence":
			return "🔇";
		case "voice":
			return "🎤";
		case "music":
			return "🎵";
		default:
			return "🎧";
	}
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Sound Detection</span>
		</div>

		<!-- Detection Options -->
		<div class="space-y-3 mb-4">
			<div class="flex gap-4">
				<label
					class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
				>
					<input
						v-model="detectSilence"
						type="checkbox"
						class="accent-blue-500"
					>
					Detect Silence
				</label>
				<label
					class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
				>
					<input v-model="detectVoice" type="checkbox" class="accent-blue-500">
					Detect Voice
				</label>
				<label
					class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
				>
					<input v-model="detectMusic" type="checkbox" class="accent-blue-500">
					Detect Music
				</label>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Silence Threshold</span>
					<span class="text-gray-300">{{ silenceThreshold }}dB</span>
				</div>
				<input
					v-model.number="silenceThreshold"
					type="range"
					min="-80"
					max="-20"
					step="5"
					class="w-full accent-blue-500"
				>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isAnalyzing" class="mb-4">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-400">Analyzing audio...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-800 rounded overflow-hidden">
				<div
					class="h-full bg-blue-500 transition-all duration-100"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Detect Button -->
		<button
			v-if="detectedRegions.length === 0"
			@click="startDetection"
			:disabled="!audioBuffer || isAnalyzing"
			class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors mb-4"
		>
			{{ isAnalyzing ? "Analyzing..." : "Start Detection" }}
		</button>

		<!-- Results -->
		<div v-if="detectedRegions.length > 0" class="space-y-2">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-400 text-xs"
				>Detected Regions ({{ detectedRegions.length }})</span>
				<div class="flex gap-2">
					<button
						@click="addRegionsToTimeline"
						class="text-xs text-green-400 hover:text-green-300"
					>
						Add to Timeline
					</button>
					<button
						@click="clearResults"
						class="text-xs text-red-400 hover:text-red-300"
					>
						Clear
					</button>
				</div>
			</div>

			<div class="bg-gray-800 rounded p-2 max-h-40 overflow-y-auto space-y-1">
				<div
					v-for="region in detectedRegions"
					:key="region.id"
					class="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
				>
					<span class="text-lg">{{ getTypeIcon(region.type) }}</span>
					<div class="flex-1 min-w-0">
						<div class="text-sm text-gray-300 truncate">{{ region.name }}</div>
						<div class="text-xs text-gray-500">
							{{ formatTime(region.startTime) }} - {{
								formatTime(region.endTime)
							}}
						</div>
					</div>
					<span
						class="text-xs px-1.5 py-0.5 rounded"
						:style="{
							backgroundColor: `${region.color}40`,
							color: region.color,
						}"
					>
						{{ (region.confidence! * 100).toFixed(0) }}%
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
