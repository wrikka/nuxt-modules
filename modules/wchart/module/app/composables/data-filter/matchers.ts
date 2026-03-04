import type { DataPoint } from '../../../../types/chart-basic';
import type { FilterCondition } from './types';

export function matchesAllConditions(
	point: DataPoint,
	conditions: FilterCondition[],
): boolean {
	return conditions.every((condition) => matchesCondition(point, condition));
}

export function matchesCondition(
	point: DataPoint,
	condition: FilterCondition,
): boolean {
	const fieldValue = point[condition.field];
	const { operator, value, value2, caseSensitive = false } = condition;

	// Handle null/undefined values
	if (fieldValue == null) {
		return operator === "isNull";
	}
	if (operator === "isNull") return false;
	if (operator === "isNotNull") return fieldValue != null;

	// Convert to string for string operations
	const strValue = caseSensitive
		? String(fieldValue)
		: String(fieldValue).toLowerCase();
	const cmpValue = caseSensitive
		? String(value)
		: String(value).toLowerCase();

	switch (operator) {
		case "equals":
			return fieldValue === value;
		case "notEquals":
			return fieldValue !== value;
		case "greaterThan":
			return Number(fieldValue) > Number(value);
		case "lessThan":
			return Number(fieldValue) < Number(value);
		case "greaterThanOrEqual":
			return Number(fieldValue) >= Number(value);
		case "lessThanOrEqual":
			return Number(fieldValue) <= Number(value);
		case "contains":
			return strValue.includes(cmpValue);
		case "startsWith":
			return strValue.startsWith(cmpValue);
		case "endsWith":
			return strValue.endsWith(cmpValue);
		case "in":
			return Array.isArray(value) && value.includes(fieldValue);
		case "notIn":
			return !Array.isArray(value) || !value.includes(fieldValue);
		case "between":
			return (
				Number(fieldValue) >= Number(value) &&
				Number(fieldValue) <= Number(value2)
			);
		default:
			return true;
	}
}

export function matchesSearchQuery(
	point: DataPoint,
	query: string,
	fields: (keyof DataPoint)[],
): boolean {
	const searchTerm = query.toLowerCase();
	return fields.some((field) => {
		const value = point[field];
		return value != null && String(value).toLowerCase().includes(searchTerm);
	});
}
