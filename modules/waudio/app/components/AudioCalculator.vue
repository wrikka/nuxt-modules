<script setup lang="ts">
const emit = defineEmits<{
	calculated: [result: { bpm: number; delayTime: number; frequency: number }];
}>();

// BPM Calculator
const tapTimes = ref<number[]>([]);
const calculatedBpm = ref(120);
const targetBpm = ref(120);

// Delay Calculator
const noteValues = ["1/1", "1/2", "1/4", "1/8", "1/16", "1/32"] as const;
const selectedNote = ref<typeof noteValues[number]>("1/4");
const dotted = ref(false);
const triplet = ref(false);
const calculatedDelay = ref(500);

// Frequency/Pitch Calculator
const baseFrequency = ref(440); // A4
const semitoneOffset = ref(0);
const calculatedFrequency = ref(440);

// Tap Tempo
const tapTempo = () => {
	const now = Date.now();
	tapTimes.value.push(now);

	// Keep only last 8 taps
	if (tapTimes.value.length > 8) {
		tapTimes.value.shift();
	}

	// Need at least 2 taps
	if (tapTimes.value.length < 2) {
		calculatedBpm.value = 0;
		return;
	}

	// Calculate average interval
	let totalInterval = 0;
	for (let i = 1; i < tapTimes.value.length; i++) {
		totalInterval += tapTimes.value[i]! - tapTimes.value[i - 1]!;
	}
	const avgInterval = totalInterval / (tapTimes.value.length - 1);

	// Convert to BPM (60000ms / interval)
	calculatedBpm.value = Math.round(60000 / avgInterval);

	emit("calculated", {
		bpm: calculatedBpm.value,
		delayTime: calculatedDelay.value,
		frequency: calculatedFrequency.value,
	});
};

const resetTap = () => {
	tapTimes.value = [];
	calculatedBpm.value = 0;
};

// Delay Time Calculator
watch([targetBpm, selectedNote, dotted, triplet], () => {
	const bpm = targetBpm.value;
	const beatDuration = 60000 / bpm; // ms per beat (quarter note)

	const noteMultipliers: Record<typeof selectedNote.value, number> = {
		"1/1": 4,
		"1/2": 2,
		"1/4": 1,
		"1/8": 0.5,
		"1/16": 0.25,
		"1/32": 0.125,
	};

	let delay = beatDuration * noteMultipliers[selectedNote.value];

	if (dotted.value) {
		delay *= 1.5;
	} else if (triplet.value) {
		delay *= 2 / 3;
	}

	calculatedDelay.value = Math.round(delay * 100) / 100;
}, { immediate: true });

// Frequency Calculator
watch([baseFrequency, semitoneOffset], () => {
	// f = f0 * 2^(n/12)
	const ratio = Math.pow(2, semitoneOffset.value / 12);
	calculatedFrequency.value = Math.round(baseFrequency.value * ratio * 100)
		/ 100;
}, { immediate: true });

// Common delay times table
const commonBpmValues = [60, 80, 90, 100, 120, 128, 140, 160];
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Audio Calculator</span>
		</div>

		<!-- BPM / Tap Tempo -->
		<div class="bg-gray-800 rounded p-3 mb-3">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-400 text-xs">Tap Tempo</span>
				<button
					@click="resetTap"
					class="text-xs text-gray-500 hover:text-gray-300"
				>
					Reset
				</button>
			</div>
			<div class="flex items-center gap-3">
				<button
					@click="tapTempo"
					class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded text-lg font-bold transition-colors"
				>
					TAP
				</button>
				<div class="text-center min-w-[60px]">
					<div class="text-2xl font-bold text-white">
						{{ calculatedBpm || "--" }}
					</div>
					<div class="text-xs text-gray-500">BPM</div>
				</div>
			</div>
			<div class="flex gap-1 mt-2">
				<div
					v-for="i in 8"
					:key="i"
					class="h-1 flex-1 rounded"
					:class="i <= tapTimes.length ? 'bg-blue-500' : 'bg-gray-700'"
				/>
			</div>
		</div>

		<!-- Delay Calculator -->
		<div class="bg-gray-800 rounded p-3 mb-3">
			<div class="text-gray-400 text-xs mb-2">Delay Time Calculator</div>

			<div class="grid grid-cols-2 gap-2 mb-2">
				<div>
					<label class="text-xs text-gray-500">Target BPM</label>
					<input
						v-model.number="targetBpm"
						type="number"
						min="30"
						max="300"
						class="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
					>
				</div>
				<div>
					<label class="text-xs text-gray-500">Note Value</label>
					<select
						v-model="selectedNote"
						class="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
					>
						<option v-for="note in noteValues" :key="note" :value="note">
							{{ note }}
						</option>
					</select>
				</div>
			</div>

			<div class="flex gap-2 mb-2">
				<label
					class="flex items-center gap-1 text-xs text-gray-400 cursor-pointer"
				>
					<input v-model="dotted" type="checkbox" class="accent-blue-500">
					Dotted
				</label>
				<label
					class="flex items-center gap-1 text-xs text-gray-400 cursor-pointer"
				>
					<input v-model="triplet" type="checkbox" class="accent-blue-500">
					Triplet
				</label>
			</div>

			<div class="text-center py-2 bg-gray-700/50 rounded">
				<div class="text-xl font-bold text-green-400">
					{{ calculatedDelay }} ms
				</div>
				<div class="text-xs text-gray-500">
					{{ selectedNote }}{{ dotted ? " dotted" : "" }}{{
						triplet ? " triplet" : ""
					}}
				</div>
			</div>
		</div>

		<!-- Frequency Calculator -->
		<div class="bg-gray-800 rounded p-3 mb-3">
			<div class="text-gray-400 text-xs mb-2">Frequency / Pitch</div>

			<div class="grid grid-cols-2 gap-2 mb-2">
				<div>
					<label class="text-xs text-gray-500">Base (Hz)</label>
					<input
						v-model.number="baseFrequency"
						type="number"
						step="0.1"
						class="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
					>
				</div>
				<div>
					<label class="text-xs text-gray-500">Semitones</label>
					<input
						v-model.number="semitoneOffset"
						type="number"
						min="-24"
						max="24"
						class="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
					>
				</div>
			</div>

			<div class="text-center py-2 bg-gray-700/50 rounded">
				<div class="text-xl font-bold text-purple-400">
					{{ calculatedFrequency }} Hz
				</div>
				<div class="text-xs text-gray-500">
					{{ semitoneOffset > 0 ? "+" : "" }}{{ semitoneOffset }} semitones
				</div>
			</div>
		</div>

		<!-- Quick Reference -->
		<div class="bg-gray-800 rounded p-3">
			<div class="text-gray-400 text-xs mb-2">Common BPM Values</div>
			<div class="grid grid-cols-4 gap-1">
				<button
					v-for="bpm in commonBpmValues"
					:key="bpm"
					@click="targetBpm = bpm"
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
				>
					{{ bpm }}
				</button>
			</div>
		</div>
	</div>
</template>
