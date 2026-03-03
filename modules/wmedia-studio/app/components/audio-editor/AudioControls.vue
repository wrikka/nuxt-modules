<script setup lang="ts">
const {
	isPlaying,
	currentTime,
	duration,
	volume,
	isLooping,
	formatTime,
	play,
	pause,
	stop,
	seek,
	setVolume,
	toggleLoop,
} = useAudioEditor();

const localVolume = ref(volume.value);
const localCurrentTime = ref(currentTime.value);

watch(volume, (val) => {
	localVolume.value = val;
});

watch(currentTime, (val) => {
	localCurrentTime.value = val;
});

const handlePlayPause = async () => {
	if (isPlaying.value) {
		pause();
	} else {
		await play();
	}
};

const handleStop = () => {
	stop();
};

const handleLoop = () => {
	toggleLoop();
};

const handleVolumeChange = () => {
	setVolume(localVolume.value);
};

const handleSeek = () => {
	seek(localCurrentTime.value);
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<button
					@click="handleStop"
					class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
					title="Stop"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<rect x="6" y="6" width="12" height="12" rx="1" />
					</svg>
				</button>
				<button
					@click="handlePlayPause"
					class="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
					:title="isPlaying ? 'Pause' : 'Play'"
				>
					<svg
						v-if="!isPlaying"
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M8 5v14l11-7z" />
					</svg>
					<svg
						v-else
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
					</svg>
				</button>
				<button
					@click="handleLoop"
					:class="[
						'p-2 rounded transition-colors',
						isLooping
							? 'text-blue-400 bg-blue-900/30'
							: 'text-gray-400 hover:text-white hover:bg-gray-800',
					]"
					title="Loop"
				>
					<svg
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</button>
			</div>

			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
						/>
					</svg>
					<input
						v-model.number="localVolume"
						type="range"
						min="0"
						max="1"
						step="0.01"
						class="w-24 accent-blue-500"
						@input="handleVolumeChange"
					>
					<span class="text-gray-400 text-sm w-12">{{
							Math.round(volume * 100)
						}}%</span>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<span class="text-white text-lg font-mono">{{
					formatTime(currentTime)
				}}</span>
				<span class="text-gray-500">/</span>
				<span class="text-gray-400 text-lg font-mono">{{
					formatTime(duration)
				}}</span>
			</div>
		</div>

		<div class="mt-3">
			<input
				v-model.number="localCurrentTime"
				type="range"
				min="0"
				:max="duration"
				step="0.01"
				class="w-full accent-blue-500 cursor-pointer"
				@input="handleSeek"
			>
		</div>
	</div>
</template>
