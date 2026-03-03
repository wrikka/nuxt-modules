import type { Insight, ProjectStats } from "#shared/types/analytics";

export const useMockAnalyticsData = () => {
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
			description: "Your storage usage increased by 25% this week. Consider reviewing large files.",
			action: "View storage details",
			priority: "high",
			createdAt: new Date(),
		},
		{
			id: "2",
			type: "tip",
			title: "Most active project",
			description: "'Marketing Campaign' has 3x more views than your average project.",
			action: "View project",
			priority: "medium",
			createdAt: new Date(),
		},
	]);

	const projectStats = ref<ProjectStats[]>([
		{ id: "1", name: "Marketing Campaign", type: "image", views: 1250, edits: 45, exports: 23, lastModified: new Date() },
		{ id: "2", name: "Product Launch", type: "video", views: 890, edits: 67, exports: 15, lastModified: new Date() },
		{ id: "3", name: "Social Media Kit", type: "image", views: 650, edits: 32, exports: 48, lastModified: new Date() },
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
		{ feature: "Image Generation", uses: 156, tokens: 45000, cost: 2.34, lastUsed: new Date() },
		{ feature: "Color Correction", uses: 89, tokens: 12000, cost: 0.78, lastUsed: new Date() },
		{ feature: "Auto Tagging", uses: 234, tokens: 8000, cost: 0.45, lastUsed: new Date() },
	]);

	const cleanupSuggestions = ref([
		{ id: "1", name: "old_backup_v1.jpg", size: 52428800, type: "unused" as const, lastAccessed: new Date("2023-06-01"), path: "/backups/" },
		{ id: "2", name: "duplicate_export_final_2.png", size: 15728640, type: "duplicate" as const, lastAccessed: new Date("2023-12-01"), path: "/exports/" },
	]);

	const exportFormatStats = ref([
		{ format: "PNG", count: 234, percentage: 45 },
		{ format: "JPG", count: 156, percentage: 30 },
		{ format: "MP4", count: 78, percentage: 15 },
		{ format: "PDF", count: 52, percentage: 10 },
	]);

	const performanceMetrics = ref([
		{ name: "API Response", value: 124, unit: "ms", target: 200, status: "good" as const },
		{ name: "Page Load", value: 1.2, unit: "s", target: 2, status: "good" as const },
		{ name: "Error Rate", value: 0.5, unit: "%", target: 1, status: "good" as const },
		{ name: "Uptime", value: 99.9, unit: "%", target: 99, status: "good" as const },
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
		{ id: "1", name: "Create 50 Projects", target: 50, current: 45, unit: "projects", deadline: new Date("2024-03-01") },
		{ id: "2", name: "Export 500 Files", target: 500, current: 234, unit: "files", deadline: new Date("2024-02-28") },
	]);

	const geographicData = ref([
		{ country: "United States", code: "🇺🇸", users: 1250, projects: 45 },
		{ country: "United Kingdom", code: "🇬🇧", users: 680, projects: 23 },
		{ country: "Germany", code: "🇩🇪", users: 520, projects: 18 },
		{ country: "France", code: "🇫🇷", users: 380, projects: 12 },
	]);

	const deviceData = ref([
		{ type: "desktop" as const, os: "Windows", browser: "Chrome", percentage: 65 },
		{ type: "mobile" as const, os: "Android", browser: "Chrome", percentage: 20 },
		{ type: "tablet" as const, os: "iOS", browser: "Safari", percentage: 15 },
	]);

	const templateUsage = ref([
		{ templateId: "1", name: "Social Media Post", category: "Social", uses: 234, rating: 4.5 },
		{ templateId: "2", name: "Product Showcase", category: "Marketing", uses: 189, rating: 4.8 },
		{ templateId: "3", name: "YouTube Thumbnail", category: "Video", uses: 156, rating: 4.2 },
	]);

	const cohortData = ref([
		{ cohort: "2024-01", weeks: [100, 85, 72, 65, 58, 52, 48, 45] },
		{ cohort: "2024-02", weeks: [100, 82, 70, 62] },
		{ cohort: "2024-03", weeks: [100, 88, 75] },
	]);

	const anomalies = ref([
		{ id: "1", metric: "Storage Usage", detectedAt: new Date(), severity: "high" as const, message: "Unusual spike in storage usage detected", expectedValue: 5, actualValue: 12, isRead: false },
	]);

	return {
		timeSeriesData,
		insights,
		projectStats,
		pieChartData,
		heatmapData,
		collaborationData,
		aiUsageData,
		cleanupSuggestions,
		exportFormatStats,
		performanceMetrics,
		comparisonData,
		goals,
		geographicData,
		deviceData,
		templateUsage,
		cohortData,
		anomalies,
	};
};
