import {
	createDiffMemoryError,
	createDiffProcessingError,
	createDiffValidationError,
	type DiffMemoryError,
	type DiffProcessingError,
	type DiffValidationError,
} from "../../diff-errors";

export interface DiffProcessorState {
	errors: (DiffValidationError | DiffProcessingError | DiffMemoryError)[];
}

export function createDiffProcessor(): DiffProcessorState {
	return { errors: [] };
}

export function processBatch(
	_state: DiffProcessorState,
	items: any[],
): [DiffProcessorState, { success: boolean; results: any[] }] {
	const newErrors: (
		| DiffValidationError
		| DiffProcessingError
		| DiffMemoryError
	)[] = [];
	const results: any[] = [];

	for (const item of items) {
		try {
			// Simulate processing
			if (!item.id) {
				newErrors.push(
					createDiffValidationError(`Missing ID for item`, {
						itemData: item,
						itemIndex: results.length,
					}),
				);
				continue;
			}

			if (typeof item.value !== "number") {
				newErrors.push(
					createDiffValidationError(`Invalid value type for item ${item.id}`, {
						expectedType: "number",
						itemId: item.id,
						receivedType: typeof item.value,
						receivedValue: item.value,
					}),
				);
				continue;
			}

			// Simulate memory issue for large values
			if (item.value > 1000000) {
				newErrors.push(
					createDiffMemoryError(
						`Value too large for processing: ${item.value}`,
						{
							itemId: item.id,
							maxAllowedValue: 1000000,
							value: item.value,
						},
					),
				);
				continue;
			}

			results.push({
				id: item.id,
				processedValue: item.value * 2,
				status: "success",
			});
		} catch (error) {
			newErrors.push(
				createDiffProcessingError(`Unexpected error processing item`, {
					error: error instanceof Error ? error.message : String(error),
					itemData: item,
				}),
			);
		}
	}

	const newState: DiffProcessorState = { errors: newErrors };
	return [
		newState,
		{
			results,
			success: newErrors.length === 0,
		},
	];
}

export function getErrors(
	state: DiffProcessorState,
): (DiffValidationError | DiffProcessingError | DiffMemoryError)[] {
	return [...state.errors];
}

export function getErrorSummary(state: DiffProcessorState) {
	const summary = {
		details: [] as string[],
		memory: 0,
		processing: 0,
		total: state.errors.length,
		validation: 0,
	};

	for (const error of state.errors) {
		if (error.name === "DiffValidationError") summary.validation++;
		else if (error.name === "DiffProcessingError") summary.processing++;
		else if (error.name === "DiffMemoryError") summary.memory++;

		summary.details.push(`${error.name}: ${error.message}`);
	}

	return summary;
}













