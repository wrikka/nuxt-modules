<script setup lang="ts">
import type { Insight } from "#shared/types/analytics";
import { useAnalytics } from "~/composables/useAnalytics";
import { useMockAnalyticsData } from "~/composables/useMockAnalyticsData";

const { analyticsData, loading, error, fetchAnalytics, formatBytes } = useAnalytics();
const mockData = useMockAnalyticsData();

const isLive = ref(true);
const lastUpdate = ref(new Date());
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null);
const showCustomizer = ref(false);

const widgets = ref([
	{ id: "overview", name: "Overview Cards", visible: true, order: 0 },
	{ id: "timeseries", name: "Time Series Charts", visible: true, order: 1 },
	{ id: "insights", name: "AI Insights", visible: true, order: 2 },
	{ id: "forecasting", name: "Storage Forecast", visible: true, order: 3 },
	{ id: "leaderboard", name: "Project Leaderboard", visible: true, order: 4 },
	{ id: "piechart", name: "Media Distribution", visible: true, order: 5 },
	{ id: "heatmap", name: "Activity Heatmap", visible: true, order: 6 },
	{ id: "collaboration", name: "Collaboration", visible: true, order: 7 },
	{ id: "aiusage", name: "AI Usage", visible: true, order: 8 },
	{ id: "cleanup", name: "Storage Cleanup", visible: true, order: 9 },
	{ id: "exportstats", name: "Export Stats", visible: true, order: 10 },
	{ id: "performance", name: "Performance", visible: true, order: 11 },
	{ id: "comparison", name: "Comparison", visible: true, order: 12 },
	{ id: "goals", name: "Goal Tracking", visible: true, order: 13 },
	{ id: "geographic", name: "Geographic Map", visible: true, order: 14 },
	{ id: "device", name: "Device Breakdown", visible: true, order: 15 },
	{ id: "templateusage", name: "Template Usage", visible: true, order: 16 },
	{ id: "cohort", name: "Cohort Analysis", visible: true, order: 17 },
	{ id: "anomaly", name: "Anomaly Alerts", visible: true, order: 18 },
]);

function startRealtimeUpdates() {
	refreshInterval.value = setInterval(() => {
		if (isLive.value) {
			fetchAnalytics();
			lastUpdate.value = new Date();
		}
	}, 30000);
}

function toggleRealtime() {
	isLive.value = !isLive.value;
}

function handleDateRangeChange() {
	fetchAnalytics();
}

function handleWidgetToggle(id: string) {
	const widget = widgets.value.find(w => w.id === id);
	if (widget) widget.visible = !widget.visible;
}

function handleWidgetReorder(newWidgets: typeof widgets.value) {
	widgets.value = newWidgets;
}

function handleCleanupDelete(id: string) {
	mockData.cleanupSuggestions.value = mockData.cleanupSuggestions.value.filter(s => s.id !== id);
}

function handleCleanupDeleteAll() {
	mockData.cleanupSuggestions.value = [];
}

function handleGoalDelete(id: string) {
	mockData.goals.value = mockData.goals.value.filter(g => g.id !== id);
}

function handleAnomalyDismiss(id: string) {
	const anomaly = mockData.anomalies.value.find(a => a.id === id);
	if (anomaly) anomaly.isRead = true;
}

onMounted(() => {
	fetchAnalytics();
	startRealtimeUpdates();
});

onUnmounted(() => {
	if (refreshInterval.value) clearInterval(refreshInterval.value);
});

