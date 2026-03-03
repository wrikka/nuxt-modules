import type { DataPoint } from '../../../../types/chart-basic';
import type { SortConfig } from './types';

export function sortDataPoints(
	points: DataPoint[],
	sortConfigs: SortConfig[],
): DataPoint[] {
	return [...points].sort((a, b) => {
		for (const config of sortConfigs) {
			const { field, direction, caseSensitive = false } = config;

			let aValue = a[field];
			let bValue = b[field];

			// Handle null/undefined values
			if (aValue == null && bValue == null) continue;
			if (aValue == null) return direction === "asc" ? -1 : 1;
			if (bValue == null) return direction === "asc" ? 1 : -1;

			// String comparison
			if (typeof aValue === "string" && typeof bValue === "string") {
				const cmpA = caseSensitive ? aValue : aValue.toLowerCase();
				const cmpB = caseSensitive ? bValue : bValue.toLowerCase();
				if (cmpA < cmpB) return direction === "asc" ? -1 : 1;
				if (cmpA > cmpB) return direction === "asc" ? 1 : -1;
			}

			// Numeric comparison
			if (typeof aValue === "number" && typeof bValue === "number") {
				if (aValue < bValue) return direction === "asc" ? -1 : 1;
				if (aValue > bValue) return direction === "asc" ? 1 : -1;
			}

			// Date comparison
			if (aValue instanceof Date && bValue instanceof Date) {
				if (aValue < bValue) return direction === "asc" ? -1 : 1;
				if (aValue > bValue) return direction === "asc" ? 1 : -1;
			}

			// Convert to string for other types
			const strA = String(aValue).toLowerCase();
			const strB = String(bValue).toLowerCase();
			if (strA < strB) return direction === "asc" ? -1 : 1;
			if (strA > strB) return direction === "asc" ? 1 : -1;
		}
		return 0;
	});
}
