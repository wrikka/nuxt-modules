export interface LogEntry {
	id: string;
	level: "info" | "warn" | "error" | "debug";
	message: string;
	timestamp: number;
	timestampISO: string;
	context?: Record<string, any>;
	stack?: string;
}

export interface LogQuery {
	level?: "info" | "warn" | "error" | "debug";
	limit?: number;
	offset?: number;
	since?: number;
}
