<script setup lang="ts">
const emit = defineEmits<
	{ close: []; blur: [mode: string, intensity: number] }
>();
const mode = ref("face");
const intensity = ref(100);
const detectMultiple = ref(true);
const isProcessing = ref(false);
const detectedCount = ref(3);

const modes = [
	{ id: "face", name: "Face Blur", icon: "i-ph-user" },
	{ id: "plate", name: "License Plate", icon: "i-ph-car" },
	{ id: "full", name: "Full Body", icon: "i-ph-person" },
	{ id: "logo", name: "Logo/Brand", icon: "i-ph-trademark" },
];

const blur = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("blur", mode.value, intensity.value);
	}, 2000);
};
</script>

<template>
	<div class="ai-face-blur bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:account-off" class="w-5 h-5 text-purple-500" />
				AI Face Blur/Anonymize
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Detection Preview
			</div>
			<div class="absolute top-2 left-2 px-2 py-1 bg-blue-100 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 text-xs rounded font-medium">
				{{ detectedCount }} detected
			</div>
			<div class="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-yellow-500 rounded bg-white/20" />
			<div class="absolute top-1/3 right-1/3 w-12 h-12 border-2 border-yellow-500 rounded bg-white/20" />
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Blur Mode</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="m in modes"
					:key="m.id"
					class="p-3 rounded-lg flex items-center gap-2 transition-all"
					:class="mode === m.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50'"
					@click="mode = m.id"
				>
					<span :class="[m.icon, 'w-4 h-4 text-gray-500 dark:text-gray-400']" />
					<span class="text-gray-900 dark:text-white text-sm">{{
						m.name
					}}</span>
				</button>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Blur Intensity</span>
				<span class="text-purple-500 font-medium">{{ intensity }}%</span>
			</div>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-900 dark:text-white text-sm"
			>Detect Multiple Objects</span>
			<input
				v-model="detectMultiple"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
		</label>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="blur"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>{{ isProcessing ? "Processing..." : "Apply Blur" }}
		</button>
	</div>
</template>
