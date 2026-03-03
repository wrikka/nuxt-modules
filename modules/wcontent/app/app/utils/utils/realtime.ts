import type { ContentItem } from "../../../shared/types";

export interface RealtimeEvent {
	type: "content:created" | "content:updated" | "content:deleted" | "content:published" | "content:unpublished";
	_path: string;
	item?: ContentItem;
	timestamp: number;
	_userId?: string;
}

export interface RealtimeSubscription {
	_path: string;
	callback: (event: RealtimeEvent) => void;
	unsubscribe: () => void;
}

export class RealtimeManager {
	private subscriptions: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();
	private eventHistory: RealtimeEvent[] = [];
	private maxHistorySize = 100;

	subscribe(_path: string, callback: (event: RealtimeEvent) => void): RealtimeSubscription {
		if (!this.subscriptions.has(_path)) {
			this.subscriptions.set(_path, new Set());
		}

		this.subscriptions.get(_path)!.add(callback);

		return {
			_path,
			callback,
			unsubscribe: () => this.unsubscribe(_path, callback),
		};
	}

	unsubscribe(_path: string, callback: (event: RealtimeEvent) => void): void {
		const subs = this.subscriptions.get(_path);
		if (subs) {
			subs.delete(callback);
			if (subs.size === 0) {
				this.subscriptions.delete(_path);
			}
		}
	}

	publish(event: RealtimeEvent): void {
		// Add to history
		this.eventHistory.push(event);
		if (this.eventHistory.length > this.maxHistorySize) {
			this.eventHistory.shift();
		}

		// Notify subscribers
		for (const [_path, callbacks] of this.subscriptions.entries()) {
			if (event._path.startsWith(_path) || _path === "*") {
				for (const callback of callbacks) {
					try {
						callback(event);
					} catch (error) {
						console.error(`Error in realtime callback for ${_path}:`, error);
					}
				}
			}
		}
	}

	getHistory(_path?: string, limit = 10): RealtimeEvent[] {
		const filtered = _path
			? this.eventHistory.filter((e) => e._path.startsWith(_path))
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
