export interface ScheduledContent {
	id: string;
	contentPath: string;
	action: "publish" | "unpublish";
	scheduledAt: number;
	scheduledAtISO: string;
	status: "pending" | "completed" | "failed";
	executedAt?: number;
	executedAtISO?: string;
	error?: string;
}

export interface ScheduleResult {
	success: boolean;
	schedule?: ScheduledContent;
	error?: string;
}

export interface CancelScheduleResult {
	success: boolean;
	error?: string;
}
