import type { ContentValidationOptions, ValidationResult } from "../../shared/types/validation";

export function useValidation() {
	const validate = async (
		content: string,
		options?: ContentValidationOptions,
	): Promise<ValidationResult> => {
		const response = await $fetch("/api/validation/validate", {
			method: "POST",
			body: { content, options },
		});
		return response as ValidationResult;
	};

	return {
		validate,
	};
}
