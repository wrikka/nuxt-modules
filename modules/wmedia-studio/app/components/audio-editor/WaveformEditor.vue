<script setup lang="ts">
const emit = defineEmits<{ close: []; zoom: []; normalize: []; trim: [] }>();
const zoom = ref(100);
const audioData = ref(Array.from({ length: 100 }, () => Math.random() * 0.8));
const selection = ref({ start: 30, end: 60 });
const isPlaying = ref(false);

const normalize = () => {
	audioData.value = audioData.value.map(v => Math.min(1, v * 1.2));
	emit("normalize");
};
const trim = () => {
	emit("trim");
};
</script>
<template>
	<div class="waveform-editor bg-gray-800 rounded-lg p-4 w-[600px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-wave-sine" class="w-5 h-5" />Audio Waveform Editor
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div
			class="h-32 bg-gray-900 rounded-lg mb-4 relative overflow-hidden cursor-crosshair"
			@click="emit('zoom')"
		>
			<div class="absolute inset-0 flex items-center gap-px">
				<div
					v-for="(amp, i) in audioData"
					:key="i"
					class="flex-1 bg-blue-500 rounded-full transition-all"
					:class="i >= selection.start && i <= selection.end
					? 'bg-purple-500'
					: 'bg-blue-500'"
					:style="{
						height: `${amp * 100}%`,
						opacity: i >= selection.start && i <= selection.end ? 1 : 0.5,
					}"
				/>
			</div>
			<div
				class="absolute top-0 bottom-0 w-0.5 bg-white/50"
				:style="{ left: `${selection.start}%` }"
			/>
			<div
				class="absolute top-0 bottom-0 w-0.5 bg-white/50"
				:style="{ left: `${selection.end}%` }"
			/>
		</div>
		<div class="flex gap-2 mb-4">
			<div class="flex-1">
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Zoom</span><span class="text-blue-400">{{
							zoom
						}}%</span>
				</div><input
					v-model="zoom"
					type="range"
					min="50"
					max="400"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<button
				class="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
				:class="isPlaying ? 'bg-red-600/50' : ''"
				@click="isPlaying = !isPlaying"
			>
				<Icon :name="isPlaying ? 'i-ph-pause' : 'i-ph-play'" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="normalize"
			>
				<Icon name="i-ph-wave-sine" class="w-4 h-4 inline mr-2" />Normalize
			</button>
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="trim"
			>
				<Icon name="i-ph-scissors" class="w-4 h-4 inline mr-2" />Trim Selection
			</button>
		</div>
	</div>
</template>
