import type { ContentItem } from "../../../shared/types";

export interface FilterOperator {
	$eq?: any;
	$ne?: any;
	$gt?: any;
	$gte?: any;
	$lt?: any;
	$lte?: any;
	$in?: any[];
	$nin?: any[];
	$regex?: string | RegExp;
	$exists?: boolean;
}

export interface FilterQuery {
	[field: string]: unknown;
}

export class ContentFiltering {
	filter<T = ContentItem>(items: T[], query: FilterQuery): T[] {
		return items.filter((item) => this.matches(item, query));
	}

	private matches<T>(item: T, query: FilterQuery): boolean {
		for (const [field, value] of Object.entries(query)) {
			const itemValue = (item as any)[field];

			if (typeof value === "object" && value !== null) {
				// Handle operators
				const operator = value as FilterOperator;

				if (operator.$eq !== undefined && itemValue !== operator.$eq) {
					return false;
				}

				if (operator.$ne !== undefined && itemValue === operator.$ne) {
					return false;
				}

				if (operator.$gt !== undefined && itemValue <= operator.$gt) {
					return false;
				}

				if (operator.$gte !== undefined && itemValue < operator.$gte) {
					return false;
				}

				if (operator.$lt !== undefined && itemValue >= operator.$lt) {
					return false;
				}

				if (operator.$lte !== undefined && itemValue > operator.$lte) {
					return false;
				}

				if (operator.$in && !operator.$in.includes(itemValue)) {
					return false;
				}

				if (operator.$nin && operator.$nin.includes(itemValue)) {
					return false;
				}

				if (operator.$regex) {
					const regex = typeof operator.$regex === "string" ? new RegExp(operator.$regex) : operator.$regex;
					if (!regex.test(String(itemValue))) {
						return false;
					}
				}

				if (operator.$exists !== undefined) {
					const exists = itemValue !== undefined && itemValue !== null;
					if (exists !== operator.$exists) {
						return false;
					}
				}
			} else {
				// Handle exact match
				if (itemValue !== value) {
					return false;
				}
			}
		}

		return true;
	}

	and<T = ContentItem>(items: T[], ...queries: FilterQuery[]): T[] {
		return items.filter((item) => queries.every((query) => this.matches(item, query)));
	}

	or<T = ContentItem>(items: T[], ...queries: FilterQuery[]): T[] {
		return items.filter((item) => queries.some((query) => this.matches(item, query)));
	}

	not<T = ContentItem>(items: T[], query: FilterQuery): T[] {
		return items.filter((item) => !this.matches(item, query));
	}

	in<T = ContentItem>(items: T[], field: string, values: any[]): T[] {
		return items.filter((item) => values.includes((item as any)[field]));
	}

	nin<T = ContentItem>(items: T[], field: string, values: any[]): T[] {
		return items.filter((item) => !values.includes((item as any)[field]));
	}

	between<T = ContentItem>(items: T[], field: string, min: number, max: number): T[] {
		return items.filter((item) => {
			const value = (item as any)[field];
			return value >= min && value <= max;
		});
	}

	search<T = ContentItem>(items: T[], fields: string[], query: string): T[] {
		const lowerQuery = query.toLowerCase();

		return items.filter((item) => {
			return fields.some((field) => {
				const value = String((item as any)[field] || "").toLowerCase();
				return value.includes(lowerQuery);
			});
		});
	}
}

let filteringInstance: ContentFiltering | null = null;

export function getContentFiltering(): ContentFiltering {
	if (!filteringInstance) {
		filteringInstance = new ContentFiltering();
	}
	return filteringInstance;
}
