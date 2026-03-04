import type { DiffResult } from "../../types/diff";
import type { PathNode } from "../../types/path-diff";

export function getPaths(diff: DiffResult, basePath = ""): PathNode[] {
	const paths: PathNode[] = [];

	for (const key in diff.added) {
		const path = basePath ? `${basePath}.${key}` : key;
		paths.push({ path, value: diff.added[key] });
	}

	for (const key in diff.deleted) {
		const path = basePath ? `${basePath}.${key}` : key;
		paths.push({ path, value: diff.deleted[key] });
	}

	for (const key in diff.updated) {
		const path = basePath ? `${basePath}.${key}` : key;
		const value = diff.updated[key];

		if (
			typeof value === "object" &&
			value !== null &&
			!("__old" in value) &&
			!("_lcs" in value)
		) {
			paths.push({ changes: value as DiffResult, path, value });
			const nestedPaths = getPaths(value as DiffResult, path);
			paths.push(...nestedPaths);
		} else {
			paths.push({ path, value });
		}
	}

	return paths;
}

export function getChangedPaths(diff: DiffResult): string[] {
	const paths = getPaths(diff);
	return paths.map((p) => p.path);
}














