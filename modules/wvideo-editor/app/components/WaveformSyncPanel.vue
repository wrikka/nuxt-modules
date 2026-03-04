<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	sync: [offset: number];
}>();

const props = defineProps<{
	tracks: Array<{
		id: string;
		name: string;
		type: "video" | "audio";
		waveform: number[];
		offset: number;
	}>;
}>();

const selectedTracks = ref<string[]>([]);
const zoomLevel = ref(100);
const isDragging = ref(false);
const dragStartX = ref(0);
const offsets = ref<Record<string, number>>({});

const toggleTrack = (trackId: string) => {
	const index = selectedTracks.value.indexOf(trackId);
	if (index > -1) {
		selectedTracks.value.splice(index, 1);
	} else {
		selectedTracks.value.push(trackId);
	}
};

const handleMouseDown = (e: MouseEvent, trackId: string) => {
	isDragging.value = true;
	dragStartX.value = e.clientX;
};

const handleMouseMove = (e: MouseEvent) => {
	if (!isDragging.value) return;
	const delta = (e.clientX - dragStartX.value) / (zoomLevel.value / 100);
	// Update offset for selected tracks
};

const handleMouseUp = () => {
	isDragging.value = false;
};

const handleSync = () => {
	// Calculate optimal offset
	emit("sync", 0);
};

const autoSync = async () => {
	// Simulate audio sync detection
};
</script>

<template>
	<div class="waveform-sync-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:waveform" class="w-5 h-5 text-blue-500" />
				Audio Waveform Sync
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Zoom Control -->
		<div class="flex items-center gap-4 mb-4">
			<label class="text-gray-700 dark:text-gray-300 text-sm font-medium"
			>Zoom</label>
			<input
				v-model="zoomLevel"
				type="range"
				min="50"
				max="300"
				class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
			<span class="text-gray-500 dark:text-gray-400 text-sm w-12">{{
					zoomLevel
				}}%</span>
		</div>

		<!-- Waveform Display -->
		<div class="flex-1 overflow-y-auto space-y-2 mb-4">
			<div
				v-for="track in tracks"
				:key="track.id"
				class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
			>
				<div class="flex items-center gap-3 mb-2">
					<input
						type="checkbox"
						:checked="selectedTracks.includes(track.id)"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
						@click="toggleTrack(track.id)"
					>
					<Icon
						:name="track.type === 'video' ? 'mdi:film' : 'mdi:volume-high'"
						class="w-4 h-4 text-gray-500 dark:text-gray-400"
					/>
					<span class="text-gray-900 dark:text-white text-sm">{{
						track.name
					}}</span>
					<span
						class="text-xs px-2 py-0.5 rounded-full"
						:class="track.type === 'video'
						? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
						: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'"
					>
						{{ track.type }}
					</span>
					<span class="text-gray-500 dark:text-gray-400 text-xs ml-auto">
						offset: {{ offsets[track.id] || track.offset }}ms
					</span>
				</div>

				<!-- Waveform -->
				<div
					class="h-16 bg-gray-100 dark:bg-gray-900 rounded flex items-center px-2 cursor-grab active:cursor-grabbing overflow-hidden"
					@mousedown="handleMouseDown($event, track.id)"
					@mousemove="handleMouseMove"
					@mouseup="handleMouseUp"
				>
					<div
						class="flex items-center h-full w-full"
						:style="{ transform: `scaleX(${zoomLevel / 100})` }"
					>
						<div
							v-for="(amp, i) in track.waveform"
							:key="i"
							class="w-1 mx-px rounded-full transition-all"
							:class="track.type === 'video' ? 'bg-blue-500/60' : 'bg-purple-500/60'"
							:style="{ height: `${amp * 100}%` }"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Instructions -->
		<div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600/30 rounded-lg">
			<div class="flex items-start gap-2">
				<Icon name="mdi:information" class="w-4 h-4 text-blue-500 mt-0.5" />
				<div class="text-blue-600 dark:text-blue-300 text-sm">
					<p class="mb-1">Select tracks to sync, then:</p>
					<ul class="list-disc list-inside text-xs space-y-0.5">
						<li>Drag waveforms to align manually</li>
						<li>Or use Auto Sync for automatic alignment</li>
						<li>Match peaks and similar patterns</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
				:disabled="selectedTracks.length < 2"
				@click="autoSync"
			>
				<Icon name="mdi:magic-staff" class="w-4 h-4" />
				Auto Sync
			</button>
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				:disabled="selectedTracks.length === 0"
				@click="handleSync"
			>
				Apply Sync
			</button>
		</div>
	</div>
</template>
