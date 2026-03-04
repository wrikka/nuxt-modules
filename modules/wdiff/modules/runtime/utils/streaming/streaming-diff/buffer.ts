import type { DiffResult } from "../../types/diff";

/**
 * Flush the buffer and combine chunks
 */
export function flushBuffer(buffer: DiffResult[]): DiffResult {
	const combined: DiffResult = { added: {}, deleted: {}, updated: {} };

	for (const chunk of buffer) {
		Object.assign(combined.added, chunk.added);
		Object.assign(combined.deleted, chunk.deleted);
		Object.assign(combined.updated, chunk.updated);
	}

	buffer.length = 0; // Clear buffer

	return combined;
}














