<script setup lang="ts">
import type { BeatPattern } from "#shared/types/audio";
import { nanoid } from "nanoid";

const emit = defineEmits<{
	playPattern: [pattern: BeatPattern];
	exportPattern: [pattern: BeatPattern];
}>();

const bpm = ref(120);
const currentStep = ref(0);
const isPlaying = ref(false);
const selectedKit = ref<"808" | "909" | "acoustic">("808");

const drumSounds = {
	"808": ["Kick", "Snare", "Hi-Hat", "Clap", "Tom", "Crash", "Ride", "Cowbell"],
	"909": [
		"Kick",
		"Snare",
		"Hi-Hat",
		"Clap",
		"Low Tom",
		"Mid Tom",
		"Hi Tom",
		"Crash",
	],
	"acoustic": [
		"Kick",
		"Snare",
		"Hi-Hat",
		"Tom 1",
		"Tom 2",
		"Floor Tom",
		"Crash",
		"Ride",
	],
};

const numSteps = 16;
const sounds = computed(() => drumSounds[selectedKit.value]);

// Grid: sound index -> step index -> boolean
const grid = ref<boolean[][]>(
	Array.from(
		{ length: 8 },
		() => Array.from({ length: numSteps }, () => false),
	),
);

const patterns = ref<BeatPattern[]>([
	{ id: "1", name: "Basic House", bpm: 128, steps: [], sounds: [] },
	{ id: "2", name: "Hip Hop", bpm: 90, steps: [], sounds: [] },
	{ id: "3", name: "Techno", bpm: 140, steps: [], sounds: [] },
]);

const toggleStep = (soundIndex: number, stepIndex: number) => {
	if (grid.value[soundIndex]?.[stepIndex] !== undefined) {
		grid.value[soundIndex][stepIndex] = !grid.value[soundIndex][stepIndex];
	}
};

const clearPattern = () => {
	grid.value = Array.from(
		{ length: 8 },
		() => Array.from({ length: numSteps }, () => false),
	);
};

const playPattern = () => {
	isPlaying.value = !isPlaying.value;
	if (isPlaying.value) {
		emit("playPattern", {
			id: nanoid(),
			name: "Custom Pattern",
			bpm: bpm.value,
			steps: grid.value,
			sounds: sounds.value,
		});
	}
};

const savePattern = () => {
	const pattern: BeatPattern = {
		id: nanoid(),
		name: `Pattern ${patterns.value.length + 1}`,
		bpm: bpm.value,
		steps: grid.value.map(row => [...row]),
		sounds: [...sounds.value],
	};
	patterns.value.push(pattern);
};

const loadPattern = (pattern: BeatPattern) => {
	bpm.value = pattern.bpm;
	if (pattern.steps.length > 0) {
		grid.value = pattern.steps.map(row => [...row]);
	}
};

// Playback animation
let playInterval: number | null = null;

watch(isPlaying, (playing) => {
	if (playing) {
		const stepDuration = 60000 / bpm.value / 4; // 16th notes
		playInterval = window.setInterval(() => {
			currentStep.value = (currentStep.value + 1) % numSteps;
		}, stepDuration);
	} else if (playInterval) {
		clearInterval(playInterval);
		playInterval = null;
		currentStep.value = 0;
	}
});

onUnmounted(() => {
	if (playInterval) {
		clearInterval(playInterval);
	}
});
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>Beat Maker / Pattern Sequencer</span>
		</div>

		<!-- Controls -->
		<div class="flex items-center gap-4 mb-4">
			<div class="flex items-center gap-2">
				<label class="text-xs text-gray-400">Kit:</label>
				<select
					v-model="selectedKit"
					class="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700"
				>
					<option value="808">808</option>
					<option value="909">909</option>
					<option value="acoustic">Acoustic</option>
				</select>
			</div>

			<div class="flex items-center gap-2">
				<label class="text-xs text-gray-400">BPM:</label>
				<input
					v-model.number="bpm"
					type="number"
					min="60"
					max="200"
					class="w-16 bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700"
				>
			</div>

			<div class="flex-1"></div>

			<button
				@click="playPattern"
				:class="[
					'px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1',
					isPlaying
						? 'bg-red-600 hover:bg-red-700 text-white'
						: 'bg-green-600 hover:bg-green-700 text-white',
				]"
			>
				<svg
					v-if="!isPlaying"
					class="w-4 h-4"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M8 5v14l11-7z" />
				</svg>
				<svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
				</svg>
				{{ isPlaying ? "Stop" : "Play" }}
			</button>
		</div>

		<!-- Step Grid -->
		<div class="bg-gray-800 rounded p-3 overflow-x-auto">
			<div class="min-w-max">
				<!-- Step numbers -->
				<div class="flex gap-1 mb-1 ml-20">
					<div
						v-for="i in numSteps"
						:key="i"
						class="w-6 text-center text-xs"
						:class="[
							(i - 1) % 4 === 0 ? 'text-gray-300 font-bold' : 'text-gray-500',
							currentStep === i - 1 && isPlaying ? 'text-green-400' : '',
						]"
					>
						{{ i }}
					</div>
				</div>

				<!-- Drum rows -->
				<div
					v-for="(sound, soundIndex) in sounds"
					:key="sound"
					class="flex items-center gap-1 mb-1"
				>
					<div class="w-20 text-xs text-gray-400 text-right pr-2">
						{{ sound }}
					</div>
					<div class="flex gap-1">
						<button
							v-for="(_, stepIndex) in numSteps"
							:key="stepIndex"
							@click="toggleStep(soundIndex, stepIndex)"
							:class="[
								'w-6 h-8 rounded transition-all',
								grid[soundIndex]?.[stepIndex]
									? 'bg-blue-500 shadow-lg shadow-blue-500/50'
									: 'bg-gray-700 hover:bg-gray-600',
								currentStep === stepIndex && isPlaying
									? 'ring-2 ring-green-400'
									: '',
								stepIndex % 4 === 3 ? 'mr-1' : '',
							]"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 mt-4">
			<button
				@click="clearPattern"
				class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
			>
				Clear
			</button>
			<button
				@click="savePattern"
				class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
			>
				Save Pattern
			</button>
			<select
				class="flex-1 bg-gray-800 text-white rounded px-2 py-2 text-sm border border-gray-700"
				@change="(e) => {
					const pattern =
						patterns[(e.target as HTMLSelectElement).selectedIndex - 1];
					if (pattern) loadPattern(pattern);
				}"
			>
				<option>Load Pattern...</option>
				<option v-for="p in patterns" :key="p.id">
					{{ p.name }} ({{ p.bpm }} BPM)
				</option>
			</select>
		</div>
	</div>
</template>
