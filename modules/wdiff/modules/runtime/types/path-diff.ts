import type { DiffResult } from "@wpackages/diff/types/diff";

export interface PathNode {
	path: string;
	value: unknown;
	changes?: DiffResult;
}

export interface PathDiffOptions {
	deep?: boolean;
	maxDepth?: number;
}














