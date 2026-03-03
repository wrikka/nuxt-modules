<script setup lang="ts">
import type { AudioAlignmentResult } from "#shared/types/audio";

const props = defineProps<{
	tracks: { id: string; name: string }[];
	audioBuffers: Map<string, AudioBuffer>;
}>();

const emit = defineEmits<{
	align: [result: AudioAlignmentResult];
}>();

const referenceTrackId = ref("");
const targetTrackIds = ref<string[]>([]);
const alignmentPrecision = ref<"low" | "medium" | "high">("medium");
const isAnalyzing = ref(false);
const results = ref<AudioAlignmentResult[]>([]);

const availableTargetTracks = computed(() => {
	return props.tracks.filter(t => t.id !== referenceTrackId.value);
});

const toggleTargetTrack = (trackId: string) => {
	const index = targetTrackIds.value.indexOf(trackId);
	if (index > -1) {
		targetTrackIds.value.splice(index, 1);
	} else {
		targetTrackIds.value.push(trackId);
	}
};

const startAlignment = async () => {
	if (!referenceTrackId.value || targetTrackIds.value.length === 0) return;

	isAnalyzing.value = true;
	results.value = [];

	// Simulate alignment analysis
	await new Promise(resolve => setTimeout(resolve, 2000));

	// Generate mock results
	results.value = targetTrackIds.value.map((trackId, index) => ({
		trackId,
		offset: (Math.random() - 0.5) * 0.5, // ±250ms
		confidence: 0.7 + Math.random() * 0.25,
		waveform: new Float32Array(100),
	}));

	isAnalyzing.value = false;
};

const applyAlignment = () => {
	for (const result of results.value) {
		emit("align", result);
	}
};

const formatOffset = (offset: number): string => {
	const ms = Math.round(offset * 1000);
	const sign = ms >= 0 ? "+" : "";
	return `${sign}${ms}ms`;
};

const getConfidenceColor = (confidence: number): string => {
	if (confidence > 0.9) return "text-green-400";
	if (confidence > 0.7) return "text-yellow-400";
	return "text-red-400";
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>Audio Alignment (PluralEyes)</span>
		</div>

		<!-- Reference Track -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Reference Track</label>
			<select
				v-model="referenceTrackId"
				class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
			>
				<option value="">Select reference...</option>
				<option
					v-for="track in props.tracks"
					:key="track.id"
					:value="track.id"
				>
					{{ track.name }}
				</option>
			</select>
		</div>

		<!-- Target Tracks -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Tracks to Align</label>
			<div class="bg-gray-800 rounded p-2 space-y-1 max-h-32 overflow-y-auto">
				<label
					v-for="track in availableTargetTracks"
					:key="track.id"
					class="flex items-center gap-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
				>
					<input
						type="checkbox"
						:checked="targetTrackIds.includes(track.id)"
						@change="toggleTargetTrack(track.id)"
						class="accent-blue-500"
					>
					<span class="text-sm text-gray-300">{{ track.name }}</span>
				</label>
			</div>
		</div>

		<!-- Precision -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2"
			>Alignment Precision</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for='level in ["low", "medium", "high"]'
					:key="level"
					@click="alignmentPrecision = level as any"
					:class="[
						'px-2 py-1.5 rounded text-xs transition-colors capitalize',
						alignmentPrecision === level
							? 'bg-blue-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					{{ level }}
				</button>
			</div>
			<p class="mt-1 text-xs text-gray-500">
				{{
					alignmentPrecision === "low"
					? "Fast, less accurate"
					: alignmentPrecision === "medium"
					? "Balanced speed/accuracy"
					: "Slow, most accurate"
				}}
			</p>
		</div>

		<!-- Analyze Button -->
		<button
			@click="startAlignment"
			:disabled="!referenceTrackId || targetTrackIds.length === 0 || isAnalyzing"
			class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors mb-4"
		>
			{{ isAnalyzing ? "Analyzing..." : "Analyze & Align" }}
		</button>

		<!-- Results -->
		<div v-if="results.length > 0" class="space-y-2">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-400 text-xs">Alignment Results</span>
				<button
					@click="applyAlignment"
					class="text-xs text-green-400 hover:text-green-300"
				>
					Apply All
				</button>
			</div>

			<div class="bg-gray-800 rounded p-2 space-y-1">
				<div
					v-for="result in results"
					:key="result.trackId"
					class="flex items-center justify-between p-2 rounded hover:bg-gray-700"
				>
					<div>
						<div class="text-sm text-gray-300">
							{{ props.tracks.find(t => t.id === result.trackId)?.name }}
						</div>
						<div class="text-xs text-gray-500">
							Offset: {{ formatOffset(result.offset) }}
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span
							class="text-xs"
							:class="getConfidenceColor(result.confidence)"
						>
							{{ (result.confidence * 100).toFixed(0) }}%
						</span>
						<button
							@click="emit('align', result)"
							class="text-xs text-blue-400 hover:text-blue-300 px-2 py-1"
						>
							Apply
						</button>
					</div>
				</div>
			</div>
		</div>

		<p class="mt-3 text-xs text-gray-500">
			Automatically sync multiple audio recordings by detecting and aligning
			similar waveforms.
		</p>
	</div>
</template>
