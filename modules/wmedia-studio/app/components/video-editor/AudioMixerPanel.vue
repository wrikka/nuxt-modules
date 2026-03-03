<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	updateVolume: [trackId: string, volume: number];
	updatePan: [trackId: string, pan: number];
	muteTrack: [trackId: string];
	soloTrack: [trackId: string];
}>();

interface AudioTrack {
	id: string;
	name: string;
	volume: number;
	pan: number;
	muted: boolean;
	soloed: boolean;
	level: number;
	peak: number;
	type: "video" | "audio" | "music" | "voice";
}

const tracks = ref<AudioTrack[]>([
	{
		id: "1",
		name: "Main Audio",
		volume: 100,
		pan: 0,
		muted: false,
		soloed: false,
		level: 0,
		peak: 0,
		type: "video",
	},
	{
		id: "2",
		name: "Voiceover",
		volume: 85,
		pan: 0,
		muted: false,
		soloed: false,
		level: 0,
		peak: 0,
		type: "voice",
	},
	{
		id: "3",
		name: "Music",
		volume: 60,
		pan: 0,
		muted: false,
		soloed: false,
		level: 0,
		peak: 0,
		type: "music",
	},
	{
		id: "4",
		name: "Sound FX",
		volume: 75,
		pan: 10,
		muted: false,
		soloed: false,
		level: 0,
		peak: 0,
		type: "audio",
	},
]);

const masterVolume = ref(100);
const masterPeak = ref(0);

// Simulate audio levels
onMounted(() => {
	const interval = setInterval(() => {
		tracks.value.forEach(track => {
			track.level = track.muted ? 0 : Math.random() * track.volume * 0.8;
			track.peak = Math.max(track.peak * 0.95, track.level);
		});
		masterPeak.value = Math.max(
			masterPeak.value * 0.95,
			tracks.value.reduce((sum, t) => sum + t.level, 0) / tracks.value.length,
		);
	}, 50);

	onUnmounted(() => clearInterval(interval));
});

const getLevelColor = (level: number) => {
	if (level > 90) return "#ef4444"; // Red
	if (level > 70) return "#f59e0b"; // Yellow
	return "#22c55e"; // Green
};

const getTrackIcon = (type: AudioTrack["type"]): string => {
	const icons: Record<string, string> = {
		video: "i-ph-film-strip",
		audio: "i-ph-speaker-high",
		music: "i-ph-music-notes",
		voice: "i-ph-microphone",
	};
	return icons[type] ?? "i-ph-speaker-high";
};
</script>

<template>
	<div class="audio-mixer-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:tune" class="w-5 h-5 text-blue-500" />
				Audio Mixer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Mixer Channels -->
		<div class="flex gap-4 mb-4 overflow-x-auto pb-2">
			<!-- Track Channels -->
			<div
				v-for="track in tracks"
				:key="track.id"
				class="flex flex-col items-center gap-2 min-w-[60px]"
			>
				<!-- Track Name -->
				<div class="text-gray-700 dark:text-gray-300 text-xs text-center truncate w-full font-medium">
					{{ track.name }}
				</div>

				<!-- VU Meter -->
				<div class="h-32 w-4 bg-gray-200 dark:bg-gray-900 rounded-full relative overflow-hidden">
					<div
						class="absolute bottom-0 w-full rounded-full transition-all duration-75"
						:style="{
							height: `${track.level}%`,
							backgroundColor: getLevelColor(track.level),
						}"
					/>
					<!-- Peak indicator -->
					<div
						class="absolute w-full h-0.5 bg-white/50 transition-all duration-150"
						:style="{ bottom: `${track.peak}%` }"
					/>
				</div>

				<!-- Volume Fader -->
				<input
					v-model="track.volume"
					type="range"
					min="0"
					max="150"
					class="h-24 w-2 appearance-none cursor-pointer accent-blue-500"
					style="writing-mode: bt-lr; -webkit-appearance: slider-vertical; appearance: slider-vertical"
					@input="emit('updateVolume', track.id, track.volume)"
				>

				<!-- Volume Value -->
				<div class="text-gray-500 dark:text-gray-400 text-xs font-mono">
					{{ track.volume }}
				</div>

				<!-- Pan Control -->
				<input
					v-model="track.pan"
					type="range"
					min="-50"
					max="50"
					class="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
					@input="emit('updatePan', track.id, track.pan)"
				>

				<!-- Mute/Solo -->
				<div class="flex gap-1">
					<button
						class="w-6 h-6 rounded text-xs font-bold transition-colors"
						:class="track.muted
						? 'bg-red-500 text-white'
						: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'"
						@click='track.muted = !track.muted;
						emit("muteTrack", track.id);'
					>
						M
					</button>
					<button
						class="w-6 h-6 rounded text-xs font-bold transition-colors"
						:class="track.soloed
						? 'bg-yellow-500 text-white'
						: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'"
						@click='track.soloed = !track.soloed;
						emit("soloTrack", track.id);'
					>
						S
					</button>
				</div>

				<!-- Track Icon -->
				<span
					:class="[
						getTrackIcon(track.type),
						'w-4 h-4 text-gray-500 dark:text-gray-400',
					]"
				/>
			</div>

			<!-- Master Channel -->
			<div class="flex flex-col items-center gap-2 min-w-[60px] border-l border-gray-200 dark:border-gray-700 pl-4">
				<div class="text-blue-600 dark:text-blue-400 text-xs font-medium text-center">
					MASTER
				</div>

				<div class="h-32 w-6 bg-gray-200 dark:bg-gray-900 rounded-full relative overflow-hidden">
					<div
						class="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-75"
						:style="{ height: `${masterPeak}%` }"
					/>
				</div>

				<input
					v-model="masterVolume"
					type="range"
					min="0"
					max="150"
					class="h-24 w-2 appearance-none cursor-pointer accent-blue-500"
					style="writing-mode: bt-lr; -webkit-appearance: slider-vertical; appearance: slider-vertical"
				>

				<div class="text-blue-600 dark:text-blue-400 text-xs font-mono">
					{{ masterVolume }}
				</div>

				<Icon name="mdi:volume-high" class="w-5 h-5 text-blue-500" />
			</div>
		</div>

		<!-- Meters Legend -->
		<div class="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-green-500" />
				<span>Good (-18 to -6 dB)</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-yellow-500" />
				<span>Warning (-6 to 0 dB)</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-red-500" />
				<span>Clipping (0+ dB)</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
input[type="range"][style*="slider-vertical"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #3b82f6;
	cursor: pointer;
}
</style>
