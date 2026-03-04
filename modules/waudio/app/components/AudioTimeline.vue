<script setup lang="ts">
const {
	tracks,
	selectedTrackId,
	selectedClipId,
	duration,
	createTrack,
	removeClip,
} = useAudioEditor();

const selectTrack = (trackId: string) => {
	selectedTrackId.value = trackId;
};

const selectClip = (clipId: string) => {
	selectedClipId.value = clipId;
};

const toggleMute = (trackId: string) => {
	const track = tracks.value.find((t) => t.id === trackId);
	if (track) {
		track.muted = !track.muted;
	}
};

const toggleSolo = (trackId: string) => {
	const track = tracks.value.find((t) => t.id === trackId);
	if (track) {
		track.solo = !track.solo;
	}
};

const addTrack = () => {
	createTrack(`Track ${tracks.value.length + 1}`);
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700">
		<div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
			<span class="text-gray-400 text-sm font-medium">Timeline</span>
			<div class="flex items-center gap-2">
				<button
					@click="addTrack"
					class="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Add Track
				</button>
			</div>
		</div>

		<div class="max-h-64 overflow-y-auto">
			<div
				v-if="tracks.length === 0"
				class="flex items-center justify-center h-32 text-gray-500 text-sm"
			>
				No tracks yet. Click "Add Track" to create one.
			</div>

			<div v-else class="space-y-1 p-2">
				<div
					v-for="track in tracks"
					:key="track.id"
					:class="[
						'flex items-center gap-2 p-2 rounded border transition-colors',
						selectedTrackId === track.id
							? 'bg-blue-900/20 border-blue-700'
							: 'bg-gray-800 border-gray-700 hover:border-gray-600',
					]"
					@click="selectTrack(track.id)"
				>
					<div class="flex items-center gap-1 min-w-0">
						<button
							@click.stop="toggleMute(track.id)"
							:class="[
								'p-1 rounded transition-colors',
								track.muted
									? 'text-red-400 bg-red-900/30'
									: 'text-gray-400 hover:text-white hover:bg-gray-700',
							]"
							title="Mute"
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
									d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
								/>
								<path
									v-if="track.muted"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
								/>
							</svg>
						</button>
						<button
							@click.stop="toggleSolo(track.id)"
							:class="[
								'p-1 rounded transition-colors',
								track.solo
									? 'text-yellow-400 bg-yellow-900/30'
									: 'text-gray-400 hover:text-white hover:bg-gray-700',
							]"
							title="Solo"
						>
							<span class="text-xs font-bold">S</span>
						</button>
						<span class="text-white text-sm truncate">{{ track.name }}</span>
					</div>

					<div class="flex-1 flex items-center gap-1 min-w-0">
						<div
							v-for="clip in track.clips"
							:key="clip.id"
							:class="[
								'h-8 rounded cursor-pointer transition-colors relative',
								selectedClipId === clip.id
									? 'bg-blue-600'
									: 'bg-gray-600 hover:bg-gray-500',
							]"
							:style="{
								width: `${(clip.duration / duration) * 100}%`,
								left: `${(clip.startTime / duration) * 100}%`,
							}"
							@click.stop="selectClip(clip.id)"
							@dblclick.stop="removeClip(clip.id, track.id)"
						>
							<span
								class="absolute inset-0 flex items-center justify-center text-xs text-white truncate px-1"
							>
								{{ clip.name }}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-1">
						<input
							v-model.number="track.volume"
							type="range"
							min="0"
							max="1"
							step="0.01"
							class="w-16 accent-blue-500"
							title="Track Volume"
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
