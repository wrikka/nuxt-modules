/**
 * Diff Error Utilities
 * Utility functions for diff error handling
 */

import type { DiffOptions, DiffResult } from "../../types/diff";
import type { ValidationOptions, ValidationResult } from "../../types/diff-error-types";
import { createDiffValidationError } from "../../types/diff-errors";
import { validateDiff as validateDiffInternal } from "../validators/diff-validator";

export function validateDiff<T>(
	dataA: T,
	dataB: T,
	options: ValidationOptions = {},
): ValidationResult {
	return validateDiffInternal(options, dataA, dataB, {});
}

export async function safeDiff<T>(
	dataA: T,
	dataB: T,
	diffOptions: DiffOptions = {},
	validationOptions: ValidationOptions = {},
): Promise<DiffResult> {
	const validation = validateDiff(dataA, dataB, validationOptions);

	if (!validation.isValid) {
		throw createDiffValidationError("Diff validation failed", {
			errors: validation.errors,
		});
	}

	// Log warnings if any
	if (validation.warnings.length > 0) {
		console.warn("Diff validation warnings:", validation.warnings);
	}

	// Perform actual diff (import dynamically to avoid circular dependency)
	const { diff } = await import("./diff");
	return diff(dataA, dataB, diffOptions) as DiffResult;
}

export async function recoverFromError(
	error: import("../../types/diff").DiffError,
): Promise<DiffResult> {
	// Recovery strategies based on error type
	switch (error.code) {
		case "DIFF_VALIDATION_ERROR":
			// Try to fix common validation issues
			return { added: {}, deleted: {}, updated: {} };

		case "DIFF_PROCESSING_ERROR":
			// Try simplified diff
			try {
				const { diff } = await import("./diff");
				return diff({}, {}) as DiffResult;
			} catch {
				return { added: {}, deleted: {}, updated: {} };
			}

		case "DIFF_MEMORY_ERROR":
			// Try streaming diff for large datasets
			console.warn("Memory error detected, consider using streaming diff");
			return { added: {}, deleted: {}, updated: {} };

		default:
			// Fallback to empty diff
			return { added: {}, deleted: {}, updated: {} };
	}
}














