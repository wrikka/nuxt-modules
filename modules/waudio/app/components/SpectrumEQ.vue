<script setup lang="ts">
const props = defineProps<{
	numBands?: 10 | 31;
	onChange?: (values: number[]) => void;
}>();

const numBands = props.numBands || 10;

// Frequency bands
const bands10 = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const bands31 = [
	20,
	25,
	31,
	40,
	50,
	63,
	80,
	100,
	125,
	160,
	200,
	250,
	315,
	400,
	500,
	630,
	800,
	1000,
	1250,
	1600,
	2000,
	2500,
	3150,
	4000,
	5000,
	6300,
	8000,
	10000,
	12500,
	16000,
	20000,
];

const frequencies = numBands === 31 ? bands31 : bands10;
const values = ref<number[]>(
	Array.from({ length: frequencies.length }, () => 0),
);
const isDragging = ref(false);
const spectrumData = ref<number[]>(
	Array.from({ length: frequencies.length }, () => 0),
);

const formatFrequency = (freq: number): string => {
	if (freq >= 1000) {
		return `${(freq / 1000).toFixed(freq >= 10000 ? 0 : 1)}k`;
	}
	return `${freq}`;
};

const updateValue = (index: number, value: number) => {
	values.value[index] = Math.max(-12, Math.min(12, value));
	props.onChange?.(values.value);
};

const resetAll = () => {
	values.value = Array.from({ length: frequencies.length }, () => 0);
	props.onChange?.(values.value);
};

const resetBand = (index: number) => {
	values.value[index] = 0;
	props.onChange?.(values.value);
};

// Simulate spectrum animation
let animationId: number;
const animateSpectrum = () => {
	spectrumData.value = spectrumData.value.map(() => Math.random() * 0.5 + 0.2);
	animationId = requestAnimationFrame(() => {
		setTimeout(animateSpectrum, 100);
	});
};

onMounted(() => {
	animateSpectrum();
});

onUnmounted(() => {
	cancelAnimationFrame(animationId);
});

const presets = [
	{ name: "Flat", values: Array.from({ length: frequencies.length }, () => 0) },
	{
		name: "Bass Boost",
		values: frequencies.map((_, i) => i < frequencies.length * 0.3 ? 6 : 0),
	},
	{
		name: "Treble Boost",
		values: frequencies.map((_, i) => i > frequencies.length * 0.7 ? 6 : 0),
	},
	{
		name: "V-Shape",
		values: frequencies.map((_, i) => {
			const mid = frequencies.length / 2;
			return Math.abs(i - mid) / mid * 6;
		}),
	},
	{
		name: "Vocals",
		values: frequencies.map((f) => f >= 250 && f <= 4000 ? 3 : -2),
	},
];

const applyPreset = (preset?: typeof presets[0]) => {
	if (!preset) return;
	values.value = [...preset.values];
	props.onChange?.(values.value);
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>Spectrum EQ ({{ numBands }}-band)</span>
			<div class="flex items-center gap-2">
				<select
					class="bg-gray-800 text-gray-300 rounded px-2 py-1 text-xs border border-gray-700"
					@change="(e) =>
					applyPreset(presets[(e.target as HTMLSelectElement).selectedIndex])"
				>
					<option v-for="preset in presets" :key="preset.name">
						{{ preset.name }}
					</option>
				</select>
				<button
					@click="resetAll"
					class="text-xs text-gray-400 hover:text-white px-2 py-1"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Spectrum Background -->
		<div class="relative mb-2">
			<div class="flex items-end gap-1 h-16 px-2">
				<div
					v-for="(height, i) in spectrumData"
					:key="i"
					class="flex-1 bg-gradient-to-t from-blue-900/50 to-blue-500/30 rounded-t"
					:style="{ height: `${height * 100}%` }"
				/>
			</div>
		</div>

		<!-- EQ Sliders -->
		<div class="flex items-end gap-1 h-32 px-2">
			<div
				v-for="(freq, index) in frequencies"
				:key="index"
				class="flex-1 flex flex-col items-center gap-1"
			>
				<div class="relative w-full h-24 bg-gray-800 rounded overflow-hidden">
					<!-- Grid lines -->
					<div class="absolute inset-0 flex flex-col justify-evenly">
						<div class="border-b border-gray-700/50 h-0"></div>
						<div class="border-b border-gray-600 h-0"></div>
						<div class="border-b border-gray-700/50 h-0"></div>
					</div>

					<!-- Slider -->
					<input
						v-model.number="values[index]"
						type="range"
						min="-12"
						max="12"
						step="0.5"
						class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						@dblclick="resetBand(index)"
					/>

					<!-- Value bar -->
					<div
						class="absolute bottom-1/2 left-1 right-1 transition-all duration-100"
						:style="{
							height: `${Math.abs(values[index] ?? 0) / 12 * 50}%`,
							bottom: (values[index] ?? 0) >= 0
								? '50%'
								: `${50 - Math.abs(values[index] ?? 0) / 12 * 50}%`,
							backgroundColor: (values[index] ?? 0) > 0
								? '#22c55e'
								: (values[index] ?? 0) < 0
								? '#ef4444'
								: '#6b7280',
						}"
					/>
				</div>

				<!-- Frequency label -->
				<span class="text-xs text-gray-500">{{ formatFrequency(freq) }}</span>
			</div>
		</div>

		<!-- Value scale -->
		<div class="flex justify-between text-xs text-gray-500 mt-2 px-2">
			<span>+12dB</span>
			<span>0dB</span>
			<span>-12dB</span>
		</div>
	</div>
</template>
