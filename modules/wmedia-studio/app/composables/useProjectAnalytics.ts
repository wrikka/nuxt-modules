import { computed, ref } from "vue";

export interface ProjectAnalytics {
	projectId: string;
	viewCount: number;
	editCount: number;
	exportCount: number;
	shareCount: number;
	commentCount: number;
	averageSessionDuration: number;
	lastViewedAt?: Date;
	lastEditedAt?: Date;
	createdAt: Date;
}

interface ProjectAnalyticsData {
	views: { date: Date; count: number }[];
	edits: { date: Date; count: number }[];
	exports: { date: Date; count: number }[];
	shares: { date: Date; count: number }[];
	sessions: { date: Date; duration: number }[];
}

export function useProjectAnalytics(projectId: Ref<string>) {
	const analytics = ref<ProjectAnalytics | null>(null);
	const analyticsData = ref<ProjectAnalyticsData | null>(null);
	const isLoading = ref(false);

	const totalViews = computed(() => analytics.value?.viewCount || 0);
	const totalEdits = computed(() => analytics.value?.editCount || 0);
	const totalExports = computed(() => analytics.value?.exportCount || 0);
	const totalShares = computed(() => analytics.value?.shareCount || 0);
	const totalComments = computed(() => analytics.value?.commentCount || 0);

	const loadAnalytics = async () => {
		isLoading.value = true;
		try {
			const result = await $fetch<{ analytics: ProjectAnalytics }>(`/api/projects/${projectId.value}/analytics`);
			analytics.value = result.analytics;
		} catch (error) {
			console.error("Failed to load analytics:", error);
			analytics.value = null;
		} finally {
			isLoading.value = false;
		}
	};

	const loadAnalyticsData = async (startDate?: Date, endDate?: Date) => {
		isLoading.value = true;
		try {
			const params: Record<string, string> = {};
			if (startDate) params.startDate = startDate.toISOString();
			if (endDate) params.endDate = endDate.toISOString();

			const result = await $fetch<{ data: ProjectAnalyticsData }>(`/api/projects/${projectId.value}/analytics/data`, {
				params,
			});
			analyticsData.value = result.data;
		} catch (error) {
			console.error("Failed to load analytics data:", error);
			analyticsData.value = null;
		} finally {
			isLoading.value = false;
		}
	};

	const trackView = async () => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/view`, {
				method: "POST",
			});

			if (analytics.value) {
				analytics.value.viewCount++;
				analytics.value.lastViewedAt = new Date();
			}
		} catch (error) {
			console.error("Failed to track view:", error);
		}
	};

	const trackEdit = async () => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/edit`, {
				method: "POST",
			});

			if (analytics.value) {
				analytics.value.editCount++;
				analytics.value.lastEditedAt = new Date();
			}
		} catch (error) {
			console.error("Failed to track edit:", error);
		}
	};

	const trackExport = async () => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/export`, {
				method: "POST",
			});

			if (analytics.value) {
				analytics.value.exportCount++;
			}
		} catch (error) {
			console.error("Failed to track export:", error);
		}
	};

	const trackShare = async () => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/share`, {
				method: "POST",
			});

			if (analytics.value) {
				analytics.value.shareCount++;
			}
		} catch (error) {
			console.error("Failed to track share:", error);
		}
	};

	const trackComment = async () => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/comment`, {
				method: "POST",
			});

			if (analytics.value) {
				analytics.value.commentCount++;
			}
		} catch (error) {
			console.error("Failed to track comment:", error);
		}
	};

	const trackSession = async (duration: number) => {
		try {
			await $fetch(`/api/projects/${projectId.value}/analytics/session`, {
				method: "POST",
				body: { duration },
			});

			if (analytics.value) {
				const totalDuration = analytics.value.averageSessionDuration * (totalEdits.value - 1) + duration;
				analytics.value.averageSessionDuration = totalDuration / totalEdits.value;
			}
		} catch (error) {
			console.error("Failed to track session:", error);
		}
	};

	const getViewsOverTime = (days: number = 30) => {
		if (!analyticsData.value?.views) return [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return analyticsData.value.views.filter(v => v.date >= cutoffDate);
	};

	const getEditsOverTime = (days: number = 30) => {
		if (!analyticsData.value?.edits) return [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return analyticsData.value.edits.filter(e => e.date >= cutoffDate);
	};

	const getExportsOverTime = (days: number = 30) => {
		if (!analyticsData.value?.exports) return [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return analyticsData.value.exports.filter(e => e.date >= cutoffDate);
	};

	const getSharesOverTime = (days: number = 30) => {
		if (!analyticsData.value?.shares) return [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return analyticsData.value.shares.filter(s => s.date >= cutoffDate);
	};

	const getSessionDurations = (days: number = 30) => {
		if (!analyticsData.value?.sessions) return [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return analyticsData.value.sessions.filter(s => s.date >= cutoffDate);
	};

	const getAverageSessionDuration = (days: number = 30) => {
		const sessions = getSessionDurations(days);
		if (sessions.length === 0) return 0;

		const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
		return totalDuration / sessions.length;
	};

	const getPeakActivityTime = () => {
		if (!analyticsData.value?.edits) return null;

		const hourCounts = new Map<number, number>();

		analyticsData.value.edits.forEach((edit) => {
			const hour = edit.date.getHours();
			hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
		});

		let peakHour = 0;
		let maxCount = 0;

		hourCounts.forEach((count, hour) => {
			if (count > maxCount) {
				maxCount = count;
				peakHour = hour;
			}
		});

		return peakHour;
	};

	const getActivitySummary = () => {
		return {
			views: totalViews.value,
			edits: totalEdits.value,
			exports: totalExports.value,
			shares: totalShares.value,
			comments: totalComments.value,
			averageSessionDuration: analytics.value?.averageSessionDuration || 0,
			lastViewedAt: analytics.value?.lastViewedAt,
			lastEditedAt: analytics.value?.lastEditedAt,
		};
	};

	return {
		analytics,
		analyticsData,
		isLoading,
		totalViews,
		totalEdits,
		totalExports,
		totalShares,
		totalComments,
		loadAnalytics,
		loadAnalyticsData,
		trackView,
		trackEdit,
		trackExport,
		trackShare,
		trackComment,
		trackSession,
		getViewsOverTime,
		getEditsOverTime,
		getExportsOverTime,
		getSharesOverTime,
		getSessionDurations,
		getAverageSessionDuration,
		getPeakActivityTime,
		getActivitySummary,
	};
}
