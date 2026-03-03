<script setup lang="ts">
import type {
	AnalyticsData,
	Insight,
	MediaStats,
	ProjectStats,
	UsageStats,
} from "#shared/types/analytics";

// Composables
const {
	analyticsData,
	loading,
	error,
	fetchAnalytics,
	formatBytes,
	formatDate,
} = useAnalytics();

// State
const isLive = ref(true);
const lastUpdate = ref(new Date());
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null);
const showCustomizer = ref(false);

// Widget visibility state
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

// Mock data for demonstration
const timeSeriesData = ref([
	{ date: "2024-01-01", value: 45 },
	{ date: "2024-01-02", value: 52 },
	{ date: "2024-01-03", value: 48 },
	{ date: "2024-01-04", value: 65 },
	{ date: "2024-01-05", value: 72 },
	{ date: "2024-01-06", value: 58 },
	{ date: "2024-01-07", value: 85 },
]);

const insights = ref<Insight[]>([
	{
		id: "1",
		type: "warning",
		title: "Storage usage growing rapidly",
		description:
			"Your storage usage increased by 25% this week. Consider reviewing large files.",
		action: "View storage details",
		priority: "high",
		createdAt: new Date(),
	},
	{
		id: "2",
		type: "tip",
		title: "Most active project",
		description:
			"'Marketing Campaign' has 3x more views than your average project.",
		action: "View project",
		priority: "medium",
		createdAt: new Date(),
	},
]);

const projectStats = ref<ProjectStats[]>([
	{
		id: "1",
		name: "Marketing Campaign",
		type: "image",
		views: 1250,
		edits: 45,
		exports: 23,
		lastModified: new Date(),
	},
	{
		id: "2",
		name: "Product Launch",
		type: "video",
		views: 890,
		edits: 67,
		exports: 15,
		lastModified: new Date(),
	},
	{
		id: "3",
		name: "Social Media Kit",
		type: "image",
		views: 650,
		edits: 32,
		exports: 48,
		lastModified: new Date(),
	},
]);

const pieChartData = ref([
	{ label: "Images", value: 45, color: "#3b82f6" },
	{ label: "Videos", value: 30, color: "#8b5cf6" },
	{ label: "Audio", value: 15, color: "#10b981" },
	{ label: "Documents", value: 10, color: "#f59e0b" },
]);

const heatmapData = ref([
	{ date: "2024-01-01", count: 5 },
	{ date: "2024-01-02", count: 8 },
	{ date: "2024-01-03", count: 12 },
	{ date: "2024-01-04", count: 3 },
	{ date: "2024-01-05", count: 15 },
	{ date: "2024-01-06", count: 7 },
	{ date: "2024-01-07", count: 20 },
]);

const collaborationData = ref({
	sharedProjects: 12,
	collaborators: 8,
	comments: 145,
	teamContributions: [
		{ name: "Alice", contributions: 45 },
		{ name: "Bob", contributions: 32 },
		{ name: "Charlie", contributions: 28 },
	],
});

const aiUsageData = ref([
	{
		feature: "Image Generation",
		uses: 156,
		tokens: 45000,
		cost: 2.34,
		lastUsed: new Date(),
	},
	{
		feature: "Color Correction",
		uses: 89,
		tokens: 12000,
		cost: 0.78,
		lastUsed: new Date(),
	},
	{
		feature: "Auto Tagging",
		uses: 234,
		tokens: 8000,
		cost: 0.45,
		lastUsed: new Date(),
	},
]);

const cleanupSuggestions = ref([
	{
		id: "1",
		name: "old_backup_v1.jpg",
		size: 52428800,
		type: "unused" as const,
		lastAccessed: new Date("2023-06-01"),
		path: "/backups/",
	},
	{
		id: "2",
		name: "duplicate_export_final_2.png",
		size: 15728640,
		type: "duplicate" as const,
		lastAccessed: new Date("2023-12-01"),
		path: "/exports/",
	},
]);

const exportFormatStats = ref([
	{ format: "PNG", count: 234, percentage: 45 },
	{ format: "JPG", count: 156, percentage: 30 },
	{ format: "MP4", count: 78, percentage: 15 },
	{ format: "PDF", count: 52, percentage: 10 },
]);

const performanceMetrics = ref([
	{
		name: "API Response",
		value: 124,
		unit: "ms",
		target: 200,
		status: "good" as const,
	},
	{
		name: "Page Load",
		value: 1.2,
		unit: "s",
		target: 2,
		status: "good" as const,
	},
	{
		name: "Error Rate",
		value: 0.5,
		unit: "%",
		target: 1,
		status: "good" as const,
	},
	{
		name: "Uptime",
		value: 99.9,
		unit: "%",
		target: 99,
		status: "good" as const,
	},
]);

