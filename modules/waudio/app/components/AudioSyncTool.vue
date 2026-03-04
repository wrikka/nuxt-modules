<script setup lang="ts">
const emit = defineEmits<{ close: []; sync: [method: string] }>();
const method = ref("waveform");
const offset = ref(0);
const isAnalyzing = ref(false);
const confidence = ref(92);

const methods = [
	{ id: "waveform", name: "Waveform Match", desc: "Match audio waveforms" },
	{ id: "timecode", name: "Timecode", desc: "Use embedded timecode" },
	{ id: "marker", name: "Clap/Marker", desc: "Detect clapperboard or marker" },
	{ id: "manual", name: "Manual", desc: "Set offset manually" },
];

const sync = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
		emit("sync", method.value);
	}, 1500);
};
</script>
<template>
	<div class="audio-sync-tool bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-wave-sine" class="w-5 h-5" />Audio Sync Tool
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-700/30 rounded-lg">
			<div class="text-center">
				<div class="text-gray-400 text-xs mb-1">Video Audio</div>
				<div class="h-12 flex items-end gap-px justify-center">
					<div
						v-for="i in 20"
						:key="i"
						class="w-1 bg-blue-500 rounded-full"
						:style="{ height: `${Math.random() * 100}%` }"
					/>
				</div>
			</div>
			<div class="text-center">
				<div class="text-gray-400 text-xs mb-1">External Audio</div>
				<div class="h-12 flex items-end gap-px justify-center">
					<div
						v-for="i in 20"
						:key="i"
						class="w-1 bg-purple-500 rounded-full"
						:style="{ height: `${Math.random() * 100}%` }"
					/>
				</div>
			</div>
		</div>
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Sync Method</label>
			<div class="space-y-2">
				<button
					v-for="m in methods"
					:key="m.id"
					class="w-full p-3 rounded-lg text-left"
					:class="method === m.id
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/50'"
					@click="method = m.id"
				>
					<div class="text-white text-sm">{{ m.name }}</div>
					<div class="text-gray-500 text-xs">{{ m.desc }}</div>
				</button>
			</div>
		</div>
		<div v-if="method === 'manual'" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-300">Offset (ms)</span><span
					class="text-blue-400"
				>{{ offset }}ms</span>
			</div>
			<input
				v-model="offset"
				type="range"
				min="-5000"
				max="5000"
				step="10"
				class="w-full h-2 bg-gray-700 rounded-lg"
			/>
		</div>
		<div v-if="!isAnalyzing" class="mb-4 p-2 bg-green-900/30 rounded-lg">
			<div class="text-green-400 text-xs">
				Sync confidence: {{ confidence }}%
			</div>
		</div>
		<button
			class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
			:disabled="isAnalyzing"
			@click="sync"
		>
			<Icon
				v-if="isAnalyzing"
				name="i-ph-spinner"
				class="w-4 h-4 animate-spin inline mr-2"
			/>{{ isAnalyzing ? "Analyzing..." : "Sync Audio" }}
		</button>
	</div>
</template>
