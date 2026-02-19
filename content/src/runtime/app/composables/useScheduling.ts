import type { CancelScheduleResult, ScheduledContent, ScheduleResult } from "../../shared/types/scheduling";

export function useScheduling() {
	const schedule = async (
		contentPath: string,
		action: "publish" | "unpublish",
		scheduledAt: Date,
	): Promise<ScheduleResult> => {
		const response = await $fetch("/api/scheduling/schedule", {
			method: "POST",
			body: { contentPath, action, scheduledAt: scheduledAt.toISOString() },
		});
		return response as ScheduleResult;
	};

	const cancelSchedule = async (scheduleId: string): Promise<CancelScheduleResult> => {
		const response = await $fetch("/api/scheduling/cancel", {
			method: "DELETE",
			query: { id: scheduleId },
		});
		return response as CancelScheduleResult;
	};

	const getSchedules = async (contentPath?: string): Promise<ScheduledContent[]> => {
		const response = await $fetch("/api/scheduling/list", {
			method: "GET",
			query: contentPath ? { path: contentPath } : {},
		});
		return response as ScheduledContent[];
	};

	return {
		schedule,
		cancelSchedule,
		getSchedules,
	};
}