const comparisonData = ref({
	current: [
		{ label: "Projects", value: 45 },
		{ label: "Media Files", value: 1280 },
		{ label: "Storage", value: 5.2 },
		{ label: "Exports", value: 234 },
	],
	previous: [
		{ label: "Projects", value: 38 },
		{ label: "Media Files", value: 1050 },
		{ label: "Storage", value: 4.1 },
		{ label: "Exports", value: 198 },
	],
});

const goals = ref([
	{
		id: "1",
		name: "Create 50 Projects",
		target: 50,
		current: 45,
		unit: "projects",
		deadline: new Date("2024-03-01"),
	},
	{
		id: "2",
		name: "Export 500 Files",
		target: 500,
		current: 234,
		unit: "files",
		deadline: new Date("2024-02-28"),
	},
]);

const geographicData = ref([
	{ country: "United States", code: "🇺🇸", users: 1250, projects: 45 },
	{ country: "United Kingdom", code: "🇬🇧", users: 680, projects: 23 },
	{ country: "Germany", code: "🇩🇪", users: 520, projects: 18 },
	{ country: "France", code: "🇫🇷", users: 380, projects: 12 },
]);

const deviceData = ref([
	{
		type: "desktop" as const,
		os: "Windows",
		browser: "Chrome",
		percentage: 65,
	},
	{ type: "mobile" as const, os: "Android", browser: "Chrome", percentage: 20 },
	{ type: "tablet" as const, os: "iOS", browser: "Safari", percentage: 15 },
]);

const templateUsage = ref([
	{
		templateId: "1",
		name: "Social Media Post",
		category: "Social",
		uses: 234,
		rating: 4.5,
	},
	{
		templateId: "2",
		name: "Product Showcase",
		category: "Marketing",
		uses: 189,
		rating: 4.8,
	},
	{
		templateId: "3",
		name: "YouTube Thumbnail",
		category: "Video",
		uses: 156,
		rating: 4.2,
	},
]);

const cohortData = ref([
	{ cohort: "2024-01", weeks: [100, 85, 72, 65, 58, 52, 48, 45] },
	{ cohort: "2024-02", weeks: [100, 82, 70, 62] },
	{ cohort: "2024-03", weeks: [100, 88, 75] },
]);

const anomalies = ref([
	{
		id: "1",
		metric: "Storage Usage",
		detectedAt: new Date(),
		severity: "high" as const,
		message: "Unusual spike in storage usage detected",
		expectedValue: 5,
		actualValue: 12,
		isRead: false,
	},
]);

// Real-time updates
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

function handleDateRangeChange(
	range: { start: string; end: string; label: string },
) {
	fetchAnalytics();
}

function handleWidgetToggle(id: string) {
	const widget = widgets.value.find(w => w.id === id);
	if (widget) {
		widget.visible = !widget.visible;
	}
}

function handleWidgetReorder(newWidgets: typeof widgets.value) {
	widgets.value = newWidgets;
}

function handleInsightAction(insight: Insight) {
	console.log("Insight action:", insight.action);
}

function handleCleanupDelete(id: string) {
	cleanupSuggestions.value = cleanupSuggestions.value.filter(s => s.id !== id);
}

function handleCleanupDeleteAll() {
	cleanupSuggestions.value = [];
}

function handleGoalAdd() {
	console.log("Add goal");
}

function handleGoalEdit(id: string) {
	console.log("Edit goal:", id);
}

function handleGoalDelete(id: string) {
	goals.value = goals.value.filter(g => g.id !== id);
}

function handleAnomalyDismiss(id: string) {
	const anomaly = anomalies.value.find(a => a.id === id);
	if (anomaly) {
		anomaly.isRead = true;
	}
}

function handleAnomalyView(id: string) {
	console.log("View anomaly:", id);
}

// Lifecycle
onMounted(() => {
	fetchAnalytics();
	startRealtimeUpdates();
});

onUnmounted(() => {
	if (refreshInterval.value) {
		clearInterval(refreshInterval.value);
	}
});

