import type { ContentItem } from "../../../shared/types";

export interface AggregationResult {
	count: number;
	sum?: number;
	avg?: number;
	min?: number;
	max?: number;
}

export class ContentAggregation {
	count<T = ContentItem>(items: T[], field?: string): number {
		if (field) {
			return items.filter((item) => (item as any)[field] !== undefined).length;
		}
		return items.length;
	}

	sum<T = ContentItem>(items: T[], field: string): number {
		return items.reduce((total, item) => {
			const value = (item as any)[field];
			return total + (typeof value === "number" ? value : 0);
		}, 0);
	}

	avg<T = ContentItem>(items: T[], field: string): number {
		if (items.length === 0) return 0;

		const total = this.sum(items, field);
		return total / items.length;
	}

	min<T = ContentItem>(items: T[], field: string): number | undefined {
		if (items.length === 0) return undefined;

		let min: number | undefined = undefined;

		for (const item of items) {
			const value = (item as any)[field];
			if (typeof value === "number") {
				if (min === undefined || value < min) {
					min = value;
				}
			}
		}

		return min;
	}

	max<T = ContentItem>(items: T[], field: string): number | undefined {
		if (items.length === 0) return undefined;

		let max: number | undefined = undefined;

		for (const item of items) {
			const value = (item as any)[field];
			if (typeof value === "number") {
				if (max === undefined || value > max) {
					max = value;
				}
			}
		}

		return max;
	}

	groupBy<T = ContentItem>(items: T[], field: string): Record<string, T[]> {
		const groups: Record<string, T[]> = {};

		for (const item of items) {
			const value = (item as any)[field];
			const key = String(value);

			if (!groups[key]) {
				groups[key] = [];
			}

			groups[key].push(item);
		}

		return groups;
	}

	groupByCount<T = ContentItem>(items: T[], field: string): Record<string, number> {
		const groups = this.groupBy(items, field);
		const counts: Record<string, number> = {};

		for (const [key, group] of Object.entries(groups)) {
			counts[key] = group.length;
		}

		return counts;
	}

	aggregate<T = ContentItem>(
		items: T[],
		field: string,
		operations: ("count" | "sum" | "avg" | "min" | "max")[],
	): AggregationResult {
		const result: AggregationResult = {
			count: 0,
		};

		for (const op of operations) {
			switch (op) {
				case "count":
					result.count = this.count(items, field);
					break;
				case "sum":
					result.sum = this.sum(items, field);
					break;
				case "avg":
					result.avg = this.avg(items, field);
					break;
				case "min":
					result.min = this.min(items, field);
					break;
				case "max":
					result.max = this.max(items, field);
					break;
			}
		}

		return result;
	}

	stats<T = ContentItem>(items: T[], field: string): {
		count: number;
		sum: number;
		avg: number;
		min: number | undefined;
		max: number | undefined;
	} {
		const count = this.count(items, field);
		const sum = this.sum(items, field);
		const avg = this.avg(items, field);
		const min = this.min(items, field);
		const max = this.max(items, field);

		return { count, sum, avg, min, max };
	}

	distinct<T = ContentItem>(items: T[], field: string): any[] {
		const values = new Set();

		for (const item of items) {
			const value = (item as any)[field];
			if (value !== undefined) {
				values.add(value);
			}
		}

		return Array.from(values);
	}

	distinctCount<T = ContentItem>(items: T[], field: string): number {
		return this.distinct(items, field).length;
	}
}

let aggregationInstance: ContentAggregation | null = null;

export function getContentAggregation(): ContentAggregation {
	if (!aggregationInstance) {
		aggregationInstance = new ContentAggregation();
	}
	return aggregationInstance;
}
