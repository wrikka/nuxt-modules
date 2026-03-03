import { createError, defineEventHandler, readBody } from "h3";
import type { ScheduleResult } from "../../../shared/types/scheduling";
import { getContentScheduler } from "../../utils/services/scheduling";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { contentPath, action, scheduledAt } = body;

	if (!contentPath || !action || !scheduledAt) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path, action, and scheduled time are required",
		});
	}

	const scheduler = getContentScheduler();
	const result = await scheduler.schedule(contentPath, action, new Date(scheduledAt));

	return result as ScheduleResult;
});