const visibleWidgetsList = computed(() =>
	widgets.value.filter(w => w.visible).sort((a, b) => a.order - b.order)
);
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 analytics-container">
			<!-- Header -->
			<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						Analytics Dashboard
					</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">
						Comprehensive insights and statistics for your media studio
					</p>
				</div>
				<div class="flex items-center gap-3 flex-wrap">
					<RealTimeIndicator
						:is-live="isLive"
						:last-update="lastUpdate"
						@toggle="toggleRealtime"
					/>
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

			<div
				v-else-if="error"
				class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 mb-6"
			>
				{{ error }}
			</div>

			<template v-else-if="analyticsData">
				<!-- Dashboard Customizer -->
				<div v-if="showCustomizer" class="mb-6">
					<DashboardCustomizer
						:widgets="widgets"
						@toggle="handleWidgetToggle"
						@reorder="handleWidgetReorder"
					/>
				</div>

				<!-- Overview Cards -->
				<div
					v-if="visibleWidgetsList.find(w => w.id === 'overview')"
					class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
				>
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
					<!-- Time Series Charts -->
					<TimeSeriesChart
						v-if="visibleWidgetsList.find(w => w.id === 'timeseries')"
						:data="timeSeriesData"
						title="Activity Trends"
						color="#3b82f6"
					/>

					<!-- AI Insights Panel -->
					<InsightsPanel
						v-if="visibleWidgetsList.find(w => w.id === 'insights')"
						:insights="insights"
						@action="handleInsightAction"
					/>

					<!-- Storage Forecasting -->
					<ForecastingCard
						v-if="visibleWidgetsList.find(w => w.id === 'forecasting')"
						:historical-data="timeSeriesData.map(d => ({
							date: d.date,
							value: d.value * 1024 * 1024,
						}))"
					/>

					<!-- Pie Chart - Media Distribution -->
					<PieChart
						v-if="visibleWidgetsList.find(w => w.id === 'piechart')"
						:data="pieChartData"
						title="Media Type Distribution"
					/>

					<!-- Activity Heatmap -->
					<ActivityHeatmap
						v-if="visibleWidgetsList.find(w => w.id === 'heatmap')"
						:data="heatmapData"
						title="User Activity"
					/>

					<!-- Collaboration Analytics -->
					<CollaborationAnalytics
						v-if="visibleWidgetsList.find(w => w.id === 'collaboration')"
						:data="collaborationData"
					/>

					<!-- AI Usage Metrics -->
					<AIUsageMetrics
						v-if="visibleWidgetsList.find(w => w.id === 'aiusage')"
						:metrics="aiUsageData"
					/>

					<!-- Export Format Stats -->
					<ExportFormatStats
						v-if="visibleWidgetsList.find(w => w.id === 'exportstats')"
						:stats="exportFormatStats"
					/>

					<!-- Performance Metrics -->
					<PerformanceMetrics
						v-if="visibleWidgetsList.find(w => w.id === 'performance')"
						:metrics="performanceMetrics"
					/>

					<!-- Comparison Mode -->
					<ComparisonMode
						v-if="visibleWidgetsList.find(w => w.id === 'comparison')"
						:data="comparisonData"
						title="Period Comparison"
					/>

					<!-- Goal Tracking -->
					<GoalTracking
						v-if="visibleWidgetsList.find(w => w.id === 'goals')"
						:goals="goals"
						@add="handleGoalAdd"
						@edit="handleGoalEdit"
						@delete="handleGoalDelete"
					/>

					<!-- Geographic Map -->
					<GeographicMap
						v-if="visibleWidgetsList.find(w => w.id === 'geographic')"
						:data="geographicData"
					/>

					<!-- Device Breakdown -->
					<DeviceBreakdown
						v-if="visibleWidgetsList.find(w => w.id === 'device')"
						:devices="deviceData"
					/>

					<!-- Template Usage -->
					<TemplateUsage
						v-if="visibleWidgetsList.find(w => w.id === 'templateusage')"
						:templates="templateUsage"
					/>
				</div>

				<!-- Full-width widgets -->
				<div class="space-y-6">
					<!-- Project Leaderboard -->
					<LeaderboardTable
						v-if="visibleWidgetsList.find(w => w.id === 'leaderboard')"
						:projects="projectStats"
					/>

					<!-- Cohort Analysis -->
					<CohortAnalysis
						v-if="visibleWidgetsList.find(w => w.id === 'cohort')"
						:cohorts="cohortData"
					/>

					<!-- Storage Cleanup Suggestions -->
					<StorageCleanupSuggestions
						v-if="visibleWidgetsList.find(w => w.id === 'cleanup')"
						:suggestions="cleanupSuggestions"
						@delete="handleCleanupDelete"
						@delete-all="handleCleanupDeleteAll"
					/>

					<!-- Anomaly Alerts -->
					<AnomalyAlerts
						v-if="visibleWidgetsList.find(w => w.id === 'anomaly')"
						:anomalies="anomalies"
						@dismiss="handleAnomalyDismiss"
						@view="handleAnomalyView"
					/>
				</div>
			</template>
		</div>
	</div>
</template>
