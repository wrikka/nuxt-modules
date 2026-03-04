<script setup lang="ts">
const emit = defineEmits<
	{ close: []; apply: [semitones: number, preserveFormant: boolean] }
>();
const semitones = ref(0);
const preserveFormant = ref(true);
const isPlaying = ref(false);

const presets = [
	{ name: "Deep Voice", value: -5 },
	{ name: "Chipmunk", value: 8 },
	{ name: "Monster", value: -12 },
	{ name: "Robot", value: 0 },
];

const apply = () => emit("apply", semitones.value, preserveFormant.value);
</script>

<template>
	<div class="audio-pitch-shifter bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:music" class="w-5 h-5 text-purple-500" />
				Audio Pitch Shifter
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
			<div
				class="text-5xl font-bold mb-2"
				:class="semitones > 0
				? 'text-red-500'
				: semitones < 0
				? 'text-blue-500'
				: 'text-gray-500'"
			>
				{{ semitones > 0 ? "+" : "" }}{{ semitones }}
			</div>
			<div class="text-gray-500 dark:text-gray-400 text-sm">semitones</div>
		</div>
		<div class="mb-4">
			<input
				v-model="semitones"
				type="range"
				min="-24"
				max="24"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
			<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
				<span>-24 (Lower)</span>
				<span>0</span>
				<span>+24 (Higher)</span>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Presets</label>
			<div class="flex gap-2">
				<button
					v-for="p in presets"
					:key="p.name"
					class="flex-1 p-2 rounded-lg text-center text-sm transition-all"
					:class="semitones === p.value
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="semitones = p.value"
				>
					{{ p.name }}
				</button>
			</div>
		</div>
		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-900 dark:text-white text-sm"
			>Preserve Formant</span>
			<input
				v-model="preserveFormant"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
		</label>
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-colors"
				:class="isPlaying ? 'bg-purple-100 dark:bg-purple-900/30' : ''"
				@click="isPlaying = !isPlaying"
			>
				<Icon
					:name="isPlaying ? 'mdi:pause' : 'mdi:play'"
					class="w-4 h-4 inline-block mr-2"
				/>{{ isPlaying ? "Pause" : "Preview" }}
			</button>
			<button
				class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="apply"
			>
				Apply
			</button>
		</div>
	</div>
</template>
