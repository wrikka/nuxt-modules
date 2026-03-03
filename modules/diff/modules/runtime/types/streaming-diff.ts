import type { DiffOptions, DiffResult } from "@wpackages/diff/types/diff";

export interface StreamingDiffOptions extends DiffOptions {
	bufferSize?: number;
	onChunk?: (chunk: DiffResult) => void;
}














