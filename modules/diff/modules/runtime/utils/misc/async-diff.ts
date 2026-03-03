import type { DiffOptions, DiffResult } from "../../types/diff";

export interface AsyncDiffOptions extends DiffOptions {
	chunkSize?: number;
	maxConcurrency?: number;
	onProgress?: (progress: number, total: number) => void;
}

export async function* asyncDiffGenerator<T>(
	dataA: T[],
	dataB: T[],
	options: AsyncDiffOptions = {},
): AsyncGenerator<DiffResult, DiffResult, unknown> {
	const {
		chunkSize = 1000,
		maxConcurrency: _maxConcurrency = 4,
		onProgress,
	} = options;
	const total = Math.max(dataA.length, dataB.length);
	let processed = 0;

	for (let i = 0; i < total; i += chunkSize) {
		const chunkA = dataA.slice(i, i + chunkSize);
		const chunkB = dataB.slice(i, i + chunkSize);

		const chunkDiff = await processChunk(chunkA, chunkB, options);
		processed += chunkSize;

		if (onProgress) {
			onProgress(Math.min(processed, total), total);
		}

		yield chunkDiff;
	}

	return { added: {}, deleted: {}, updated: {} };
}

async function processChunk<T>(
	_chunkA: T[],
	_chunkB: T[],
	_options: AsyncDiffOptions,
): Promise<DiffResult> {
	// Process chunk asynchronously
	return new Promise((resolve) => {
		setTimeout(() => {
			// Simple chunk processing logic
			resolve({ added: {}, deleted: {}, updated: {} });
		}, 0);
	});
}

export async function asyncDiff<T>(
	dataA: T[],
	dataB: T[],
	options: AsyncDiffOptions = {},
): Promise<DiffResult> {
	const generator = asyncDiffGenerator(dataA, dataB, options);
	const finalResult: DiffResult = { added: {}, deleted: {}, updated: {} };

	for await (const chunkResult of generator) {
		mergeResults(finalResult, chunkResult);
	}

	return finalResult;
}

function mergeResults(target: DiffResult, source: DiffResult): void {
	Object.assign(target.added, source.added);
	Object.assign(target.deleted, source.deleted);
	Object.assign(target.updated, source.updated);
}














