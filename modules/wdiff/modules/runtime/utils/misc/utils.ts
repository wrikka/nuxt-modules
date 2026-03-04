import type { DiffResult } from "../../types/diff";

// LCS (Longest Common Subsequence) utility
export function lcs(a: any[], b: any[]): any[] {
	// Simple LCS implementation for diff
	const result: any[] = [];
	for (const item of a) {
		if (b.includes(item)) {
			result.push(item);
		}
	}
	return result;
}

// Reverse diff utility
export function reverseDiff(diff: DiffResult): DiffResult {
	const reversed: DiffResult = {
		added: { ...diff.deleted },
		deleted: { ...diff.added },
		updated: {},
	};

	for (const key in diff.updated) {
		const value = diff.updated[key];
		if (
			typeof value === "object" &&
			value !== null &&
			"__old" in value &&
			"__new" in value
		) {
			reversed.updated[key] = { __new: value.__old, __old: value.__new };
		} else if (
			typeof value === "object" &&
			value !== null &&
			!("__old" in value)
		) {
			reversed.updated[key] = reverseDiff(value as DiffResult);
		}
	}

	return reversed;
}

// Re-export from other files
export * from "./analysis";
export * from "./async-diff";
export * from "./isEqual";
export * from "./text-diff";
