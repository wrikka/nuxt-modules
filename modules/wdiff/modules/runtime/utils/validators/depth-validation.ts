import type { DiffValidationError } from "../../types/diff-errors";
import type { DiffValidatorOptions } from "../../types/validation";
import { createDiffValidationError } from "../../types/diff-errors";

export function validateDepth<T>(
	options: Required<DiffValidatorOptions>,
	dataA: T,
	dataB: T,
	errors: DiffValidationError[],
	_warnings: string[],
): void {
	const depthA = calculateDepth(dataA);
	const depthB = calculateDepth(dataB);

	if (depthA > options.maxDepth) {
		errors.push(
			createDiffValidationError(
				`Data A too deep: ${depthA} > ${options.maxDepth}`,
				{ depth: depthA },
			),
		);
	}
	if (depthB > options.maxDepth) {
		errors.push(
			createDiffValidationError(
				`Data B too deep: ${depthB} > ${options.maxDepth}`,
				{ depth: depthB },
			),
		);
	}
}

function calculateDepth(
	obj: unknown,
	currentDepth = 0,
	visited = new WeakSet(),
): number {
	if (typeof obj !== "object" || obj === null) {
		return currentDepth;
	}

	if (visited.has(obj)) {
		return currentDepth; // Circular reference
	}

	visited.add(obj);
	let maxDepth = currentDepth;

	if (Array.isArray(obj)) {
		for (const item of obj) {
			const depth = calculateDepth(item, currentDepth + 1, visited);
			maxDepth = Math.max(maxDepth, depth);
		}
	} else {
		for (const value of Object.values(obj)) {
			const depth = calculateDepth(value, currentDepth + 1, visited);
			maxDepth = Math.max(maxDepth, depth);
		}
	}

	return maxDepth;
}













