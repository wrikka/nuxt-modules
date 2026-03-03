import type { CancelScheduleResult, ScheduledContent, ScheduleResult } from "../../../shared/types/scheduling";

export class ContentScheduler {
	private schedules: Map<string, ScheduledContent> = new Map();
	private intervalId: ReturnType<typeof setInterval> | null = null;

	constructor() {
		this.startScheduler();
	}

	async schedule(
		contentPath: string,
		action: "publish" | "unpublish",
		scheduledAt: Date,
	): Promise<ScheduleResult> {
		try {
			const schedule: ScheduledContent = {
				id: `${contentPath}-${Date.now()}`,
				contentPath,
				action,
				scheduledAt: scheduledAt.getTime(),
				scheduledAtISO: scheduledAt.toISOString(),
				status: "pending",
			};

			this.schedules.set(schedule.id, schedule);

			return {
				success: true,
				schedule,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to schedule content",
			};
		}
	}

	async cancelSchedule(scheduleId: string): Promise<CancelScheduleResult> {
		if (!this.schedules.has(scheduleId)) {
			return {
				success: false,
				error: "Schedule not found",
			};
		}

		this.schedules.delete(scheduleId);
		return { success: true };
	}

	getSchedules(contentPath?: string): ScheduledContent[] {
		const allSchedules = Array.from(this.schedules.values());
		if (contentPath) {
			return allSchedules.filter(s => s.contentPath === contentPath);
		}
		return allSchedules;
	}

	private startScheduler() {
		this.intervalId = setInterval(() => {
			this.checkAndExecuteSchedules();
		}, 60000);
	}

	private checkAndExecuteSchedules() {
		const now = Date.now();

		for (const [id, schedule] of this.schedules.entries()) {
			if (schedule.status === "pending" && schedule.scheduledAt <= now) {
				void this.executeSchedule(id, schedule);
			}
		}
	}

	private async executeSchedule(id: string, schedule: ScheduledContent) {
		try {
			schedule.status = "completed";
			schedule.executedAt = Date.now();
			schedule.executedAtISO = new Date().toISOString();

			this.schedules.set(id, schedule);
		} catch (error: any) {
			schedule.status = "failed";
			schedule.error = error.message;
			this.schedules.set(id, schedule);
		}
	}

	stopScheduler() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

let instance: ContentScheduler | null = null;

export function getContentScheduler(): ContentScheduler {
	if (!instance) {
		instance = new ContentScheduler();
	}
	return instance;
}
