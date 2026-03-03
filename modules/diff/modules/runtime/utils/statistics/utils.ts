export function getType(value: unknown): string {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	if (value instanceof Map) return "map";
	if (value instanceof Set) return "set";
	if (value instanceof Date) return "date";
	if (value instanceof RegExp) return "regexp";
	return typeof value;
}













