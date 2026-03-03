import type { DiffResult } from "../../types/diff";
import { flushBuffer } from "./buffer";
import { processChunk } from "./chunk";
import type { StreamingDiffOptions } from "../../../types/streaming-diff";

/**
 * Process streaming diff between two async iterables
 */
export async function* processStreamingDiff<T>(
	streamA: AsyncIterable<T>,
	streamB: AsyncIterable<T>,
	options: StreamingDiffOptions = {},
): AsyncGenerator<DiffResult> {
	const bufferSize = options.bufferSize || 1000;
	const onChunk = options.onChunk;

	const buffer: DiffResult[] = [];
	const iteratorA = streamA[Symbol.asyncIterator]();
	const iteratorB = streamB[Symbol.asyncIterator]();

	let index = 0;

	while (true) {
		const resultA = await iteratorA.next();
		const resultB = await iteratorB.next();

		if (resultA.done && resultB.done) break;

		const chunkDiff = await processChunk(resultA.value, resultB.value, index);

		buffer.push(chunkDiff);

		if (buffer.length >= bufferSize) {
			const combined = flushBuffer(buffer);
			if (onChunk) {
				onChunk(combined);
			}
			yield combined;
		}

		index++;
	}

	// Flush remaining buffer
	if (buffer.length > 0) {
		const combined = flushBuffer(buffer);
		if (onChunk) {
			onChunk(combined);
		}
		yield combined;
	}
}

/**
 * Convenience function for streaming diff (backward compatibility)
 */
export async function streamingDiff<T>(
	streamA: AsyncIterable<T>,
	streamB: AsyncIterable<T>,
	options: StreamingDiffOptions = {},
): Promise<AsyncGenerator<DiffResult>> {
	return processStreamingDiff(streamA, streamB, options);
}














