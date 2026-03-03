<script setup lang="ts">
const emit = defineEmits<
	{ close: []; interpolate: [fps: number, mode: string] }
>();
const fps = ref(60);
const mode = ref("smooth");
const isProcessing = ref(false);
const progress = ref(0);

const modes = [{ id: "smooth", name: "Smooth Motion" }, {
	id: "cinematic",
	name: "Cinematic",
}, { id: "sport", name: "Sport/Action" }];

const interpolate = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 8;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("interpolate", fps.value, mode.value);
		}
	}, 150);
};
</script>
<template>
	<div class="ai-frame-interpolation bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:aperture" class="w-5 h-5 text-purple-500" />
				AI Frame Interpolation
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Target FPS</span>
				<span class="text-purple-500 font-medium">{{ fps }} fps</span>
			</div>
			<input
				v-model="fps"
				type="range"
				min="30"
				max="120"
				step="15"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span>30fps</span><span>120fps</span>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Interpolation Mode</label>
			<div class="space-y-2">
				<button
					v-for="m in modes"
					:key="m.id"
					class="w-full p-3 rounded-lg flex items-center gap-3 transition-all"
					:class="mode === m.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50'"
					@click="mode = m.id"
				>
					<div
						class="w-2 h-2 rounded-full"
						:class="mode === m.id ? 'bg-purple-500' : 'bg-gray-400'"
					/>
					<span class="text-gray-900 dark:text-white text-sm">{{
						m.name
					}}</span>
				</button>
			</div>
		</div>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Generating frames...</span>
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
			@click="interpolate"
		>
			Apply Interpolation
		</button>
	</div>
</template>
