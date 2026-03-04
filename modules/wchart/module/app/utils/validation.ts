import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Validate chart data structure
 */
export function validateChartData(chartData: ChartData): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];
	if (!chartData.series || !Array.isArray(chartData.series)) {
		errors.push("Chart data must have a series array");
	} else {
		if (chartData.series.length === 0) {
			errors.push("Chart data must have at least one series");
		}
		for (let i = 0; i < chartData.series.length; i++) {
			const series = chartData.series[i];
			if (!series.name) {
				errors.push(`Series ${i} must have a name`);
			}
			if (!series.data || !Array.isArray(series.data)) {
				errors.push(`Series ${i} must have a data array`);
			} else if (series.data.length === 0) {
				errors.push(`Series ${i} must have at least one data point`);
			}
		}
	}
	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate numeric data for charts that require numbers
 */
export function validateNumericData(data: any[]): {
	valid: boolean;
	errors: string[];
	cleanedData: number[];
} {
	const errors: string[] = [];
	const cleanedData: number[] = [];

	data.forEach((value, index) => {
		if (value === null || value === undefined) {
			errors.push(`Data point ${index} is null or undefined`);
			cleanedData.push(0);
		} else if (typeof value === "string") {
			const num = parseFloat(value);
			if (isNaN(num)) {
				errors.push(`Data point ${index} is not a valid number: ${value}`);
				cleanedData.push(0);
			} else {
				cleanedData.push(num);
			}
		} else if (typeof value === "number") {
			if (!isFinite(value)) {
				errors.push(`Data point ${index} is not finite: ${value}`);
				cleanedData.push(0);
			} else {
				cleanedData.push(value);
			}
		} else {
			errors.push(`Data point ${index} is not a number: ${typeof value}`);
			cleanedData.push(0);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		cleanedData,
	};
}

/**
 * Clean and sanitize chart data
 */
export function cleanData(data: any[]): number[] {
	return data.map((value) => {
		if (typeof value === "number" && isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const num = parseFloat(value);
			return isNaN(num) ? 0 : num;
		}
		return 0;
	});
}

/**
 * Validate categories array
 */
export function validateCategories(categories: any[]): {
	valid: boolean;
	errors: string[];
	cleanedCategories: string[];
} {
	const errors: string[] = [];
	const cleanedCategories: string[] = [];

	categories.forEach((category, index) => {
		if (category === null || category === undefined) {
			errors.push(`Category ${index} is null or undefined`);
			cleanedCategories.push(`Category ${index + 1}`);
		} else {
			const str = String(category).trim();
			if (str.length === 0) {
				errors.push(`Category ${index} is empty`);
				cleanedCategories.push(`Category ${index + 1}`);
			} else {
				cleanedCategories.push(str);
			}
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		cleanedCategories,
	};
}

/**
 * Sanitize data by removing outliers using IQR method
 */
export function sanitizeData(
	data: number[],
	removeOutliers = false,
): { sanitizedData: number[]; outliers: number[] } {
	if (!removeOutliers) {
		return { sanitizedData: data, outliers: [] };
	}

	const sorted = [...data].sort((a, b) => a - b);
	const q1 = sorted[Math.floor(sorted.length * 0.25)];
	const q3 = sorted[Math.floor(sorted.length * 0.75)];
	const iqr = q3 - q1;
	const lowerBound = q1 - 1.5 * iqr;
	const upperBound = q3 + 1.5 * iqr;

	const sanitizedData: number[] = [];
	const outliers: number[] = [];

	data.forEach((value) => {
		if (value < lowerBound || value > upperBound) {
			outliers.push(value);
		} else {
			sanitizedData.push(value);
		}
	});

	return { sanitizedData, outliers };
}

/**
 * Validate hierarchical data for treemap
 */
export function validateHierarchicalData(
	data: Array<{ name: string; value: number; children?: any[] }>,
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!Array.isArray(data)) {
		errors.push("Hierarchical data must be an array");
		return { valid: false, errors };
	}

	data.forEach((item, index) => {
		if (!item.name || typeof item.name !== "string") {
			errors.push(`Item ${index} must have a valid name`);
		}
		if (typeof item.value !== "number" || !isFinite(item.value)) {
			errors.push(`Item ${index} must have a valid numeric value`);
		}
		if (item.children && !Array.isArray(item.children)) {
			errors.push(`Item ${index} children must be an array`);
		}
		if (item.children) {
			const childValidation = validateHierarchicalData(item.children);
			errors.push(
				...childValidation.errors.map((err) => `Child of ${item.name}: ${err}`),
			);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
	};
}
