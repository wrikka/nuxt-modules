<script setup lang="ts">
interface AnimationKeyframe {
	id: string;
	time: number;
	properties: Record<string, unknown>;
}

interface AnimationTrack {
	id: string;
	name: string;
	elementId: string;
	keyframes: AnimationKeyframe[];
	color: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	play: [];
	pause: [];
	seek: [time: number];
}>();

const tracks = ref<AnimationTrack[]>([
	{
		id: "t1",
		name: "Hero Text",
		elementId: "hero",
		keyframes: [{ id: "k1", time: 0, properties: { opacity: 0 } }, {
			id: "k2",
			time: 1000,
			properties: { opacity: 1 },
		}],
		color: "bg-blue-500",
	},
	{
		id: "t2",
		name: "Button",
		elementId: "cta",
		keyframes: [{ id: "k3", time: 500, properties: { scale: 0.8 } }, {
			id: "k4",
			time: 1500,
			properties: { scale: 1 },
		}],
		color: "bg-green-500",
	},
	{
		id: "t3",
		name: "Image",
		elementId: "img",
		keyframes: [{ id: "k5", time: 0, properties: { x: -100 } }, {
			id: "k6",
			time: 2000,
			properties: { x: 0 },
		}],
		color: "bg-purple-500",
	},
]);

const currentTime = ref(0);
const duration = ref(5000);
const isPlaying = ref(false);
const zoom = ref(1);

const formatTime = (ms: number) => {
	const seconds = Math.floor(ms / 1000);
	const msRemainder = Math.floor((ms % 1000) / 10);
	return `${seconds}:${msRemainder.toString().padStart(2, "0")}`;
};

const play = () => {
	isPlaying.value = true;
	emit("play");
};

const pause = () => {
	isPlaying.value = false;
	emit("pause");
};

const togglePlay = () => {
	if (isPlaying.value) {
		pause();
	} else {
		play();
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed bottom-0 left-0 right-0 h-72 bg-gray-900 border-t border-gray-800 shadow-2xl z-50 flex flex-col"
	>
		<!-- Header / Transport -->
		<div class="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/50">
			<div class="flex items-center gap-4">
				<h3 class="font-semibold text-white flex items-center gap-2">
					<Icon name="mdi:movie" class="w-5 h-5 text-pink-400" />
					Animation Timeline
				</h3>

				<div class="flex items-center gap-2">
					<button
						class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						@click="currentTime = 0"
					>
						<Icon name="mdi:skip-backward" class="w-4 h-4 text-gray-400" />
					</button>
					<button
						class="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
						@click="togglePlay"
					>
						<Icon
							:name="isPlaying ? 'mdi:pause' : 'mdi:play'"
							class="w-4 h-4 text-white"
						/>
					</button>
					<button
						class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						@click="currentTime = duration"
					>
						<Icon name="mdi:skip-forward" class="w-4 h-4 text-gray-400" />
					</button>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<span class="font-mono text-sm text-gray-400">{{
						formatTime(currentTime)
					}} / {{ formatTime(duration) }}</span>
				<input
					v-model="currentTime"
					type="range"
					min="0"
					:max="duration"
					class="w-48 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
					@input="emit('seek', currentTime)"
				>
				<div class="flex items-center gap-2">
					<span class="text-xs text-gray-400">{{
							Math.round(zoom * 100)
						}}%</span>
					<input
						v-model="zoom"
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						class="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
					>
				</div>
				<button
					class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-400" />
				</button>
			</div>
		</div>

		<!-- Timeline Tracks -->
		<div class="flex-1 overflow-auto">
			<div class="flex min-w-full">
				<!-- Track Names -->
				<div class="w-48 bg-gray-800 border-r border-gray-700 flex-shrink-0">
					<div class="h-8 border-b border-gray-700 flex items-center px-4 text-xs text-gray-400 font-medium">
						Layers
					</div>
					<div
						v-for="track in tracks"
						:key="track.id"
						class="h-12 border-b border-gray-700 flex items-center px-4 hover:bg-gray-700/50 cursor-pointer"
					>
						<div class="flex items-center gap-2">
							<div :class="['w-3 h-3 rounded-full', track.color]" />
							<span class="text-sm text-gray-300 truncate">{{
								track.name
							}}</span>
						</div>
					</div>
				</div>

				<!-- Timeline -->
				<div
					class="flex-1 relative"
					:style="{ minWidth: `${duration * zoom / 10}px` }"
				>
					<!-- Time Ruler -->
					<div class="h-8 border-b border-gray-700 flex relative bg-gray-800/30">
						<div
							v-for="i in Math.ceil(duration / 1000) + 1"
							:key="i"
							class="absolute top-0 bottom-0 border-l border-gray-600 flex items-center px-1 text-xs text-gray-500"
							:style="{ left: `${(i - 1) * 1000 * zoom / 10}px` }"
						>
							{{ i - 1 }}s
						</div>
					</div>

					<!-- Track Lanes -->
					<div
						v-for="track in tracks"
						:key="track.id"
						class="h-12 border-b border-gray-700 relative hover:bg-gray-800/30"
					>
						<!-- Keyframes -->
						<div
							v-for="keyframe in track.keyframes"
							:key="keyframe.id"
							class="absolute top-1/2 -translate-y-1/2 w-3 h-3 -ml-1.5 rounded-full border-2 border-gray-900 cursor-pointer hover:scale-125 transition-transform"
							:class="track.color"
							:style="{ left: `${keyframe.time * zoom / 10}px` }"
							title="Keyframe"
						/>
					</div>

					<!-- Playhead -->
					<div
						class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
						:style="{ left: `${currentTime * zoom / 10}px` }"
					>
						<div class="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
