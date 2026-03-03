import rfdc from "rfdc";
import type { DiffResult } from "../../types/diff";
import { ChangeType } from "../../types/diff";
import { applyLcs } from "./lcs";
import { isDiffValue, isLcsDiff } from "./utils";

const deepClone = rfdc();

function patchMap(
	source: Map<unknown, unknown>,
	diff: DiffResult,
): Map<unknown, unknown> {
	const result = deepClone(source);
	for (const key in diff.deleted) result.delete(key);
	for (const key in diff.added) result.set(key, deepClone(diff.added[key]));
	for (const key in diff.updated) {
		const value = diff.updated[key];
		if (isDiffValue(value)) {
			result.set(key, deepClone(value.__new));
		} else {
			result.set(key, patch(result.get(key), value as DiffResult));
		}
	}
	return result;
}

export function patch<T>(source: T, diff: DiffResult): T {
	if (diff.updated?.value && isDiffValue(diff.updated.value)) {
		return deepClone(diff.updated.value.__new) as T;
	}

	if (source instanceof Map) {
		return patchMap(source, diff) as any;
	}

	const result = deepClone(source) as any;
	for (const key in diff.deleted) delete result[key];
	for (const key in diff.added) result[key] = deepClone(diff.added[key]);
	for (const key in diff.updated) {
		const value = diff.updated[key];
		if (typeof value === "object" && value !== null) {
			if (isDiffValue(value)) {
				result[key] = deepClone(value.__new);
			} else if (isLcsDiff(value)) {
				if (Array.isArray(result[key])) {
					result[key] = applyLcs(
						result[key],
						value._lcs as any,
						ChangeType.ADD,
					);
				} else {
					result[key] = patch(result[key], value as unknown as DiffResult);
				}
			} else {
				result[key] = patch(result[key], value as DiffResult);
			}
		} else {
			result[key] = patch(result[key], value as DiffResult);
		}
	}
	return result;
}














