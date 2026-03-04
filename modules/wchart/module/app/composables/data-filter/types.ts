import type { DataPoint } from '../../../../types/chart-basic';

/**
 * Filter operators
 */
export type FilterOperator =
	| "equals"
	| "notEquals"
	| "greaterThan"
	| "lessThan"
	| "greaterThanOrEqual"
	| "lessThanOrEqual"
	| "contains"
	| "startsWith"
	| "endsWith"
	| "in"
	| "notIn"
	| "between"
	| "isNull"
	| "isNotNull";

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Filter condition
 */
export interface FilterCondition {
	field: keyof DataPoint;
	operator: FilterOperator;
	value: any;
	value2?: any; // For between operator
	caseSensitive?: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig {
	field: keyof DataPoint;
	direction: SortDirection;
	caseSensitive?: boolean;
}

/**
 * Group configuration
 */
export interface GroupConfig {
	field: keyof DataPoint;
	aggregate?: "sum" | "avg" | "count" | "min" | "max";
}
