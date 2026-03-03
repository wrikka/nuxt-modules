<script setup lang="ts">
const emit = defineEmits<{ close: []; restore: [settings: any] }>();
const damageType = ref("scratches");
const intensity = ref(70);
const enhanceColors = ref(true);
const stabilize = ref(false);
const isProcessing = ref(false);
const progress = ref(0);

const damageTypes = [
	{ id: "scratches", name: "Scratches & Dust" },
	{ id: "flicker", name: "Flicker Reduction" },
	{ id: "grain", name: "Grain Removal" },
	{ id: "tears", name: "Frame Tears" },
	{ id: "color", name: "Color Fading" },
];

const restore = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("restore", { type: damageType.value, intensity: intensity.value });
		}
	}, 100);
};
</script>

<template>
	<div class="ai-video-restoration bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:film" class="w-5 h-5 text-purple-500" />
				AI Video Restoration
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Restoration Preview
			</div>
			<div class="absolute bottom-2 left-2 px-2 py-1 bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300 text-xs rounded font-medium">
				Before/After
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Damage Type</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="t in damageTypes"
					:key="t.id"
					class="p-2 rounded-lg text-center text-sm transition-all"
					:class="damageType === t.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="damageType = t.id"
				>
					{{ t.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Restoration Strength</span>
				<span class="text-purple-500 font-medium">{{ intensity }}%</span>
			</div>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="space-y-2 mb-4">
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-900 dark:text-white text-sm"
				>Auto Color Enhance</span>
				<input
					v-model="enhanceColors"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				>
			</label>
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-900 dark:text-white text-sm"
				>Stabilize Shaky Footage</span>
				<input
					v-model="stabilize"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				>
			</label>
		</div>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Restoring...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="restore"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Restore Video
		</button>
	</div>
</template>
