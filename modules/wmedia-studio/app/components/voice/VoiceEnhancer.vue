<script setup lang="ts">
const emit = defineEmits<{ close: []; enhance: [settings: any] }>();
const noiseReduction = ref(50);
const clarity = ref(70);
const deEss = ref(30);
const deNoise = ref(true);
const isProcessing = ref(false);
const enhance = () => {
	emit("enhance", {
		noiseReduction: noiseReduction.value,
		clarity: clarity.value,
	});
};
</script>
<template>
	<div class="voice-enhancer bg-gray-800 rounded-lg p-4 w-[400px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-magic-wand" class="w-5 h-5" />AI Voice Enhancer
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="space-y-4 mb-4">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Noise Reduction</span><span
						class="text-blue-400"
					>{{ noiseReduction }}%</span>
				</div><input
					v-model="noiseReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Clarity Boost</span><span
						class="text-blue-400"
					>{{ clarity }}%</span>
				</div><input
					v-model="clarity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">De-Ess</span><span
						class="text-blue-400"
					>{{ deEss }}%</span>
				</div><input
					v-model="deEss"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<label class="flex items-center gap-2 text-sm text-gray-300"><input
					v-model="deNoise"
					type="checkbox"
					class="w-4 h-4 rounded"
				>Enable AI De-noise</label>
		</div>
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
				@click="enhance"
			>
				Enhance
			</button>
		</div>
	</div>
</template>
