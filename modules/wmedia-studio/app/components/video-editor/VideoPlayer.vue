<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";

const {
	currentTime,
	isPlaying,
	currentVideoProject,
	selectedClipId,
	getActiveClipsAtTime,
	togglePlayback,
	seekTo,
	seekToStart,
	seekToEnd,
	stepForward,
	stepBackward,
} = useVideoEditor();

const playerContainer = ref<HTMLElement | null>(null);
const videoElements = ref<HTMLVideoElement[]>([]);
const volume = ref(100);
const playbackSpeed = ref(1);
const isFullscreen = ref(false);

const activeVideoClips = computed(() => {
	if (!currentVideoProject.value) return [];
	return getActiveClipsAtTime(currentTime.value).filter((c) =>
		c.type === "video"
	);
});

const activeImageClips = computed(() => {
	if (!currentVideoProject.value) return [];
	return getActiveClipsAtTime(currentTime.value).filter((c) =>
		c.type === "image"
	);
});

const activeTextClips = computed(() => {
	if (!currentVideoProject.value) return [];
	return getActiveClipsAtTime(currentTime.value).filter((c) =>
		c.type === "text"
	);
});

const getClipStyle = (clip: any) => {
	if (!clip.transform) return {};
	return {
		transform:
			`translate(${clip.transform.x}px, ${clip.transform.y}px) scale(${clip.transform.scale}) rotate(${clip.transform.rotation}deg)`,
		opacity: clip.transform.opacity,
	};
};

const onVideoLoaded = (clipId: string) => {
	const video = videoElements.value.find((v) => v.src.includes(clipId));
	if (video) {
		video.currentTime = currentTime.value;
	}
};

const updateVolume = (newVolume: number) => {
	volume.value = newVolume;
	videoElements.value.forEach((video) => {
		video.volume = newVolume / 100;
	});
};

const updatePlaybackSpeed = (speed: number) => {
	playbackSpeed.value = speed;
	videoElements.value.forEach((video) => {
		video.playbackRate = speed;
	});
};

const toggleFullscreen = () => {
	if (!playerContainer.value) return;

	if (!isFullscreen.value) {
		if (playerContainer.value.requestFullscreen) {
			playerContainer.value.requestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
};

watch(isFullscreen, (value) => {
	if (!value && document.fullscreenElement) {
		document.exitFullscreen();
	}
});

watch(currentTime, (newTime) => {
	videoElements.value.forEach((video) => {
		if (Math.abs(video.currentTime - newTime) > 0.1) {
			video.currentTime = newTime;
		}
	});
});

watch(isPlaying, (playing) => {
	videoElements.value.forEach((video) => {
		if (playing) {
			video.play().catch(() => {});
		} else {
			video.pause();
		}
	});
});

const handleFullscreenChange = () => {
	isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
	document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
	document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<template>
	<div class="relative flex-1 bg-black flex flex-col overflow-hidden">
		<div class="flex-1 flex items-center justify-center overflow-hidden">
			<div
				v-if="currentVideoProject"
				ref="playerContainer"
				class="relative"
				:style="{
					width: `${currentVideoProject.width}px`,
					height: `${currentVideoProject.height}px`,
					backgroundColor: currentVideoProject.settings.backgroundColor
						|| '#000',
				}"
			>
				<video
					v-for="clip in activeVideoClips"
					:key="clip.id"
					ref="videoElements"
					:src="clip.sourceUrl"
					class="absolute top-0 left-0 w-full h-full object-contain"
					:style="getClipStyle(clip)"
					:controls="false"
					:muted="true"
					@loadedmetadata="onVideoLoaded(clip.id)"
				/>

				<img
					v-for="clip in activeImageClips"
					:key="clip.id"
					:src="clip.sourceUrl"
					class="absolute top-0 left-0 w-full h-full object-contain"
					:style="getClipStyle(clip)"
				/>

				<div
					v-for="clip in activeTextClips"
					:key="clip.id"
					class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-2xl font-bold"
					:style="getClipStyle(clip)"
				>
					{{ clip.name }}
				</div>

				<div
					v-if="selectedClipId"
					class="absolute top-0 left-0 w-full h-full border-2 border-blue-500 pointer-events-none"
				/>
			</div>

			<div v-else class="text-gray-500">
				No video project loaded
			</div>
		</div>

		<VideoPlayerControls
			v-if="currentVideoProject"
			:current-time="currentTime"
			:duration="currentVideoProject.duration"
			:is-playing="isPlaying"
			:volume="volume"
			:playback-speed="playbackSpeed"
			:is-fullscreen="isFullscreen"
			@toggle-playback="togglePlayback"
			@seek="seekTo"
			@seek-to-start="seekToStart"
			@seek-to-end="seekToEnd"
			@step-forward="stepForward"
			@step-backward="stepBackward"
			@update-volume="updateVolume"
			@update-playback-speed="updatePlaybackSpeed"
			@toggle-fullscreen="toggleFullscreen"
		/>
	</div>
</template>
