import { readonly, ref, watchEffect } from "vue";
import type { DiffOptions, DiffResult } from "../types/diff";
import { diff } from "../utils/diff/core";

export function useDiff(
	expected: unknown,
	actual: unknown,
	options: DiffOptions = {},
) {
	const diffResult = ref<DiffResult>({ added: {}, deleted: {}, updated: {} });

	watchEffect(() => {
		diffResult.value = diff(expected, actual, options);
	});

	return {
		diffResult: readonly(diffResult),
	};
}
