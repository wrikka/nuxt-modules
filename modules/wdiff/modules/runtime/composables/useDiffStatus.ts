import { computed } from "vue";
import type { DiffResult } from "../types/diff";

export function useDiffStatus(diff: DiffResult) {
	const isEmpty = computed(() => {
		return (
			Object.keys(diff.added).length === 0 &&
			Object.keys(diff.deleted).length === 0 &&
			Object.keys(diff.updated).length === 0
		);
	});

	const hasChanges = computed(() => !isEmpty.value);

	const addedCount = computed(() => Object.keys(diff.added).length);
	const deletedCount = computed(() => Object.keys(diff.deleted).length);
	const updatedCount = computed(() => Object.keys(diff.updated).length);
	const totalChanges = computed(
		() => addedCount.value + deletedCount.value + updatedCount.value,
	);

	return {
		addedCount,
		deletedCount,
		hasChanges,
		isEmpty,
		totalChanges,
		updatedCount,
	};
}
