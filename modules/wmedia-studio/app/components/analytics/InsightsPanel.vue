<script setup lang="ts">
import type { Insight } from "#shared/types/analytics";

interface Props {
	insights: Insight[];
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "AI-Powered Insights",
});

const emit = defineEmits<{
	action: [insight: Insight];
}>();

const sortedInsights = computed(() => {
	const priorityOrder = { high: 0, medium: 1, low: 2 };
	return [...props.insights].sort((a, b) =>
		priorityOrder[a.priority] - priorityOrder[b.priority]
	);
});

function getIcon(type: Insight["type"]) {
	switch (type) {
		case "tip":
			return "i-mdi-lightbulb text-yellow-500";
		case "warning":
			return "i-mdi-alert-circle text-red-500";
		case "info":
			return "i-mdi-information-circle text-blue-500";
		default:
			return "i-mdi-information-circle text-gray-500";
	}
}

function getPriorityBadge(priority: Insight["priority"]) {
	switch (priority) {
		case "high":
			return {
				text: "High",
				class: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
			};
		case "medium":
			return {
				text: "Medium",
				class:
					"bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
			};
		case "low":
			return {
				text: "Low",
				class:
					"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
			};
		default:
			return {
				text: "Low",
				class: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400",
			};
	}
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{{ title }}
			</h3>
			<span class="text-sm text-gray-500 dark:text-gray-400">{{
					insights.length
				}} insights</span>
		</div>

		<div class="space-y-3">
			<div
				v-for="insight in sortedInsights"
				:key="insight.id"
				class="flex items-start gap-3 p-3 rounded-lg transition-colors"
				:class="insight.priority === 'high'
				? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20'
				: 'bg-gray-50 dark:bg-gray-700/50'"
			>
				<i :class="getIcon(insight.type)" class="text-xl shrink-0 mt-0.5" />

				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-1">
						<h4 class="font-medium text-gray-900 dark:text-white text-sm">
							{{ insight.title }}
						</h4>
						<span
							class="px-2 py-0.5 text-xs rounded-full"
							:class="getPriorityBadge(insight.priority).class"
						>
							{{ getPriorityBadge(insight.priority).text }}
						</span>
					</div>

					<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
						{{ insight.description }}
					</p>

					<button
						v-if="insight.action"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
						@click="emit('action', insight)"
					>
						{{ insight.action }}
					</button>
				</div>
			</div>

			<div
				v-if="insights.length === 0"
				class="text-center py-8 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-clipboard-check text-3xl mb-2" />
				<p>No insights available at the moment</p>
			</div>
		</div>
	</div>
</template>
