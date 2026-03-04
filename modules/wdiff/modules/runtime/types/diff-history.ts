import type { DiffResult } from "@wpackages/diff/types/diff";

export interface DiffHistoryEntry {
	version: string;
	timestamp: number;
	diff: DiffResult;
}

export interface DiffHistoryState {
	history: DiffHistoryEntry[];
}














