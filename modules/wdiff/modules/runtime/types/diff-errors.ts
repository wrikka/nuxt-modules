import type { DiffError, DiffMemoryError, DiffProcessingError } from "./diff";

export type { DiffError, DiffMemoryError, DiffProcessingError };

export interface ValidationResult {
    errors: DiffValidationError[];
    isValid: boolean;
    warnings: string[];
}

export interface DiffValidationError {
    code: string;
    context?: unknown;
    message: string;
    name: string;
}

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



