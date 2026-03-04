import type { DiffResult } from "../../types/diff";
import type { DiffFilter } from "../../../types/diff-filter";

function getNestedValue(
	diff: DiffResult,
	path: string,
): DiffResult | undefined {
	const keys = path.split(".");
	let current: DiffResult = diff;

	for (const key of keys) {
		const value = current.updated[key];
		if (typeof value === "object" && value !== null && !("__old" in value)) {
			current = value as DiffResult;
		} else {
			return undefined;
		}
	}

	return current;
}

function shouldInclude(
	key: string,
	value: unknown,
	filter: DiffFilter,
): boolean {
	if (filter.pattern && !filter.pattern.test(key)) {
		return false;
	}

	if (filter.types) {
		const type = getType(value);
		if (!filter.types.includes(type)) {
			return false;
		}
	}

	return true;
}

function getType(value: unknown): string {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	if (value instanceof Map) return "map";
	if (value instanceof Set) return "set";
	return typeof value;
}

export { getNestedValue, shouldInclude, getType };














