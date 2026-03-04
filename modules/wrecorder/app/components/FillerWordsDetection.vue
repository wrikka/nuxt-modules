<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const sensitivity = defineModel<number>("sensitivity", { default: 70 });
const showRealTime = defineModel<boolean>("showRealTime", { default: true });
const playAlert = defineModel<boolean>("playAlert", { default: false });

const fillerWords = ref([
	{ word: "um", count: 12, enabled: true, severity: "medium" },
	{ word: "uh", count: 8, enabled: true, severity: "low" },
	{ word: "like", count: 24, enabled: true, severity: "high" },
	{ word: "you know", count: 6, enabled: true, severity: "medium" },
	{ word: "so", count: 18, enabled: false, severity: "low" },
	{ word: "basically", count: 3, enabled: true, severity: "low" },
	{ word: "actually", count: 9, enabled: false, severity: "low" },
	{ word: "literally", count: 2, enabled: true, severity: "low" },
	{ word: "right", count: 15, enabled: false, severity: "low" },
	{ word: "I mean", count: 7, enabled: true, severity: "medium" },
]);

const totalFillerWords = computed(() =>
	fillerWords.value.filter(w => w.enabled).reduce((sum, w) => sum + w.count, 0)
);
const totalWords = ref(342);
const fillerPercentage = computed(() =>
	((totalFillerWords.value / totalWords.value) * 100).toFixed(1)
);

const recentDetections = ref([
	{
		word: "um",
		timestamp: "00:02:34",
		context: "...we need to, um, consider...",
	},
	{
		word: "like",
		timestamp: "00:03:12",
		context: "...it was, like, really important...",
	},
]);

const getSeverityColor = (severity: string) => {
	switch (severity) {
		case "high":
			return "text-red-500";
		case "medium":
			return "text-yellow-500";
		case "low":
			return "text-green-500";
		default:
			return "text-gray-500";
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
					<Icon
						name="mdi:message-alert"
						class="w-5 h-5 text-orange-600 dark:text-orange-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Filler Words Detection
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Track and reduce verbal habits
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-orange-600 mt-0.5" />
					<p class="text-xs text-orange-700 dark:text-orange-300">
						Detect and track filler words in real-time. Reducing these improves
						your credibility and audience engagement.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-3">
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
					<div class="text-2xl font-bold text-orange-600">
						{{ totalFillerWords }}
					</div>
					<div class="text-xs text-gray-500">Detected</div>
				</div>
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
					<div class="text-2xl font-bold text-gray-700 dark:text-gray-300">
						{{ fillerPercentage }}%
					</div>
					<div class="text-xs text-gray-500">Of Speech</div>
				</div>
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
					<div class="text-2xl font-bold text-gray-700 dark:text-gray-300">
						{{ totalWords }}
					</div>
					<div class="text-xs text-gray-500">Total Words</div>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Detection Sensitivity</span>
					<span class="text-gray-500">{{ sensitivity }}%</span>
				</div>
				<input
					v-model.number="sensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-600"
				>
			</div>

			<div class="space-y-1 max-h-48 overflow-y-auto">
				<div
					v-for="word in fillerWords"
					:key="word.word"
					class="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700"
				>
					<div class="flex items-center gap-2">
						<input
							v-model="word.enabled"
							type="checkbox"
							class="w-4 h-4 text-orange-600 rounded"
						>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
						>"{{ word.word }}"</span>
						<span :class="`text-xs ${getSeverityColor(word.severity)}`">{{
							word.severity
						}}</span>
					</div>
					<div class="flex items-center gap-2">
						<span
							class="text-sm font-bold"
							:class="word.count > 10
							? 'text-red-500'
							: word.count > 5
							? 'text-yellow-500'
							: 'text-green-500'"
						>{{ word.count }}</span>
						<button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
							<Icon name="mdi:close" class="w-4 h-4 text-gray-400" />
						</button>
					</div>
				</div>
			</div>

			<button class="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
				<Icon name="mdi:plus" class="w-4 h-4" />
				Add Custom Filler Word
			</button>

			<div
				v-if="recentDetections.length && showRealTime"
				class="border-t border-gray-200 dark:border-gray-700 pt-4"
			>
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Recent Detections
				</h4>
				<div class="space-y-2">
					<div
						v-for="detection in recentDetections"
						:key="detection.timestamp"
						class="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
					>
						<div class="flex items-center justify-between mb-1">
							<span
								class="text-sm font-medium text-orange-700 dark:text-orange-300"
							>"{{ detection.word }}"</span>
							<span class="text-xs text-orange-600">{{
								detection.timestamp
							}}</span>
						</div>
						<p class="text-xs text-gray-600 dark:text-gray-400">
							{{ detection.context }}
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="showRealTime"
						type="checkbox"
						class="w-4 h-4 text-orange-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Show real-time alerts</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="playAlert"
						type="checkbox"
						class="w-4 h-4 text-orange-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Play subtle alert sound</span>
				</label>
			</div>
		</div>
	</div>
</template>
