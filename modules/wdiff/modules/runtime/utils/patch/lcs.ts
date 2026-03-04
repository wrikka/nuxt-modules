import { ChangeType } from "../../types/diff";

export function applyLcs<T>(
	source: T[],
	lcs: Array<{ type: ChangeType; value: T; indexA?: number; indexB?: number }>,
	keep: ChangeType.ADD | ChangeType.DELETE,
): T[] {
	const result: T[] = [];
	for (const change of lcs) {
		if (change.type === ChangeType.COMMON) {
			if (change.indexA !== undefined) {
				const value = source[change.indexA];
				if (value !== undefined) {
					result.push(value);
				}
			}
		} else if (change.type === keep) {
			result.push(change.value);
		}
	}
	return result;
}














