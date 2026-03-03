import type { DiffOptions, DiffResult, Seen } from "../../types/diff";
import { diffArrays } from "../diff/diff-arrays";
import { diffMaps } from "../diff/diff-maps";
import { diffObjects } from "../objects/core";
import { diffSets } from "../diff/diff-sets";
import { isEqual, isObjectLike } from "../misc/isEqual";

function diffInternal(
	expected: unknown,
	actual: unknown,
	seen: Seen,
	options: DiffOptions,
	path: string[],
): DiffResult {
	const currentPath = path.join(".");
	if (path.length > 0 && options.ignorePaths?.includes(currentPath)) {
		return { added: {}, deleted: {}, updated: {} };
	}

	if (isEqual(expected, actual)) {
		return { added: {}, deleted: {}, updated: {} };
	}

	const isEObj = isObjectLike(expected);
	const isAObj = isObjectLike(actual);

	if (isEObj && isAObj) {
		const seenForExpected = seen.get(expected as object);
		if (seenForExpected?.get(actual as object)) {
			return { added: {}, deleted: {}, updated: {} };
		}
		if (!seenForExpected) {
			seen.set(expected as object, new WeakMap());
		}
		seen.get(expected as object)?.set(actual as object, true);

		const eIsMap = expected instanceof Map;
		const aIsMap = actual instanceof Map;
		if (eIsMap && aIsMap)
			return diffMaps(expected, actual, seen, options, path, diffInternal);

		const eIsSet = expected instanceof Set;
		const aIsSet = actual instanceof Set;
		if (eIsSet && aIsSet) return diffSets(expected, actual);

		const eIsArray = Array.isArray(expected);
		const aIsArray = Array.isArray(actual);

		if (eIsArray && aIsArray) {
			return diffArrays(expected, actual);
		}

		if (eIsMap || aIsMap || eIsSet || aIsSet || eIsArray || aIsArray) {
		} else {
			return diffObjects(
				expected as Record<string, unknown>,
				actual as Record<string, unknown>,
				seen,
				options,
				path,
				diffInternal,
			);
		}
	}

	return {
		added: {},
		deleted: {},
		updated: { value: { __new: actual, __old: expected } },
	};
}

export function diff(
	expected: unknown,
	actual: unknown,
	options: DiffOptions = {},
): DiffResult {
	return diffInternal(expected, actual, new Map(), options, []);
}














