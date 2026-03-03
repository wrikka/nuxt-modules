<script setup lang="ts">
interface Keyframe {
	id: string;
	time: number;
	properties: Record<string, number | string>;
}

interface AnimationLayer {
	id: string;
	name: string;
	keyframes: Keyframe[];
	visible: boolean;
	locked: boolean;
}

const layers = ref<AnimationLayer[]>([
	{
		id: "1",
		name: "Logo",
		keyframes: [{ id: "k1", time: 0, properties: { x: 0, opacity: 0 } }, {
			id: "k2",
			time: 1,
			properties: { x: 100, opacity: 1 },
		}],
		visible: true,
		locked: false,
	},
	{
		id: "2",
		name: "Title Text",
		keyframes: [{ id: "k3", time: 0.5, properties: { y: 0, scale: 0.8 } }, {
			id: "k4",
			time: 1.5,
			properties: { y: -20, scale: 1 },
		}],
		visible: true,
		locked: false,
	},
	{
		id: "3",
		name: "Background",
		keyframes: [{ id: "k5", time: 0, properties: { color: "#000" } }, {
			id: "k6",
			time: 2,
			properties: { color: "#fff" },
		}],
		visible: true,
		locked: true,
	},
]);

const currentTime = ref(0);
const duration = ref(3);
const isPlaying = ref(false);
const selectedLayer = ref<string | null>(null);

const togglePlay = () => {
	isPlaying.value = !isPlaying.value;
};

const formatTime = (t: number) => {
	const secs = Math.floor(t);
	const ms = Math.floor((t - secs) * 100);
	return `${secs}:${ms.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Animation Timeline
			</h3>
			<div class="flex items-center gap-2">
				<button
					@click="togglePlay"
					class="p-2 bg-blue-500 text-white rounded-lg"
				>
					<Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-5 h-5" />
				</button>
				<button class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
					<Icon name="mdi:skip-previous" class="w-5 h-5" />
				</button>
				<button class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
					<Icon name="mdi:skip-next" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Time Display -->
		<div class="flex items-center justify-between mb-4 px-2">
			<span class="font-mono text-lg">{{ formatTime(currentTime) }}</span>
			<span class="font-mono text-gray-500">/ {{ formatTime(duration) }}</span>
		</div>

		<!-- Timeline Scrubber -->
		<div class="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
			<div
				class="absolute inset-y-0 left-0 bg-blue-500/30"
				:style="{ width: `${(currentTime / duration) * 100}%` }"
			/>
			<input
				v-model.number="currentTime"
				type="range"
				min="0"
				:max="duration"
				step="0.01"
				class="absolute inset-0 w-full opacity-0 cursor-pointer"
			/>
			<div
				class="absolute top-0 bottom-0 w-0.5 bg-blue-500"
				:style="{ left: `${(currentTime / duration) * 100}%` }"
			/>
		</div>

		<!-- Layer List -->
		<div class="space-y-2">
			<div
				v-for="layer in layers"
				:key="layer.id"
				@click="selectedLayer = layer.id"
				:class="{ 'ring-2 ring-blue-500': selectedLayer === layer.id }"
				class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<button
					@click.stop="layer.visible = !layer.visible"
					class="text-gray-500 hover:text-gray-700"
				>
					<Icon
						:name="layer.visible ? 'mdi:eye' : 'mdi:eye-off'"
						class="w-4 h-4"
					/>
				</button>
				<button
					@click.stop="layer.locked = !layer.locked"
					class="text-gray-500 hover:text-gray-700"
				>
					<Icon
						:name="layer.locked ? 'mdi:lock' : 'mdi:lock-open'"
						class="w-4 h-4"
					/>
				</button>
				<span class="flex-1 text-sm font-medium">{{ layer.name }}</span>
				<div class="flex gap-1">
					<div
						v-for="kf in layer.keyframes"
						:key="kf.id"
						class="w-2 h-4 bg-blue-500 rounded-sm"
					/>
				</div>
			</div>
		</div>

		<!-- Add Keyframe Button -->
		<button class="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
			<Icon name="mdi:plus" class="w-4 h-4" />
			Add Keyframe
		</button>
	</div>
</template>
