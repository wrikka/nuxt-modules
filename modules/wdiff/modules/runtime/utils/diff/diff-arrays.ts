import type { DiffOptions, DiffResult } from "../../types/diff";
import { ChangeType } from "../../types/diff";
import { lcs } from "./lcs";

export function diffArrays(expected: unknown[], actual: unknown[]): DiffResult {
	const changes = lcs(expected, actual);

	if (changes.every((c: any) => c.type === ChangeType.COMMON)) {
		return { added: {}, deleted: {}, updated: {} };
	}

	const result: DiffResult = {
		added: {},
		deleted: {},
		updated: { _lcs: changes },
	};
	return result;
}














