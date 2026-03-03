<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const activeTool = ref<"deesser" | "plosive" | "breath">("deesser");
const isProcessing = ref(false);

// De-esser settings
const deesserThreshold = ref(-20);
const deesserFrequency = ref(6000);
const deesserRange = ref("wide");

// Plosive remover settings
const plosiveSensitivity = ref(70);
const plosiveReduction = ref(80);
const plosiveFreq = ref(100);

// Breath reducer settings
const breathThreshold = ref(-30);
const breathReduction = ref(60);
const breathGate = ref(true);

const applyTool = async () => {
	if (!props.audioBuffer) return;
	isProcessing.value = true;
	await new Promise(resolve => setTimeout(resolve, 1500));
	isProcessing.value = false;
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
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/>
				</svg>
				Voice Enhancement Suite
			</h3>
		</div>

		<!-- Tool Tabs -->
		<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
			<button
				v-for='tool in [
					{ id: "deesser", label: "De-esser", icon: "S" },
					{ id: "plosive", label: "Plosives", icon: "P" },
					{ id: "breath", label: "Breath", icon: "B" },
				] as const'
				:key="tool.id"
				@click="activeTool = tool.id"
				:class="[
					'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2',
					activeTool === tool.id
						? 'bg-purple-600 text-white'
						: 'text-gray-400 hover:text-white hover:bg-gray-700',
				]"
			>
				<span class="font-bold">{{ tool.icon }}</span>
				{{ tool.label }}
			</button>
		</div>

		<!-- De-esser Panel -->
		<div v-if="activeTool === 'deesser'" class="space-y-4">
			<div class="p-3 bg-gray-800 rounded-lg">
				<p class="text-xs text-gray-400">
					Reduces harsh sibilance (S, T, SH sounds) that can be fatiguing to
					listeners.
				</p>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Threshold (dB)</label>
					<span class="text-xs text-white">{{ deesserThreshold }}dB</span>
				</div>
				<input
					v-model="deesserThreshold"
					type="range"
					min="-60"
					max="-10"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Frequency (Hz)</label>
					<span class="text-xs text-white">{{ deesserFrequency }}Hz</span>
				</div>
				<input
					v-model="deesserFrequency"
					type="range"
					min="2000"
					max="12000"
					step="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-500">
					<span>2kHz</span>
					<span>12kHz</span>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-400">Range</label>
				<div class="flex gap-2">
					<button
						v-for='range in ["narrow", "medium", "wide"]'
						:key="range"
						@click="deesserRange = range"
						:class="[
							'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
							deesserRange === range
								? 'bg-purple-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
						]"
					>
						{{ range }}
					</button>
				</div>
			</div>
		</div>

		<!-- Plosive Remover Panel -->
		<div v-if="activeTool === 'plosive'" class="space-y-4">
			<div class="p-3 bg-gray-800 rounded-lg">
				<p class="text-xs text-gray-400">
					Removes explosive P and B sounds that cause low-frequency bursts.
				</p>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Sensitivity</label>
					<span class="text-xs text-white">{{ plosiveSensitivity }}%</span>
				</div>
				<input
					v-model="plosiveSensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Reduction</label>
					<span class="text-xs text-white">{{ plosiveReduction }}%</span>
				</div>
				<input
					v-model="plosiveReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Target Frequency (Hz)</label>
					<span class="text-xs text-white">{{ plosiveFreq }}Hz</span>
				</div>
				<input
					v-model="plosiveFreq"
					type="range"
					min="50"
					max="250"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- Breath Reducer Panel -->
		<div v-if="activeTool === 'breath'" class="space-y-4">
			<div class="p-3 bg-gray-800 rounded-lg">
				<p class="text-xs text-gray-400">
					Reduces audible breath sounds while preserving natural vocal quality.
				</p>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Threshold (dB)</label>
					<span class="text-xs text-white">{{ breathThreshold }}dB</span>
				</div>
				<input
					v-model="breathThreshold"
					type="range"
					min="-60"
					max="-20"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Reduction Amount</label>
					<span class="text-xs text-white">{{ breathReduction }}%</span>
				</div>
				<input
					v-model="breathReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
				<span class="text-sm text-gray-300">Enable Noise Gate</span>
				<button
					@click="breathGate = !breathGate"
					:class="[
						'w-12 h-6 rounded-full transition-colors relative',
						breathGate ? 'bg-purple-600' : 'bg-gray-700',
					]"
				>
					<span
						:class="[
							'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
							breathGate ? 'left-7' : 'left-1',
						]"
					></span>
				</button>
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
				@click="applyTool"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Preview
			</button>
			<button
				@click="applyTool"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Apply
			</button>
		</div>
	</div>
</template>
