import type { LogEntry, LogQuery } from "../../shared/types/logging";

export function useLogging() {
	const getLogs = async (query?: LogQuery): Promise<LogEntry[]> => {
		const params: Record<string, any> = {};
		if (query?.level) params.level = query.level;
		if (query?.limit) params.limit = query.limit;
		if (query?.offset) params.offset = query.offset;
		if (query?.since) params.since = query.since;

		const response = await $fetch("/api/logging/logs", {
			method: "GET",
			query: params,
		});
		return response as LogEntry[];
	};

	const getStats = async () => {
		const response = await $fetch("/api/logging/stats", {
			method: "GET",
		});
		return response;
	};

	return {
		getLogs,
		getStats,
	};
}
