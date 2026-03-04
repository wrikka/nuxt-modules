import type { DiffResult } from "../../types/diff";

/**
 * Process a single chunk of data
 */
export async function processChunk<T>(
	valueA: T | undefined,
	valueB: T | undefined,
	index: number,
): Promise<DiffResult> {
	return new Promise((resolve) => {
		const diff: DiffResult = { added: {}, deleted: {}, updated: {} };

		if (valueA !== undefined && valueB === undefined) {
			diff.deleted[`index_${index}`] = valueA;
		} else if (valueA === undefined && valueB !== undefined) {
			diff.added[`index_${index}`] = valueB;
		} else if (valueA !== valueB) {
			diff.updated[`index_${index}`] = { new: valueB, old: valueA };
		}

		resolve(diff);
	});
}














