import type { DiffOptions, DiffResult, Seen } from "../../types/diff";
import { isEqual, isObjectLike } from "../misc/isEqual";

export function diffObjects(
	expected: Record<string, unknown>,
	actual: Record<string, unknown>,
	seen: Seen,
	options: DiffOptions,
	path: string[],
	diffInternal: (
		expected: unknown,
		actual: unknown,
		seen: Seen,
		options: DiffOptions,
		path: string[],
	) => DiffResult,
): DiffResult {
	const result: DiffResult = { added: {}, deleted: {}, updated: {} };
	const allKeys = Array.from(
		new Set([...Object.keys(expected), ...Object.keys(actual)]),
	);

	for (const key of allKeys.sort()) {
		const newPath = [...path, key];
		const expectedValue = expected[key];
		const actualValue = actual[key];

		if (isEqual(expectedValue, actualValue)) {
			continue;
		}

		if (options.ignorePaths?.includes(newPath.join("."))) {
			continue;
		}

		if (!(key in actual)) {
			result.deleted[key] = expectedValue;
		} else if (!(key in expected)) {
			result.added[key] = actualValue;
		} else {
			if (isObjectLike(expectedValue) && isObjectLike(actualValue)) {
				const nestedDiff = diffInternal(
					expectedValue,
					actualValue,
					seen,
					options,
					newPath,
				);
				result.updated[key] = nestedDiff;
			} else {
				result.updated[key] = { __new: actualValue, __old: expectedValue };
			}
		}
	}

	return result;
}














