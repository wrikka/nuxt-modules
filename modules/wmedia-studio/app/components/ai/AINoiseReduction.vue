<script setup lang="ts">
const emit = defineEmits<
	{ close: []; process: [strength: number, type: string] }
>();
const noiseType = ref("general");
const strength = ref(50);
const preserveVoice = ref(true);
const isProcessing = ref(false);
const beforeLevel = ref(-24);
const afterLevel = ref(-42);

const noiseTypes = [
	{ id: "general", name: "General Noise", icon: "mdi:waveform" },
	{ id: "hiss", name: "Hiss/Hum", icon: "mdi:flash" },
	{ id: "wind", name: "Wind", icon: "mdi:weather-windy" },
	{ id: "traffic", name: "Traffic", icon: "mdi:car" },
	{ id: "fan", name: "Fan/AC", icon: "mdi:fan" },
];

const process = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		afterLevel.value = -52;
		emit("process", strength.value, noiseType.value);
	}, 2000);
};
</script>
<template>
	<div class="ai-noise-reduction bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:volume-off" class="w-5 h-5 text-purple-500" />
				AI Noise Reduction
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase tracking-wider font-medium"
			>Noise Type</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="t in noiseTypes"
					:key="t.id"
					class="p-2 rounded-lg text-center text-sm flex items-center gap-2 transition-all"
					:class="noiseType === t.id
					? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="noiseType = t.id"
				>
					<Icon :name="t.icon" class="w-4 h-4" />
					{{ t.name }}
				</button>
			</div>
		</div>

		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Reduction Strength</span>
				<span class="text-purple-500 font-medium">{{ strength }}%</span>
			</div>
			<input
				v-model="strength"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>

		<div class="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-center">
				<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">Before</div>
				<div class="text-red-500 font-mono font-medium">
					{{ beforeLevel }} dB
				</div>
			</div>
			<div class="text-center">
				<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">After</div>
				<div class="text-green-500 font-mono font-medium">
					{{ afterLevel }} dB
				</div>
			</div>
		</div>

		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-700 dark:text-gray-300 text-sm"
			>Preserve Voice Quality</span>
			<input
				v-model="preserveVoice"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
		</label>

		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="process"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Reduce Noise
		</button>
	</div>
</template>
