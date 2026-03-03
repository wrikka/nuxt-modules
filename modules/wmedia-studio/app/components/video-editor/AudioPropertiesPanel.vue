<script setup lang="ts">
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const { selectedClipId, selectedTrackId, currentVideoProject } = storeToRefs(
	videoStore,
);

const selectedClip = computed(() => {
	if (!selectedClipId.value || !currentVideoProject.value) return null;
	return currentVideoProject.value.clips.find((c) =>
		c.id === selectedClipId.value
	);
});

const selectedTrack = computed(() => {
	if (!selectedTrackId.value || !currentVideoProject.value) return null;
	return currentVideoProject.value.tracks.find((t) =>
		t.id === selectedTrackId.value
	);
});

const updateVolume = (volume: number) => {
	if (selectedClipId.value) {
		videoStore.updateClipAudioSettings(selectedClipId.value, { volume });
	}
};

const updateFadeIn = (fadeIn: number) => {
	if (selectedClipId.value) {
		videoStore.updateClipAudioSettings(selectedClipId.value, { fadeIn });
	}
};

const updateFadeOut = (fadeOut: number) => {
	if (selectedClipId.value) {
		videoStore.updateClipAudioSettings(selectedClipId.value, { fadeOut });
	}
};

const toggleMute = () => {
	if (selectedClipId.value) {
		videoStore.toggleClipMute(selectedClipId.value);
	}
};

const updateTrackVolume = (volume: number) => {
	if (selectedTrackId.value) {
		videoStore.updateTrackVolume(selectedTrackId.value, volume);
	}
};

const toggleTrackMute = () => {
	if (selectedTrackId.value) {
		videoStore.toggleTrackMute(selectedTrackId.value);
	}
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Audio</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="selectedClip && selectedClip.audioSettings" class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Volume</label>
					<input
						:value="selectedClip.audioSettings.volume"
						type="range"
						min="0"
						max="100"
						class="w-full"
						@input="updateVolume(Number(($event.target as HTMLInputElement).value))"
					>
					<div class="text-white text-sm mt-1">
						{{ selectedClip.audioSettings.volume }}%
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Fade In (s)</label>
					<input
						:value="selectedClip.audioSettings.fadeIn"
						type="number"
						step="0.1"
						min="0"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updateFadeIn(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Fade Out (s)</label>
					<input
						:value="selectedClip.audioSettings.fadeOut"
						type="number"
						step="0.1"
						min="0"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updateFadeOut(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<button
					class="w-full py-2 rounded text-sm font-medium"
					:class="selectedClip.audioSettings.muted
					? 'bg-red-600 hover:bg-red-700 text-white'
					: 'bg-gray-700 hover:bg-gray-600 text-white'"
					@click="toggleMute"
				>
					{{ selectedClip.audioSettings.muted ? "🔇 Unmute" : "🔊 Mute" }}
				</button>
			</div>

			<div
				v-else-if="selectedTrack && selectedTrack.volume !== undefined"
				class="space-y-4"
			>
				<div>
					<label class="block text-gray-400 text-sm mb-1">Track Volume</label>
					<input
						:value="selectedTrack.volume"
						type="range"
						min="0"
						max="100"
						class="w-full"
						@input="updateTrackVolume(
							Number(($event.target as HTMLInputElement).value),
						)"
					>
					<div class="text-white text-sm mt-1">{{ selectedTrack.volume }}%</div>
				</div>

				<button
					class="w-full py-2 rounded text-sm font-medium"
					:class="selectedTrack.volume === 0
					? 'bg-red-600 hover:bg-red-700 text-white'
					: 'bg-gray-700 hover:bg-gray-600 text-white'"
					@click="toggleTrackMute"
				>
					{{ selectedTrack.volume === 0 ? "🔇 Unmute" : "🔊 Mute" }}
				</button>
			</div>

			<div v-else class="text-gray-500 text-sm text-center mt-8">
				Select an audio clip or track to edit audio settings
			</div>
		</div>
	</div>
</template>
