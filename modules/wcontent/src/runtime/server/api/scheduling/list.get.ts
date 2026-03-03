import { defineEventHandler, getQuery } from "h3";
import type { ScheduledContent } from "../../../shared/types/scheduling";
import { getContentScheduler } from "../../utils/services/scheduling";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;

	const scheduler = getContentScheduler();
	const schedules = scheduler.getSchedules(contentPath);

	return schedules as ScheduledContent[];
});
