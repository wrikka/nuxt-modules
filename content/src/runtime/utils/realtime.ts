import type { ContentItem } from "../shared/types";

export interface RealtimeEvent {
	type: "content:created" | "content:updated" | "content:deleted" | "content:published" | "content:unpublished";
	path: string;
	item?: ContentItem;
	timestamp: number;
	userId?: string;
}

export interface RealtimeSubscription {
	path: string;
	callback: (event: RealtimeEvent) => void;
	unsubscribe: () => void;
}

export class RealtimeManager {
	private subscriptions: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();
	private eventHistory: RealtimeEvent[] = [];
	private maxHistorySize = 100;

	subscribe(path: string, callback: (event: RealtimeEvent) => void): RealtimeSubscription {
		if (!this.subscriptions.has(path)) {
			this.subscriptions.set(path, new Set());
		}

		this.subscriptions.get(path)!.add(callback);

		return {
			path,
			callback,
			unsubscribe: () => this.unsubscribe(path, callback),
		};
	}

	unsubscribe(path: string, callback: (event: RealtimeEvent) => void): void {
		const subs = this.subscriptions.get(path);
		if (subs) {
			subs.delete(callback);
			if (subs.size === 0) {
				this.subscriptions.delete(path);
			}
		}
	}

	publish(event: RealtimeEvent): void {
		this.eventHistory.push(event);
		if (this.eventHistory.length > this.maxHistorySize) {
			this.eventHistory.shift();
		}

		for (const [path, callbacks] of this.subscriptions.entries()) {
			if (event.path.startsWith(path) || path === "*") {
				for (const callback of callbacks) {
					try {
						callback(event);
					} catch (error) {
						console.error(`Error in realtime callback for ${path}:`, error);
					}
				}
			}
		}
	}

	getHistory(path?: string, limit = 10): RealtimeEvent[] {
		const filtered = path
			? this.eventHistory.filter((e) => e.path.startsWith(path))
			: this.eventHistory;

		return filtered.slice(-limit);
	}

	clearHistory(): void {
		this.eventHistory = [];
	}

	getStats() {
		return {
			subscriptions: this.subscriptions.size,
			totalSubscribers: Array.from(this.subscriptions.values()).reduce(
				(sum, subs) => sum + subs.size,
				0,
			),
			historySize: this.eventHistory.length,
		};
	}
}

let realtimeInstance: RealtimeManager | null = null;

export function getRealtimeManager(): RealtimeManager {
	if (!realtimeInstance) {
		realtimeInstance = new RealtimeManager();
	}
	return realtimeInstance;
}
