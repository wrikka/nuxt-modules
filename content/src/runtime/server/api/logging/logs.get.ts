import { defineEventHandler, getQuery } from "h3";
import type { LogEntry } from "../../../shared/types/logging";
import { getLogger } from "../../utils/services/logging";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { level, limit, offset, since } = query;

	const logger = getLogger();
	const logs = logger.getLogs({
		level: level as any,
		limit: limit ? Number(limit) : undefined,
		offset: offset ? Number(offset) : undefined,
		since: since ? Number(since) : undefined,
	});

	return logs as LogEntry[];
});
