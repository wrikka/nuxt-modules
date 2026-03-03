<script setup lang="ts">
import type { Insight } from "#shared/types/analytics";

const props = defineProps<{
	insight: Insight;
}>();

defineEmits<{
	action: [insight: Insight];
}>();

const getBorderClass = () => {
	return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";
};

const getIcon = () => {
	const icons: Record<string, string> = {
		tip: "i-mdi-lightbulb",
		warning: "i-mdi-alert",
		info: "i-mdi-information",
	};
	return icons[props.insight.type] || "i-mdi-information";
};

const getIconColor = () => {
	const colors: Record<string, string> = {
		tip: "text-yellow-500",
		warning: "text-orange-500",
		info: "text-blue-500",
	};
	return colors[props.insight.type] || "text-blue-500";
};
</script>

<template>
	<div class="insight-card rounded-lg border p-4" :class="getBorderClass()">
		<div class="flex items-start gap-3">
			<i :class="[getIcon(), getIconColor()]" class="text-xl mt-0.5" />
			<div class="flex-1">
				<h3 class="text-sm font-medium text-gray-900 dark:text-white">
					{{ insight.title }}
				</h3>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					{{ insight.description }}
				</p>
				<button
					v-if="insight.action"
					@click="$emit('action', insight)"
					class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					{{ insight.action }}
				</button>
			</div>
		</div>
	</div>
</template>