const visibleWidgetsList = computed(() =>
	widgets.value.filter(w => w.visible).sort((a, b) => a.order - b.order)
);
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">Comprehensive insights and statistics for your media studio</p>
				</div>
				<div class="flex items-center gap-3 flex-wrap">
					<RealTimeIndicator :is-live="isLive" :last-update="lastUpdate" @toggle="toggleRealtime" />
					<DateRangePicker @change="handleDateRangeChange" />
					<ExportButton :data="analyticsData || {}" />
					<button
						class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						@click="showCustomizer = !showCustomizer"
					>
						<i class="i-mdi-view-dashboard" />
					</button>
				</div>
			</div>

			<!-- Loading & Error states -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<i class="i-mdi-loading animate-spin text-4xl text-blue-500" />
			</div>

			<div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 mb-6">
				{{ error }}
			</div>

			<template v-else-if="analyticsData">
				<DashboardCustomizer
					v-if="showCustomizer"
					:widgets="widgets"
					class="mb-6"
					@toggle="handleWidgetToggle"
					@reorder="handleWidgetReorder"
				/>

				<!-- Overview Cards -->
				<div v-if="visibleWidgetsList.find(w => w.id === 'overview')" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					<AnalyticsCard
						title="Total Projects"
						:value="analyticsData.totalProjects"
						icon="i-mdi-folder"
						icon-bg="bg-blue-100 dark:bg-blue-900/30"
						icon-color="text-blue-600 dark:text-blue-400"
						change="+12%"
						change-icon="i-mdi-arrow-up"
						change-color="text-green-600"
						change-text="from last month"
					/>
					<AnalyticsCard
						title="Total Media"
						:value="analyticsData.totalMedia"
						icon="i-mdi-image"
						icon-bg="bg-purple-100 dark:bg-purple-900/30"
						icon-color="text-purple-600 dark:text-purple-400"
						change="+8%"
						change-icon="i-mdi-arrow-up"
						change-color="text-green-600"
						change-text="from last month"
					/>
					<AnalyticsCard
						title="Storage Used"
						:value="formatBytes(analyticsData.totalStorage)"
						icon="i-mdi-harddisk"
						icon-bg="bg-green-100 dark:bg-green-900/30"
						icon-color="text-green-600 dark:text-green-400"
						change="+5%"
						change-icon="i-mdi-arrow-up"
						change-color="text-green-600"
						change-text="from last month"
					/>
					<AnalyticsCard
						title="Active Users"
						:value="analyticsData.activeUsers"
						icon="i-mdi-account-group"
						icon-bg="bg-orange-100 dark:bg-orange-900/30"
						icon-color="text-orange-600 dark:text-orange-400"
						change="+3%"
						change-icon="i-mdi-arrow-up"
						change-color="text-green-600"
						change-text="from last month"
					/>
				</div>

				<!-- Main Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<TimeSeriesChart v-if="visibleWidgetsList.find(w => w.id === 'timeseries')" :data="mockData.timeSeriesData" title="Activity Trends" color="#3b82f6" />
					<InsightsPanel v-if="visibleWidgetsList.find(w => w.id === 'insights')" :insights="mockData.insights" />
					<ForecastingCard v-if="visibleWidgetsList.find(w => w.id === 'forecasting')" :historical-data="mockData.timeSeriesData.map(d => ({ date: d.date, value: d.value * 1024 * 1024 }))" />
					<PieChart v-if="visibleWidgetsList.find(w => w.id === 'piechart')" :data="mockData.pieChartData" title="Media Type Distribution" />
					<ActivityHeatmap v-if="visibleWidgetsList.find(w => w.id === 'heatmap')" :data="mockData.heatmapData" title="User Activity" />
					<CollaborationAnalytics v-if="visibleWidgetsList.find(w => w.id === 'collaboration')" :data="mockData.collaborationData" />
					<AIUsageMetrics v-if="visibleWidgetsList.find(w => w.id === 'aiusage')" :metrics="mockData.aiUsageData" />
					<ExportFormatStats v-if="visibleWidgetsList.find(w => w.id === 'exportstats')" :stats="mockData.exportFormatStats" />
					<PerformanceMetrics v-if="visibleWidgetsList.find(w => w.id === 'performance')" :metrics="mockData.performanceMetrics" />
					<ComparisonMode v-if="visibleWidgetsList.find(w => w.id === 'comparison')" :data="mockData.comparisonData" title="Period Comparison" />
					<GoalTracking v-if="visibleWidgetsList.find(w => w.id === 'goals')" :goals="mockData.goals" @delete="handleGoalDelete" />
					<GeographicMap v-if="visibleWidgetsList.find(w => w.id === 'geographic')" :data="mockData.geographicData" />
					<DeviceBreakdown v-if="visibleWidgetsList.find(w => w.id === 'device')" :devices="mockData.deviceData" />
					<TemplateUsage v-if="visibleWidgetsList.find(w => w.id === 'templateusage')" :templates="mockData.templateUsage" />
				</div>

				<!-- Full-width widgets -->
				<div class="space-y-6">
					<LeaderboardTable v-if="visibleWidgetsList.find(w => w.id === 'leaderboard')" :projects="mockData.projectStats" />
					<CohortAnalysis v-if="visibleWidgetsList.find(w => w.id === 'cohort')" :cohorts="mockData.cohortData" />
					<StorageCleanupSuggestions v-if="visibleWidgetsList.find(w => w.id === 'cleanup')" :suggestions="mockData.cleanupSuggestions" @delete="handleCleanupDelete" @delete-all="handleCleanupDeleteAll" />
					<AnomalyAlerts v-if="visibleWidgetsList.find(w => w.id === 'anomaly')" :anomalies="mockData.anomalies" @dismiss="handleAnomalyDismiss" />
				</div>
			</template>
		</div>
	</div>
</template>
