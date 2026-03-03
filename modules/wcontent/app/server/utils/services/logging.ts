import type { LogEntry, LogQuery } from "../../../shared/types/logging";

export class Logger {
	private logs: LogEntry[] = [];
	private maxLogs = 1000;

	log(level: "info" | "warn" | "error" | "debug", message: string, context?: Record<string, any>): void {
		const entry: LogEntry = {
			id: `log-${Date.now()}-${Math.random().toString(36).substring(2)}`,
			level,
			message,
			timestamp: Date.now(),
			timestampISO: new Date().toISOString(),
			context,
		};

		if (level === "error" && context?.stack) {
			entry.stack = context.stack as string;
		}

		this.logs.push(entry);

		if (this.logs.length > this.maxLogs) {
			this.logs.shift();
		}

		if (typeof console !== "undefined") {
			console[level](`[${level.toUpperCase()}] ${message}`, context || "");
		}
	}

	info(message: string, context?: Record<string, any>): void {
		this.log("info", message, context);
	}

	warn(message: string, context?: Record<string, any>): void {
		this.log("warn", message, context);
	}

	error(message: string, error?: Error | Record<string, unknown>): void {
		const context: Record<string, unknown> = {};
		if (error instanceof Error) {
			context.stack = error.stack;
			context.message = error.message;
			context.name = error.name;
		} else if (error) {
			Object.assign(context, error);
		}
		this.log("error", message, context);
	}

	debug(message: string, context?: Record<string, any>): void {
		this.log("debug", message, context);
	}

	getLogs(query?: LogQuery): LogEntry[] {
		let filtered = this.logs;

		if (query?.level) {
			filtered = filtered.filter(log => log.level === query.level);
		}

		if (query?.since) {
			filtered = filtered.filter(log => log.timestamp >= query.since!);
		}

		const offset = query?.offset || 0;
		const limit = query?.limit || 100;

		return filtered.slice(offset, offset + limit);
	}

	clearLogs(): void {
		this.logs = [];
	}

	getStats(): { total: number; byLevel: Record<string, number> } {
		const byLevel: Record<string, number> = {
			info: 0,
			warn: 0,
			error: 0,
			debug: 0,
		};

		for (const log of this.logs) {
			byLevel[log.level]++;
		}

		return {
			total: this.logs.length,
			byLevel,
		};
	}
}

let instance: Logger | null = null;

export function getLogger(): Logger {
	if (!instance) {
		instance = new Logger();
	}
	return instance;
}
