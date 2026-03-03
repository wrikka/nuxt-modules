<script setup lang="ts">
import type { Insight } from "#shared/types/analytics";

const { insights, loading, error, fetchInsights } = useAnalytics();

onMounted(() => {
	fetchInsights();
});

const handleAction = (insight: Insight) => {
	console.log("Action clicked:", insight);
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Insights
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Get personalized recommendations and tips
				</p>
			</div>

			<div v-if="loading" class="flex items-center justify-center py-12">
				<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
			</div>

			<div
				v-else-if="error"
				class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
			>
				{{ error }}
			</div>

			<div
				v-else-if="insights.length === 0"
				class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-lightbulb text-6xl" />
				<p class="mt-2 text-lg">No insights available</p>
				<p class="text-sm">Check back later for personalized recommendations</p>
			</div>

			<div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<InsightCard
					v-for="insight in insights"
					:key="insight.id"
					:insight="insight"
					@action="handleAction"
				/>
			</div>
		</div>
	</div>
</template>
