import type {
	DiffMemoryError,
	DiffProcessingError,
	DiffValidationError,
} from "../../../types/diff";

/**
 * Factory function for diff validation errors
 */
export function createDiffValidationError(
	message: string,
	context?: unknown,
): DiffValidationError {
	return {
		code: "DIFF_VALIDATION_ERROR",
		context,
		message,
		name: "DiffValidationError",
	};
}

/**
 * Factory function for diff processing errors
 */
export function createDiffProcessingError(
	message: string,
	context?: unknown,
): DiffProcessingError {
	return {
		code: "DIFF_PROCESSING_ERROR",
		context,
		message,
		name: "DiffProcessingError",
	};
}

/**
 * Factory function for diff memory errors
 */
export function createDiffMemoryError(
	message: string,
	context?: unknown,
): DiffMemoryError {
	return {
		code: "DIFF_MEMORY_ERROR",
		context,
		message,
		name: "DiffMemoryError",
	};
}













