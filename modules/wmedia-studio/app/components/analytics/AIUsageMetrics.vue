<script setup lang="ts">
interface AIUsageMetric {
	feature: string;
	uses: number;
	tokens: number;
	cost: number;
	lastUsed: Date;
}

const props = defineProps<{
	metrics: AIUsageMetric[];
}>();

const totalUses = computed(() =>
	props.metrics.reduce((sum, m) => sum + m.uses, 0)
);
const totalTokens = computed(() =>
	props.metrics.reduce((sum, m) => sum + m.tokens, 0)
);
const totalCost = computed(() =>
	props.metrics.reduce((sum, m) => sum + m.cost, 0)
);

const sortedMetrics = computed(() =>
	[...props.metrics].sort((a, b) => b.uses - a.uses)
);

function getFeatureIcon(feature: string): string {
	const icons: Record<string, string> = {
		"Image Generation": "i-mdi-image",
		"Color Correction": "i-mdi-palette",
		"Video Compression": "i-mdi-video",
		"Auto Tagging": "i-mdi-tag",
		"Background Removal": "i-mdi-image-off",
		"Style Transfer": "i-mdi-brush",
	};
	return icons[feature] || "i-mdi-robot";
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-robot text-purple-500" />
				AI Usage Metrics
			</h3>
			<span class="text-sm text-gray-500 dark:text-gray-400">{{
					metrics.length
				}} features</span>
		</div>

		<div class="grid grid-cols-3 gap-4 mb-6">
			<div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
				<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
					{{ totalUses }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Total Uses</div>
			</div>
			<div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
					{{ (totalTokens / 1000).toFixed(1) }}k
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Tokens Used</div>
			</div>
			<div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="text-2xl font-bold text-green-600 dark:text-green-400">
					${{ totalCost.toFixed(2) }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Est. Cost</div>
			</div>
		</div>

		<div class="space-y-3">
			<div
				v-for="metric in sortedMetrics"
				:key="metric.feature"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
						<i
							:class="getFeatureIcon(metric.feature)"
							class="text-purple-600 dark:text-purple-400"
						/>
					</div>
					<div>
						<div class="font-medium text-gray-900 dark:text-white">
							{{ metric.feature }}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">
							Last used {{ new Date(metric.lastUsed).toLocaleDateString() }}
						</div>
					</div>
				</div>
				<div class="text-right">
					<div class="font-medium text-gray-900 dark:text-white">
						{{ metric.uses }} uses
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400">
						{{ (metric.tokens / 1000).toFixed(1) }}k tokens
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
