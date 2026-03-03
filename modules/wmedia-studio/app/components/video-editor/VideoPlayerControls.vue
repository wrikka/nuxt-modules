<script setup lang="ts">
interface Props {
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	volume: number;
	playbackSpeed: number;
	isFullscreen: boolean;
}

interface Emits {
	(e: "togglePlayback"): void;
	(e: "seek", time: number): void;
	(e: "seekToStart"): void;
	(e: "seekToEnd"): void;
	(e: "stepForward"): void;
	(e: "stepBackward"): void;
	(e: "updateVolume", volume: number): void;
	(e: "updatePlaybackSpeed", speed: number): void;
	(e: "toggleFullscreen"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const seekBar = ref<HTMLElement | null>(null);

const progressPercentage = computed(() => {
	if (props.duration === 0) return 0;
	return (props.currentTime / props.duration) * 100;
});

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const frames = Math.floor((seconds % 1) * 30);
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}:${frames.toString().padStart(2, "0")}`;
};

const onSeekBarClick = (event: MouseEvent) => {
	if (!seekBar.value) return;

	const rect = seekBar.value.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const percentage = x / rect.width;
	const time = percentage * props.duration;
	emit("seek", time);
};

const onVolumeChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("updateVolume", Number(target.value));
};

const onPlaybackSpeedChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	emit("updatePlaybackSpeed", Number(target.value));
};

const toggleMute = () => {
	if (props.volume === 0) {
		emit("updateVolume", 100);
	} else {
		emit("updateVolume", 0);
	}
};
</script>

<template>
	<div class="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center gap-4">
		<button
			@click="$emit('seekToStart')"
			class="text-gray-300 hover:text-white transition-colors"
			title="Go to start"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
				<path d="M3 3v5h5" />
			</svg>
		</button>

		<button
			@click="$emit('stepBackward')"
			class="text-gray-300 hover:text-white transition-colors"
			title="Step backward"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="19 20 9 12 19 4 19 20" />
				<line x1="5" y1="19" x2="5" y2="5" />
			</svg>
		</button>

		<button
			@click="$emit('togglePlayback')"
			class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
			:title="isPlaying ? 'Pause' : 'Play'"
		>
			<svg
				v-if="isPlaying"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<rect x="6" y="4" width="4" height="16" />
				<rect x="14" y="4" width="4" height="16" />
			</svg>
			<svg
				v-else
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<polygon points="5 3 19 12 5 21 5 3" />
			</svg>
		</button>

		<button
			@click="$emit('stepForward')"
			class="text-gray-300 hover:text-white transition-colors"
			title="Step forward"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="5 4 15 12 5 20 5 4" />
				<line x1="19" y1="5" x2="19" y2="19" />
			</svg>
		</button>

		<button
			@click="$emit('seekToEnd')"
			class="text-gray-300 hover:text-white transition-colors"
			title="Go to end"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
			</svg>
		</button>

		<div class="flex-1 flex items-center gap-3">
			<span class="text-gray-300 text-sm font-mono min-w-[80px]">{{
				formatTime(currentTime)
			}}</span>

			<div
				ref="seekBar"
				class="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer relative group"
				@click="onSeekBarClick"
			>
				<div
					class="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all"
					:style="{ width: `${progressPercentage}%` }"
				/>

				<div
					class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
					:style="{
						left: `${progressPercentage}%`,
						transform: 'translate(-50%, -50%)',
					}"
				/>
			</div>

			<span class="text-gray-300 text-sm font-mono min-w-[80px]">{{
				formatTime(duration)
			}}</span>
		</div>

		<div class="flex items-center gap-2">
			<button
				@click="toggleMute"
				class="text-gray-300 hover:text-white transition-colors"
				:title="volume === 0 ? 'Unmute' : 'Mute'"
			>
				<svg
					v-if="volume === 0"
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
					<line x1="23" y1="9" x2="17" y2="15" />
					<line x1="17" y1="9" x2="23" y2="15" />
				</svg>
				<svg
					v-else-if="volume < 50"
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				</svg>
				<svg
					v-else
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
					<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
				</svg>
			</button>

			<div class="w-20 relative">
				<input
					type="range"
					min="0"
					max="100"
					:value="volume"
					@input="onVolumeChange"
					class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
				/>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<select
				:value="playbackSpeed"
				@change="onPlaybackSpeedChange"
				class="bg-gray-700 text-gray-300 text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
			>
				<option value="0.25">0.25x</option>
				<option value="0.5">0.5x</option>
				<option value="0.75">0.75x</option>
				<option value="1">1x</option>
				<option value="1.25">1.25x</option>
				<option value="1.5">1.5x</option>
				<option value="2">2x</option>
			</select>
		</div>

		<button
			@click="$emit('toggleFullscreen')"
			class="text-gray-300 hover:text-white transition-colors"
			:title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
		>
			<svg
				v-if="isFullscreen"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
			</svg>
			<svg
				v-else
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
				<line x1="7" y1="2" x2="7" y2="22" />
				<line x1="17" y1="2" x2="17" y2="22" />
				<line x1="2" y1="12" x2="22" y2="12" />
				<line x1="2" y1="7" x2="7" y2="7" />
				<line x1="2" y1="17" x2="7" y2="17" />
				<line x1="17" y1="17" x2="22" y2="17" />
				<line x1="17" y1="7" x2="22" y2="7" />
			</svg>
		</button>
	</div>
</template>
