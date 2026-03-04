<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";

const {
	currentVideoProject,
	selectedTrackId,
	selectedClipId,
	getClipsByTrack,
	selectTrack,
	selectClip,
	formatTime,
	addVideoTrack,
} = useVideoEditor();

const getTrackIcon = (type: string) => {
	switch (type) {
		case "video":
			return "📹";
		case "audio":
			return "🎵";
		case "text":
			return "📝";
		default:
			return "📄";
	}
};

const getClipIcon = (type: string) => {
	switch (type) {
		case "video":
			return "🎬";
		case "audio":
			return "🎧";
		case "text":
			return "📝";
		case "image":
			return "🖼️";
		default:
			return "📄";
	}
};

const toggleTrackVisibility = (trackId: string) => {
	const track = currentVideoProject.value?.tracks.find((t) => t.id === trackId);
	if (track) {
		track.visible = !track.visible;
	}
};

const toggleTrackLock = (trackId: string) => {
	const track = currentVideoProject.value?.tracks.find((t) => t.id === trackId);
	if (track) {
		track.locked = !track.locked;
	}
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Layers</span>
		</div>

		<div class="flex-1 overflow-y-auto p-2">
			<div
				v-for="track in currentVideoProject?.tracks || []"
				:key="track.id"
				class="mb-2"
			>
				<div
					class="bg-gray-800 rounded p-2 cursor-pointer hover:bg-gray-700"
					:class="{ 'ring-2 ring-blue-500': selectedTrackId === track.id }"
					@click="selectTrack(track.id)"
				>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2">
							<span class="text-lg">{{ getTrackIcon(track.type) }}</span>
							<span class="text-white text-sm font-medium">{{
								track.name
							}}</span>
						</div>
						<div class="flex items-center gap-1">
							<button
								class="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white"
								@click.stop="toggleTrackVisibility(track.id)"
							>
								{{ track.visible ? "👁️" : "👁️‍🗨️" }}
							</button>
							<button
								class="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white"
								@click.stop="toggleTrackLock(track.id)"
							>
								{{ track.locked ? "🔒" : "🔓" }}
							</button>
						</div>
					</div>

					<div class="space-y-1">
						<div
							v-for="clip in getClipsByTrack(track.id)"
							:key="clip.id"
							class="bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-600"
							:class="{ 'ring-1 ring-blue-500': selectedClipId === clip.id }"
							@click.stop="selectClip(clip.id)"
						>
							<div class="flex items-center gap-2">
								<span class="text-sm">{{ getClipIcon(clip.type) }}</span>
								<span class="text-white text-xs truncate">{{ clip.name }}</span>
							</div>
							<div class="text-gray-400 text-xs mt-1">
								{{ formatTime(clip.startTime) }} - {{
									formatTime(clip.endTime)
								}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="p-2 border-t border-gray-700">
			<button
				class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
				@click="addVideoTrack"
			>
				+ Add Track
			</button>
		</div>
	</div>
</template>
