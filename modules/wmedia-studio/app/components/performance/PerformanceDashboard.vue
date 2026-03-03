<script setup lang="ts">
interface PerformanceMetric {
	name: string;
	value: number;
	unit: string;
	status: "good" | "warning" | "critical";
	limit?: number;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	optimize: [];
}>();

const metrics = ref<PerformanceMetric[]>([
	{ name: "File Size", value: 2.4, unit: "MB", status: "good", limit: 5 },
	{
		name: "Element Count",
		value: 47,
		unit: "items",
		status: "good",
		limit: 100,
	},
	{
		name: "Image Count",
		value: 12,
		unit: "images",
		status: "warning",
		limit: 10,
	},
	{ name: "Export Time", value: 3.2, unit: "sec", status: "good", limit: 10 },
	{ name: "Memory Usage", value: 156, unit: "MB", status: "good", limit: 500 },
]);

const optimizations = ref([
	{
		id: "compress",
		name: "Compress Images",
		description: "Reduce image file sizes",
		impact: "-1.2 MB",
		selected: false,
	},
	{
		id: "lazy",
		name: "Lazy Load Images",
		description: "Defer offscreen images",
		impact: "Faster load",
		selected: false,
	},
	{
		id: "sprites",
		name: "Create Sprites",
		description: "Combine small images",
		impact: "-5 HTTP",
		selected: false,
	},
	{
		id: "cleanup",
		name: "Remove Unused Layers",
		description: "Delete hidden elements",
		impact: "-12 items",
		selected: false,
	},
]);

const getStatusColor = (status: string) => {
	switch (status) {
		case "good":
			return "text-green-500";
		case "warning":
			return "text-yellow-500";
		case "critical":
			return "text-red-500";
		default:
			return "text-gray-500";
	}
};

const getStatusBg = (status: string) => {
	switch (status) {
		case "good":
			return "bg-green-100 dark:bg-green-900/30";
		case "warning":
			return "bg-yellow-100 dark:bg-yellow-900/30";
		case "critical":
			return "bg-red-100 dark:bg-red-900/30";
		default:
			return "bg-gray-100 dark:bg-gray-800";
	}
};

const selectedOptimizations = computed(() =>
	optimizations.value.filter(o => o.selected)
);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-3xl h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:memory" class="w-6 h-6 text-blue-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Performance Dashboard
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6 space-y-6">
				<!-- Metrics Grid -->
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div
						v-for="metric in metrics"
						:key="metric.name"
						class="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
					>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm text-gray-500 dark:text-gray-400">{{
								metric.name
							}}</span>
							<span
								:class="['w-2 h-2 rounded-full', getStatusBg(metric.status)]"
							/>
						</div>
						<div class="flex items-baseline gap-1">
							<span
								:class="['text-2xl font-bold', getStatusColor(metric.status)]"
							>{{ metric.value }}</span>
							<span class="text-sm text-gray-500 dark:text-gray-400">{{
								metric.unit
							}}</span>
						</div>
						<div v-if="metric.limit" class="mt-2">
							<div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full transition-all"
									:class="metric.status === 'good'
									? 'bg-green-500'
									: metric.status === 'warning'
									? 'bg-yellow-500'
									: 'bg-red-500'"
									:style="{
										width: `${
											Math.min((metric.value / metric.limit) * 100, 100)
										}%`,
									}"
								/>
							</div>
							<p class="text-xs text-gray-400 mt-1">
								Limit: {{ metric.limit }} {{ metric.unit }}
							</p>
						</div>
					</div>
				</div>

				<!-- Optimization Suggestions -->
				<div class="border-t border-gray-200 dark:border-gray-700 pt-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<Icon name="mdi:cpu" class="w-5 h-5 text-blue-500" />
						Optimization Suggestions
					</h3>

					<div class="space-y-3">
						<div
							v-for="opt in optimizations"
							:key="opt.id"
							class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							@click="opt.selected = !opt.selected"
						>
							<div class="flex items-center gap-3">
								<div
									class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
									:class="opt.selected
									? 'bg-blue-500 border-blue-500'
									: 'border-gray-300 dark:border-gray-600'"
								>
									<Icon
										v-if="opt.selected"
										name="mdi:check"
										class="w-3 h-3 text-white"
									/>
								</div>
								<div>
									<p class="font-medium text-gray-900 dark:text-white text-sm">
										{{ opt.name }}
									</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{{ opt.description }}
									</p>
								</div>
							</div>
							<span
								class="text-xs font-medium text-green-600 dark:text-green-400"
							>{{ opt.impact }}</span>
						</div>
					</div>

					<button
						v-if="selectedOptimizations.length > 0"
						class="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
						@click="emit('optimize')"
					>
						Apply {{ selectedOptimizations.length }} Optimizations
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
