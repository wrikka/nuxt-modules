import { createError, defineEventHandler, getQuery } from "h3";
import type { CancelScheduleResult } from "../../../shared/types/scheduling";
import { getContentScheduler } from "../../utils/services/scheduling";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const scheduleId = query.id as string;

	if (!scheduleId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Schedule ID is required",
		});
	}

	const scheduler = getContentScheduler();
	const result = await scheduler.cancelSchedule(scheduleId);

	return result as CancelScheduleResult;
});
