<script setup lang="ts">
interface Anomaly {
	id: string;
	metric: string;
	detectedAt: Date;
	severity: "low" | "medium" | "high" | "critical";
	message: string;
	expectedValue: number;
	actualValue: number;
	isRead: boolean;
}

const props = defineProps<{
	anomalies: Anomaly[];
}>();

const emit = defineEmits<{
	dismiss: [id: string];
	view: [id: string];
}>();

const unreadCount = computed(() =>
	props.anomalies.filter(a => !a.isRead).length
);

const sortedAnomalies = computed(() =>
	[...props.anomalies]
		.filter(a => !a.isRead)
		.sort((a, b) => {
			const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
			return severityOrder[a.severity] - severityOrder[b.severity];
		})
);

const severityConfig = {
	critical: {
		icon: "i-mdi-alert-circle",
		color:
			"text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",
		label: "Critical",
	},
	high: {
		icon: "i-mdi-alert",
		color:
			"text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",
		label: "High",
	},
	medium: {
		icon: "i-mdi-information",
		color:
			"text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30",
		label: "Medium",
	},
	low: {
		icon: "i-mdi-information-outline",
		color:
			"text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
		label: "Low",
	},
};
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-bell-alert text-red-500" />
				Anomaly Detection
				<span
					v-if="unreadCount > 0"
					class="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full"
				>
					{{ unreadCount }} new
				</span>
			</h3>
		</div>

		<div class="space-y-3 max-h-64 overflow-y-auto">
			<div
				v-for="anomaly in sortedAnomalies"
				:key="anomaly.id"
				class="p-3 rounded-lg border transition-colors"
				:class="severityConfig[anomaly.severity].color"
			>
				<div class="flex items-start gap-3">
					<i
						:class="severityConfig[anomaly.severity].icon"
						class="text-xl shrink-0 mt-0.5"
					/>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<span class="font-medium text-sm">{{ anomaly.metric }}</span>
							<span
								class="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-800"
							>
								{{ severityConfig[anomaly.severity].label }}
							</span>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
							{{ anomaly.message }}
						</p>
						<div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
							<span>Expected: {{ anomaly.expectedValue }}</span>
							<span>Actual: {{ anomaly.actualValue }}</span>
							<span>{{
								new Date(anomaly.detectedAt).toLocaleTimeString()
							}}</span>
						</div>
					</div>
					<div class="flex gap-1">
						<button
							class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
							@click="emit('view', anomaly.id)"
							title="View details"
						>
							<i class="i-mdi-eye" />
						</button>
						<button
							class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
							@click="emit('dismiss', anomaly.id)"
							title="Dismiss"
						>
							<i class="i-mdi-close" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="sortedAnomalies.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-check-circle text-3xl mb-2 text-green-500" />
			<p>No anomalies detected</p>
			<p class="text-xs mt-1">Everything looks normal!</p>
		</div>
	</div>
</template>
