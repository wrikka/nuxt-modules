<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const autoMarkHighlights = defineModel<boolean>("autoMark", { default: true });
const highlightSensitivity = defineModel<number>("sensitivity", {
	default: 70,
});
const detectApplause = defineModel<boolean>("detectApplause", {
	default: true,
});
const detectLaughter = defineModel<boolean>("detectLaughter", {
	default: true,
});
const detectKeyMoments = defineModel<boolean>("detectKeyMoments", {
	default: true,
});
const detectTopicChanges = defineModel<boolean>("detectTopicChanges", {
	default: false,
});

const highlights = ref([
	{ id: 1, time: "02:34", label: "Key Point", confidence: 92, type: "topic" },
	{
		id: 2,
		time: "05:12",
		label: "Audience Reaction",
		confidence: 88,
		type: "reaction",
	},
	{
		id: 3,
		time: "08:45",
		label: "Important Statement",
		confidence: 85,
		type: "statement",
	},
]);

const getHighlightIcon = (type: string) => {
	switch (type) {
		case "topic":
			return "mdi:tag";
		case "reaction":
			return "mdi:emoticon";
		case "statement":
			return "mdi:format-quote-close";
		default:
			return "mdi:star";
	}
};

const getHighlightColor = (type: string) => {
	switch (type) {
		case "topic":
			return "blue";
		case "reaction":
			return "yellow";
		case "statement":
			return "purple";
		default:
			return "gray";
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
					<Icon
						name="mdi:star-circle"
						class="w-5 h-5 text-amber-600 dark:text-amber-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						AI Highlight Detection
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Auto-mark important moments
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:lightbulb" class="w-4 h-4 text-amber-600 mt-0.5" />
					<p class="text-xs text-amber-700 dark:text-amber-300">
						AI analyzes audio, video, and speech patterns to detect key moments,
						reactions, and topic changes for easy editing later.
					</p>
				</div>
			</div>

			<div class="space-y-2">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="autoMarkHighlights"
						type="checkbox"
						class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Auto-mark highlights during recording</span>
				</label>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Detection Sensitivity</span>
					<span class="text-gray-500">{{ highlightSensitivity }}%</span>
				</div>
				<input
					v-model.number="highlightSensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-amber-600"
				>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="detectApplause"
						type="checkbox"
						class="w-4 h-4 text-amber-600 rounded"
					>
					<Icon name="mdi:hands-clap" class="w-4 h-4 text-amber-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300">Applause</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="detectLaughter"
						type="checkbox"
						class="w-4 h-4 text-amber-600 rounded"
					>
					<Icon name="mdi:emoticon-lol" class="w-4 h-4 text-yellow-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300">Laughter</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="detectKeyMoments"
						type="checkbox"
						class="w-4 h-4 text-amber-600 rounded"
					>
					<Icon name="mdi:flash" class="w-4 h-4 text-purple-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Key Moments</span>
				</label>
				<label
					class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<input
						v-model="detectTopicChanges"
						type="checkbox"
						class="w-4 h-4 text-amber-600 rounded"
					>
					<Icon name="mdi:tag-multiple" class="w-4 h-4 text-blue-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Topic Changes</span>
				</label>
			</div>

			<div
				v-if="highlights.length > 0"
				class="border-t border-gray-200 dark:border-gray-700 pt-4"
			>
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Detected Highlights (Preview)
				</h4>
				<div class="space-y-2 max-h-32 overflow-y-auto">
					<div
						v-for="highlight in highlights"
						:key="highlight.id"
						class="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
					>
						<div
							:class="`w-8 h-8 rounded-lg bg-${
								getHighlightColor(highlight.type)
							}-100 dark:bg-${
								getHighlightColor(highlight.type)
							}-900/30 flex items-center justify-center`"
						>
							<Icon
								:name="getHighlightIcon(highlight.type)"
								:class="`w-4 h-4 text-${getHighlightColor(highlight.type)}-600`"
							/>
						</div>
						<div class="flex-1 min-w-0">
							<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
								{{ highlight.label }}
							</div>
							<div class="text-xs text-gray-500">
								{{ highlight.time }} • {{ highlight.confidence }}% confidence
							</div>
						</div>
						<button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
							<Icon name="mdi:play-circle" class="w-5 h-5 text-gray-500" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
