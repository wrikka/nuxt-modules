import { ChangeType } from "../../types/diff";

export interface Change {
	type: ChangeType;
	value: unknown;
	indexA?: number;
	indexB?: number;
}

export function lcs(a: unknown[], b: unknown[]): Change[] {
	const changes: Change[] = [];
	let i = 0;
	let j = 0;

	while (i < a.length || j < b.length) {
		if (i < a.length && j < b.length && a[i] === b[j]) {
			changes.push({
				indexA: i,
				indexB: j,
				type: ChangeType.COMMON,
				value: a[i],
			});
			i++;
			j++;
		} else if (i < a.length) {
			changes.push({
				indexA: i,
				type: ChangeType.DELETE,
				value: a[i],
			});
			i++;
		} else if (j < b.length) {
			changes.push({
				indexB: j,
				type: ChangeType.ADD,
				value: b[j],
			});
			j++;
		}
	}

	return changes;
}














