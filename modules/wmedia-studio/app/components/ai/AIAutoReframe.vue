<script setup lang="ts">
const emit = defineEmits<
	{ close: []; reframe: [targetRatio: string, tracking: string] }
>();
const targetRatio = ref("9:16");
const trackingMode = ref("auto");
const safeMargin = ref(10);
const isProcessing = ref(false);

const ratios = [
	{ id: "9:16", name: "Vertical (9:16)" },
	{ id: "1:1", name: "Square (1:1)" },
	{ id: "4:5", name: "Portrait (4:5)" },
	{ id: "16:9", name: "Landscape (16:9)" },
];
const trackingModes = [
	{ id: "auto", name: "Auto Tracking" },
	{ id: "face", name: "Face Focus" },
	{ id: "object", name: "Object Tracking" },
	{ id: "manual", name: "Manual" },
];

const reframe = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("reframe", targetRatio.value, trackingMode.value);
	}, 2000);
};
</script>
<template>
	<div class="ai-auto-reframe bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:crop" class="w-5 h-5 text-purple-500" />
				AI Auto Reframe
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="aspect-video bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
				Original 16:9
			</div>
			<div class="aspect-[9/16] bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs mx-auto">
				Target
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Target Ratio</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="r in ratios"
					:key="r.id"
					class="p-2 rounded-lg text-center text-sm transition-all"
					:class="targetRatio === r.id
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="targetRatio = r.id"
				>
					{{ r.name }}
				</button>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Tracking Mode</label>
			<div class="space-y-2">
				<button
					v-for="t in trackingModes"
					:key="t.id"
					class="w-full p-2 rounded-lg flex items-center gap-3 transition-all"
					:class="trackingMode === t.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50'"
					@click="trackingMode = t.id"
				>
					<div
						class="w-2 h-2 rounded-full"
						:class="trackingMode === t.id ? 'bg-purple-500' : 'bg-gray-400'"
					/>
					<span class="text-gray-900 dark:text-white text-sm">{{
						t.name
					}}</span>
				</button>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Safe Margin</span>
				<span class="text-purple-500 font-medium">{{ safeMargin }}%</span>
			</div>
			<input
				v-model="safeMargin"
				type="range"
				min="0"
				max="20"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="reframe"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>Auto Reframe
		</button>
	</div>
</template>
