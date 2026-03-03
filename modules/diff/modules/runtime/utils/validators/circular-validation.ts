import type { DiffValidationError } from "../../types/diff-errors";
import type { DiffValidatorOptions } from "../../types/validation";
import { createDiffValidationError } from "../../types/diff-errors";

export function validateCircularReferences<T>(
	_options: Required<DiffValidatorOptions>,
	dataA: T,
	dataB: T,
	errors: DiffValidationError[],
	_warnings: string[],
): void {
	const hasCircularA = hasCircularReference(dataA);
	const hasCircularB = hasCircularReference(dataB);

	if (hasCircularA) {
		errors.push(
			createDiffValidationError("Circular reference detected in data A"),
		);
	}
	if (hasCircularB) {
		errors.push(
			createDiffValidationError("Circular reference detected in data B"),
		);
	}
}

function hasCircularReference(obj: unknown, visited = new WeakSet()): boolean {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	if (visited.has(obj)) {
		return true;
	}

	visited.add(obj);

	if (Array.isArray(obj)) {
		return obj.some((item) => hasCircularReference(item, visited));
	}

	return Object.values(obj).some((value) =>
		hasCircularReference(value, visited),
	);
}













