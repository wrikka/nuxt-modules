import type { DiffResult } from "../../types/diff";
import type { DiffHistoryEntry, DiffHistoryState } from "../../../types/diff-history";

/**
 * Create a new diff history state
 */
export function createDiffHistory(): DiffHistoryState {
	return { history: [] };
}

/**
 * Add a diff to the history, returning a new state
 */
export function addToDiffHistory(
	state: DiffHistoryState,
	diff: DiffResult,
	version: string,
): DiffHistoryState {
	const newEntry: DiffHistoryEntry = {
		diff,
		timestamp: Date.now(),
		version,
	};
	return {
		history: [...state.history, newEntry],
	};
}

/**
 * Get a diff by version
 */
export function getDiffFromHistory(
	state: DiffHistoryState,
	version: string,
): DiffResult | undefined {
	return state.history.find((entry) => entry.version === version)?.diff;
}

/**
 * Get all history entries
 */
export function getAllDiffHistory(state: DiffHistoryState): DiffHistoryEntry[] {
	return [...state.history];
}

/**
 * Get the latest history entry
 */
export function getLatestDiffHistory(
	state: DiffHistoryState,
): DiffHistoryEntry | undefined {
	return state.history[state.history.length - 1];
}

/**
 * Get diff between two versions
 */
export function getDiffBetweenVersions(
	state: DiffHistoryState,
	fromVersion: string,
	toVersion: string,
): DiffResult | undefined {
	const fromIndex = state.history.findIndex(
		(entry) => entry.version === fromVersion,
	);
	const toIndex = state.history.findIndex(
		(entry) => entry.version === toVersion,
	);

	if (fromIndex === -1 || toIndex === -1) {
		return undefined;
	}

	if (fromIndex === toIndex) {
		return { added: {}, deleted: {}, updated: {} };
	}

	const merged: DiffResult = { added: {}, deleted: {}, updated: {} };

	for (let i = fromIndex; i <= toIndex; i++) {
		const entry = state.history[i];
		if (!entry) continue;
		for (const key in entry.diff.added) {
			merged.added[key] = entry.diff.added[key];
		}
		for (const key in entry.diff.deleted) {
			merged.deleted[key] = entry.diff.deleted[key];
		}
		for (const key in entry.diff.updated) {
			merged.updated[key] = entry.diff.updated[key];
		}
	}

	return merged;
}

/**
 * Clear the diff history
 */
export function clearDiffHistory(): DiffHistoryState {
	return { history: [] };
}














