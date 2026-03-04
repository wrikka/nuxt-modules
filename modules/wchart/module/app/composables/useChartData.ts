import { ref, readonly } from "vue";
import { generateRandomData } from '@/module/app/utils/chart-utils';
import { validateAndSanitizeChartData } from "../utils/data-validation";
import type { ChartData } from '@/module/app/types/chart-basic';

export function useChartData(initialData?: ChartData, validationOptions = {}) {
	const chartData = ref<ChartData>(
		initialData
			? validateAndSanitizeChartData(initialData, validationOptions).data
			: generateRandomData(),
	);

	const updateData = (newData: ChartData) => {
		const { data, validation } = validateAndSanitizeChartData(
			newData,
			validationOptions,
		);

		// Log validation warnings/errors (in development)
		if (process.dev) {
			if (validation.errors.length > 0) {
				console.error("Chart data validation errors:", validation.errors);
			}
			if (validation.warnings.length > 0) {
				console.warn("Chart data validation warnings:", validation.warnings);
			}
		}

		chartData.value = data;
	};

	const randomizeData = () => {
		chartData.value = generateRandomData();
	};

	const validateData = (data: ChartData) => {
		return validateAndSanitizeChartData(data, validationOptions).validation;
	};

	return {
		chartData: readonly(chartData),
		updateData,
		randomizeData,
		validateData,
	};
}
