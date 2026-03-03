<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const pitchShift = ref(0);
const timeStretch = ref(100);
const preserveFormants = ref(true);
const highQuality = ref(true);
const algorithm = ref<"elastique">("elastique");
const isProcessing = ref(false);

const algorithms = [
	{
		id: "elastique",
		name: "Elastique Pro",
		quality: "Highest",
		latency: "High",
	},
	{ id: "formant", name: "Formant Tape", quality: "High", latency: "Medium" },
	{
		id: "elastiqueEfficient",
		name: "Elastique Efficient",
		quality: "Good",
		latency: "Low",
	},
	{ id: "soundtouch", name: "SoundTouch", quality: "Fast", latency: "Low" },
];

const semitones = computed(() => (pitchShift.value / 100).toFixed(2));

const previewChanges = () => {
	console.log("Previewing pitch/time changes");
};

const applyChanges = async () => {
	if (!props.audioBuffer) return;
	isProcessing.value = true;

	// Simulate processing
	await new Promise(resolve => setTimeout(resolve, 2000));

	isProcessing.value = false;
};

const resetToDefault = () => {
	pitchShift.value = 0;
	timeStretch.value = 100;
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Time-Stretch / Pitch-Shift
			</h3>
			<button
				@click="resetToDefault"
				class="text-xs text-purple-400 hover:text-purple-300"
			>
				Reset
			</button>
		</div>

		<!-- Pitch Shift -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<label class="text-sm text-gray-300">Pitch Shift</label>
				<span class="text-sm font-medium text-white">{{ semitones }}
					semitones</span>
			</div>
			<div class="flex items-center gap-3">
				<button
					@click="pitchShift -= 100"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 12H4"
						/>
					</svg>
				</button>
				<input
					v-model="pitchShift"
					type="range"
					min="-1200"
					max="1200"
					step="1"
					class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<button
					@click="pitchShift += 100"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>
			<div class="flex justify-between text-xs text-gray-500">
				<span>-12 st</span>
				<span>0</span>
				<span>+12 st</span>
			</div>
		</div>

		<!-- Time Stretch -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<label class="text-sm text-gray-300">Time Stretch</label>
				<span class="text-sm font-medium text-white">{{ timeStretch }}%</span>
			</div>
			<div class="flex items-center gap-3">
				<button
					@click="timeStretch = Math.max(25, timeStretch - 25)"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 12H4"
						/>
					</svg>
				</button>
				<input
					v-model="timeStretch"
					type="range"
					min="25"
					max="400"
					step="1"
					class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<button
					@click="timeStretch = Math.min(400, timeStretch + 25)"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>
			<div class="flex justify-between text-xs text-gray-500">
				<span>0.25x</span>
				<span>1x</span>
				<span>4x</span>
			</div>
		</div>

		<!-- Algorithm -->
		<div class="space-y-2">
			<label class="text-sm text-gray-300">Algorithm</label>
			<select
				v-model="algorithm"
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option v-for="alg in algorithms" :key="alg.id" :value="alg.id">
					{{ alg.name }} ({{ alg.quality }} Quality, {{ alg.latency }} Latency)
				</option>
			</select>
		</div>

		<!-- Options -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Options</label>
			<div class="space-y-2">
				<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
					<div class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
							/>
						</svg>
						<span class="text-sm text-gray-300">Preserve Formants</span>
					</div>
					<button
						@click="preserveFormants = !preserveFormants"
						:class="[
							'w-12 h-6 rounded-full transition-colors relative',
							preserveFormants ? 'bg-purple-600' : 'bg-gray-700',
						]"
					>
						<span
							:class="[
								'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
								preserveFormants ? 'left-7' : 'left-1',
							]"
						></span>
					</button>
				</div>

				<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
					<div class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							/>
						</svg>
						<span class="text-sm text-gray-300">High Quality Mode</span>
					</div>
					<button
						@click="highQuality = !highQuality"
						:class="[
							'w-12 h-6 rounded-full transition-colors relative',
							highQuality ? 'bg-purple-600' : 'bg-gray-700',
						]"
					>
						<span
							:class="[
								'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
								highQuality ? 'left-7' : 'left-1',
							]"
						></span>
					</button>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<div class="flex items-start gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 text-blue-400 mt-0.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-xs text-blue-300">
					Real-time preview uses lower quality. Final render uses selected
					algorithm for best results.
				</p>
			</div>
		</div>

		<!-- Processing -->
		<div
			v-if="isProcessing"
			class="flex items-center justify-center gap-2 py-2"
		>
			<svg
				class="animate-spin h-5 w-5 text-purple-400"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				>
				</circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				>
				</path>
			</svg>
			<span class="text-sm text-white">Processing...</span>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				@click="previewChanges"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Preview
			</button>
			<button
				@click="applyChanges"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Apply
			</button>
		</div>
	</div>
</template>
