import type { AnalyticsData, Insight, MediaStats, ProjectStats, UsageStats } from "#shared/types/analytics";
import { formatBytes, formatDate } from "#shared/utils/formatters";

export function useAnalytics() {
	const analyticsData = ref<AnalyticsData | null>(null);
	const projectStats = ref<ProjectStats[]>([]);
	const mediaStats = ref<MediaStats[]>([]);
	const usageStats = ref<UsageStats[]>([]);
	const insights = ref<Insight[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const storageUsed = computed(() => analyticsData.value?.totalStorage || 0);
	const storagePercentage = computed(() => {
		if (!analyticsData.value) return 0;
		const { totalStorage } = analyticsData.value;
		const maxStorage = 10 * 1024 * 1024 * 1024; // 10GB
		return (totalStorage / maxStorage) * 100;
	});

	const fetchAnalytics = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ analytics: AnalyticsData }>("/api/analytics");
			analyticsData.value = response.analytics;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch analytics";
		} finally {
			loading.value = false;
		}
	};

	const fetchProjectStats = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ stats: ProjectStats[] }>("/api/analytics/projects");
			projectStats.value = response.stats;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch project stats";
		} finally {
			loading.value = false;
		}
	};

	const fetchMediaStats = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ stats: MediaStats[] }>("/api/analytics/media");
			mediaStats.value = response.stats;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch media stats";
		} finally {
			loading.value = false;
		}
	};

	const fetchUsageStats = async (period: "daily" | "weekly" | "monthly" = "weekly") => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ stats: UsageStats[] }>(`/api/analytics/usage?period=${period}`);
			usageStats.value = response.stats;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch usage stats";
		} finally {
			loading.value = false;
		}
	};

	const fetchInsights = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ insights: Insight[] }>("/api/analytics/insights");
			insights.value = response.insights;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch insights";
		} finally {
			loading.value = false;
		}
	};

	return {
		analyticsData,
		projectStats,
		mediaStats,
		usageStats,
		insights,
		storageUsed,
		storagePercentage,
		loading,
		error,
		fetchAnalytics,
		fetchProjectStats,
		fetchMediaStats,
		fetchUsageStats,
		fetchInsights,
		formatBytes,
		formatDate,
	};
}
