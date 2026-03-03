export interface ActivityLog {
	id: string;
	projectId: string;
	userId: string;
	userName: string;
	action: string;
	entityType: string;
	entityId?: string;
	entityName?: string;
	changes?: Record<string, { old: unknown; new: unknown }>;
	metadata?: Record<string, unknown>;
	timestamp: Date;
}

export interface ActivityFilter {
	userId?: string;
	action?: string;
	entityType?: string;
	startDate?: Date;
	endDate?: Date;
}

export function useActivityLog(projectId: Ref<string>) {
	const activities = ref<ActivityLog[]>([]);
	const isLoading = ref(false);

	const recentActivities = computed(() => {
		return [...activities.value]
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.slice(0, 50);
	});

	const loadActivities = async (filter?: ActivityFilter) => {
		isLoading.value = true;
		try {
			const params: Record<string, string> = {};
			if (filter?.userId) params.userId = filter.userId;
			if (filter?.action) params.action = filter.action;
			if (filter?.entityType) params.entityType = filter.entityType;
			if (filter?.startDate) params.startDate = filter.startDate.toISOString();
			if (filter?.endDate) params.endDate = filter.endDate.toISOString();

			const data = await $fetch<{ activities: ActivityLog[] }>(`/api/projects/${projectId.value}/activities`, {
				params,
			});
			activities.value = data.activities || [];
		} catch (error) {
			console.error("Failed to load activities:", error);
			activities.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const logActivity = async (
		action: string,
		entityType: string,
		entityId?: string,
		entityName?: string,
		changes?: Record<string, { old: unknown; new: unknown }>,
		metadata?: Record<string, unknown>,
	) => {
		try {
			const result = await $fetch<{ activity: ActivityLog }>(`/api/projects/${projectId.value}/activities`, {
				method: "POST",
				body: {
					action,
					entityType,
					entityId,
					entityName,
					changes,
					metadata,
				},
			});

			activities.value.push(result.activity);
			return result.activity;
		} catch (error) {
			console.error("Failed to log activity:", error);
			return null;
		}
	};

	const getActivitiesByUser = (userId: string) => {
		return activities.value.filter(a => a.userId === userId);
	};

	const getActivitiesByAction = (action: string) => {
		return activities.value.filter(a => a.action === action);
	};

	const getActivitiesByEntity = (entityType: string, entityId?: string) => {
		return activities.value.filter(a => a.entityType === entityType && (!entityId || a.entityId === entityId));
	};

	const getActivitiesByDateRange = (startDate: Date, endDate: Date) => {
		return activities.value.filter(a => a.timestamp >= startDate && a.timestamp <= endDate);
	};

	const getActivityStats = () => {
		const stats = {
			total: activities.value.length,
			byAction: new Map<string, number>(),
			byUser: new Map<string, number>(),
			byEntityType: new Map<string, number>(),
		};

		activities.value.forEach(activity => {
			stats.byAction.set(activity.action, (stats.byAction.get(activity.action) || 0) + 1);
			stats.byUser.set(activity.userId, (stats.byUser.get(activity.userId) || 0) + 1);
			stats.byEntityType.set(activity.entityType, (stats.byEntityType.get(activity.entityType) || 0) + 1);
		});

		return stats;
	};

	const exportActivities = async (format: "json" | "csv" = "json") => {
		try {
			const data = await $fetch<{ data: string }>(`/api/projects/${projectId.value}/activities/export`, {
				params: { format },
			});
			return data.data;
		} catch (error) {
			console.error("Failed to export activities:", error);
			return null;
		}
	};

	return {
		activities,
		recentActivities,
		isLoading,
		loadActivities,
		logActivity,
		getActivitiesByUser,
		getActivitiesByAction,
		getActivitiesByEntity,
		getActivitiesByDateRange,
		getActivityStats,
		exportActivities,
	};
}
