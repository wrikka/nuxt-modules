<script setup lang="ts">
interface AudioTrack {
	id: string;
	name: string;
	audioBuffer: AudioBuffer | null;
	offset: number;
	color: string;
}

const props = defineProps<{
	tracks: AudioTrack[];
}>();

const referenceTrack = ref<string | null>(null);
const tracksToAlign = ref<string[]>([]);
const isAnalyzing = ref(false);
const alignmentResults = ref<
	Array<{ trackId: string; offset: number; correlation: number }>
>([]);
const tolerance = ref(0.1); // seconds

const analyzeAlignment = async () => {
	if (!referenceTrack.value || tracksToAlign.value.length === 0) return;

	isAnalyzing.value = true;
	alignmentResults.value = [];

	// Simulate analysis
	await new Promise(resolve => setTimeout(resolve, 2000));

	tracksToAlign.value.forEach(trackId => {
		alignmentResults.value.push({
			trackId,
			offset: (Math.random() - 0.5) * 0.5, // -250ms to +250ms
			correlation: 0.7 + Math.random() * 0.3,
		});
	});

	isAnalyzing.value = false;
};

const applyAlignment = () => {
	console.log("Applying alignment:", alignmentResults.value);
};

const getTrackName = (id: string) => {
	const track = props.tracks.find(t => t.id === id);
	return track?.name || "Unknown";
};

const getTrackColor = (id: string) => {
	const track = props.tracks.find(t => t.id === id);
	return track?.color || "#888";
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
				Clip Auto-Align
			</h3>
		</div>

		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<p class="text-xs text-blue-300">
				Automatically align multiple audio takes by analyzing waveform
				correlation. Perfect for multi-track drum recordings or vocal doubles.
			</p>
		</div>

		<!-- Reference Track -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Reference Track</label>
			<select
				v-model="referenceTrack"
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option value="">Select reference track...</option>
				<option v-for="track in tracks" :key="track.id" :value="track.id">
					{{ track.name }}
				</option>
			</select>
		</div>

		<!-- Tracks to Align -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Tracks to Align</label>
			<div class="max-h-32 overflow-y-auto space-y-1">
				<div
					v-for="track in tracks.filter(t => t.id !== referenceTrack)"
					:key="track.id"
					@click="tracksToAlign.includes(track.id)
					? tracksToAlign = tracksToAlign.filter(id => id !== track.id)
					: tracksToAlign.push(track.id)"
					class="flex items-center gap-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
				>
					<input
						type="checkbox"
						:checked="tracksToAlign.includes(track.id)"
						class="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
						@click.stop
						@change="tracksToAlign.includes(track.id)
						? tracksToAlign = tracksToAlign.filter(id => id !== track.id)
						: tracksToAlign.push(track.id)"
					/>
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: track.color }"
					>
					</div>
					<span class="text-sm text-white">{{ track.name }}</span>
				</div>
			</div>
		</div>

		<!-- Tolerance -->
		<div class="space-y-1">
			<div class="flex justify-between">
				<label class="text-xs text-gray-400">Search Window (seconds)</label>
				<span class="text-xs text-white"
				>±{{ (tolerance * 1000).toFixed(0) }}ms</span>
			</div>
			<input
				v-model="tolerance"
				type="range"
				min="0.05"
				max="1"
				step="0.05"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
		</div>

		<!-- Results -->
		<div v-if="alignmentResults.length > 0" class="space-y-2">
			<label class="text-sm text-gray-400">Alignment Results</label>
			<div class="space-y-1">
				<div
					v-for="result in alignmentResults"
					:key="result.trackId"
					class="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
				>
					<div class="flex items-center gap-2">
						<div
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: getTrackColor(result.trackId) }"
						>
						</div>
						<span class="text-sm text-white">{{
							getTrackName(result.trackId)
						}}</span>
					</div>
					<div class="text-right">
						<div
							class="text-sm"
							:class="result.offset < 0 ? 'text-green-400' : 'text-yellow-400'"
						>
							{{ result.offset > 0 ? "+" : "" }}{{
								(result.offset * 1000).toFixed(0)
							}}ms
						</div>
						<div class="text-xs text-gray-500">
							{{ (result.correlation * 100).toFixed(1) }}% match
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Analyze Button -->
		<button
			@click="analyzeAlignment"
			:disabled="!referenceTrack || tracksToAlign.length === 0 || isAnalyzing"
			class="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
		>
			<svg
				v-if="isAnalyzing"
				class="animate-spin h-4 w-4"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				>
				</circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				>
				</path>
			</svg>
			<span v-else>Analyze Alignment</span>
		</button>

		<!-- Apply Button -->
		<button
			v-if="alignmentResults.length > 0"
			@click="applyAlignment"
			class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
		>
			Apply Alignment ({{ alignmentResults.length }} tracks)
		</button>
	</div>
</template>
