import rfdc from "rfdc";
import type { DiffResult } from "../../types/diff";
import { ChangeType } from "../../types/diff";
import { applyLcs } from "./lcs";
import { isDiffValue, isLcsDiff } from "./utils";

const deepClone = rfdc();

function unpatchMap(
	source: Map<unknown, unknown>,
	diff: DiffResult,
): Map<unknown, unknown> {
	const result = deepClone(source);
	for (const key in diff.added) result.delete(key);
	for (const key in diff.deleted) result.set(key, deepClone(diff.deleted[key]));
	for (const key in diff.updated) {
		const value = diff.updated[key];
		if (isDiffValue(value)) {
			result.set(key, deepClone(value.__old));
		} else {
			result.set(key, unpatch(result.get(key), value as DiffResult));
		}
	}
	return result;
}

export function unpatch<T>(source: T, diff: DiffResult): T {
	if (diff.updated?.value && isDiffValue(diff.updated.value)) {
		return deepClone(diff.updated.value.__old) as T;
	}

	if (source instanceof Map) {
		return unpatchMap(source, diff) as any;
	}

	const result = deepClone(source) as any;
	for (const key in diff.added) delete result[key];
	for (const key in diff.deleted) result[key] = deepClone(diff.deleted[key]);
	for (const key in diff.updated) {
		const value = diff.updated[key];
		if (typeof value === "object" && value !== null) {
			if (isDiffValue(value)) {
				result[key] = deepClone(value.__old);
			} else if (isLcsDiff(value)) {
				result[key] = applyLcs(
					result[key],
					value._lcs as any,
					ChangeType.DELETE,
				);
			} else {
				result[key] = unpatch(result[key], value as DiffResult);
			}
		} else {
			result[key] = unpatch(result[key], value as DiffResult);
		}
	}
	return result;
}














