<script setup lang="ts">
interface Track {
	id: string;
	name: string;
	isFrozen: boolean;
	effects: string[];
	cpuUsage: number;
	originalColor: string;
}

const props = defineProps<{
	tracks: Track[];
}>();

const isBouncing = ref(false);
const selectedTracks = ref<string[]>([]);
const bounceFormat = ref<"wav" | "flac">("wav");
const includeEffects = ref(true);

const toggleTrackSelection = (trackId: string) => {
	if (selectedTracks.value.includes(trackId)) {
		selectedTracks.value = selectedTracks.value.filter(id => id !== trackId);
	} else {
		selectedTracks.value.push(trackId);
	}
};

const selectAll = () => {
	selectedTracks.value = props.tracks.map(t => t.id);
};

const deselectAll = () => {
	selectedTracks.value = [];
};

const freezeTracks = async () => {
	if (selectedTracks.value.length === 0) return;
	isBouncing.value = true;
	await new Promise(resolve => setTimeout(resolve, 2000));

	// Mark tracks as frozen
	props.tracks.forEach(track => {
		if (selectedTracks.value.includes(track.id)) {
			track.isFrozen = true;
		}
	});

	isBouncing.value = false;
};

const unfreezeTrack = (trackId: string) => {
	const track = props.tracks.find(t => t.id === trackId);
	if (track) track.isFrozen = false;
};

const getTotalCpuSavings = computed(() => {
	return props.tracks
		.filter(t => selectedTracks.value.includes(t.id))
		.reduce((sum, t) => sum + t.cpuUsage, 0);
});
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
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				Track Freeze / Bounce
			</h3>
			<span v-if="selectedTracks.length > 0" class="text-sm text-gray-400">
				{{ selectedTracks.length }} selected
			</span>
		</div>

		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<p class="text-xs text-blue-300">
				Freeze tracks to render them with effects, freeing up CPU for other
				processing. Frozen tracks can be unfrozen later to edit.
			</p>
		</div>

		<!-- CPU Savings Preview -->
		<div v-if="selectedTracks.length > 0" class="p-3 bg-gray-800 rounded-lg">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-400">Estimated CPU Savings</span>
				<span class="text-green-400 font-medium"
				>~{{ getTotalCpuSavings.toFixed(0) }}%</span>
			</div>
		</div>

		<!-- Track Selection -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-400">Select Tracks to Freeze</span>
				<div class="flex gap-2">
					<button
						@click="selectAll"
						class="text-xs text-purple-400 hover:text-purple-300"
					>
						All
					</button>
					<span class="text-gray-600">|</span>
					<button
						@click="deselectAll"
						class="text-xs text-purple-400 hover:text-purple-300"
					>
						None
					</button>
				</div>
			</div>

			<div class="max-h-48 overflow-y-auto space-y-1">
				<div
					v-for="track in tracks"
					:key="track.id"
					@click="toggleTrackSelection(track.id)"
					:class="[
						'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors',
						selectedTracks.includes(track.id)
							? 'bg-purple-900/30 border border-purple-700'
							: 'bg-gray-800 hover:bg-gray-750',
						track.isFrozen && 'opacity-60',
					]"
				>
					<div class="flex items-center gap-3">
						<input
							type="checkbox"
							:checked="selectedTracks.includes(track.id)"
							:disabled="track.isFrozen"
							class="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
							@click.stop
						/>
						<div
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: track.originalColor }"
						>
						</div>
						<div>
							<div class="text-sm font-medium text-white">{{ track.name }}</div>
							<div class="text-xs text-gray-500">
								{{ track.effects.length }} effects • {{ track.cpuUsage }}% CPU
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<span
							v-if="track.isFrozen"
							class="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded"
						>
							Frozen
						</span>
						<button
							v-if="track.isFrozen"
							@click.stop="unfreezeTrack(track.id)"
							class="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Settings -->
		<div class="space-y-3">
			<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
				<span class="text-sm text-gray-300">Include Effects Chain</span>
				<button
					@click="includeEffects = !includeEffects"
					:class="[
						'w-12 h-6 rounded-full transition-colors relative',
						includeEffects ? 'bg-purple-600' : 'bg-gray-700',
					]"
				>
					<span
						:class="[
							'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
							includeEffects ? 'left-7' : 'left-1',
						]"
					></span>
				</button>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-400">Bounce Format</label>
				<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
					<button
						@click="bounceFormat = 'wav'"
						:class="[
							'flex-1 py-2 text-sm font-medium rounded transition-colors',
							bounceFormat === 'wav'
								? 'bg-purple-600 text-white'
								: 'text-gray-400 hover:text-white hover:bg-gray-700',
						]"
					>
						WAV (Lossless)
					</button>
					<button
						@click="bounceFormat = 'flac'"
						:class="[
							'flex-1 py-2 text-sm font-medium rounded transition-colors',
							bounceFormat === 'flac'
								? 'bg-purple-600 text-white'
								: 'text-gray-400 hover:text-white hover:bg-gray-700',
						]"
					>
						FLAC (Compressed)
					</button>
				</div>
			</div>
		</div>

		<!-- Freeze Button -->
		<button
			@click="freezeTracks"
			:disabled="selectedTracks.length === 0 || isBouncing"
			class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
		>
			<svg
				v-if="isBouncing"
				class="animate-spin h-5 w-5"
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
			<svg
				v-else
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
			{{
				isBouncing
				? "Freezing..."
				: `Freeze ${selectedTracks.length} Track(s)`
			}}
		</button>
	</div>
</template>
