import type {
	DataPoint,
	ChartSeries,
	ChartData,
	ChartType,
} from '@/module/app/types/chart-basic';

/**
 * Validation result interface
 */
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Data sanitization options
 */
export interface SanitizationOptions {
	removeInvalidPoints?: boolean;
	fillMissingValues?: boolean;
	clampOutliers?: boolean;
	defaultValue?: number;
	maxValue?: number;
	minValue?: number;
}

/**
 * Validate a single data point
 */
export function validateDataPoint(point: DataPoint): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!point) {
		errors.push("Data point is null or undefined");
		return { isValid: false, errors, warnings };
	}

	// Check required fields
	if (typeof point.x === "undefined" && typeof point.y === "undefined") {
		errors.push("Data point must have x or y value");
	}

	// Validate x value
	if (typeof point.x !== "undefined") {
		if (
			typeof point.x !== "string" &&
			typeof point.x !== "number" &&
			!(point.x instanceof Date)
		) {
			errors.push("x value must be string, number, or Date");
		}
	}

	// Validate y value
	if (typeof point.y !== "undefined") {
		if (typeof point.y !== "number" && !Array.isArray(point.y)) {
			errors.push("y value must be number or number array");
		}
		if (Array.isArray(point.y)) {
			if (point.y.some((v: any) => typeof v !== "number")) {
				errors.push("y array must contain only numbers");
			}
		}
	}

	// Validate optional fields
	if (point.label && typeof point.label !== "string") {
		warnings.push("label should be a string");
	}

	if (point.color && typeof point.color !== "string") {
		warnings.push("color should be a string");
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Validate a chart series
 */
export function validateChartSeries(series: any): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!series) {
		errors.push("Chart series is null or undefined");
		return { isValid: false, errors, warnings };
	}

	if (!series.name || typeof series.name !== "string") {
		errors.push("Series must have a valid name");
	}

	if (!Array.isArray(series.data)) {
		errors.push("Series data must be an array");
	} else {
		series.data.forEach((point: any, index: number) => {
			const pointValidation = validateDataPoint(point);
			if (!pointValidation.isValid) {
				errors.push(`Point ${index}: ${pointValidation.errors.join(", ")}`);
			}
			warnings.push(
				...pointValidation.warnings.map((w) => `Point ${index}: ${w}`),
			);
		});
	}

	// Validate optional fields
	if (series.type && !isValidChartType(series.type)) {
		warnings.push(`Unknown chart type: ${series.type}`);
	}

	if (series.color && typeof series.color !== "string") {
		warnings.push("color should be a string");
	}

	if (series.links && !Array.isArray(series.links)) {
		warnings.push("links should be an array");
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Validate chart data
 */
export function validateChartData(data: any): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!data) {
		errors.push("Chart data is null or undefined");
		return { isValid: false, errors, warnings };
	}

	if (!Array.isArray(data.series)) {
		errors.push("Chart data must have a series array");
	} else if (data.series.length === 0) {
		errors.push("Chart data must have at least one series");
	} else {
		data.series.forEach((series: any, index: number) => {
			const seriesValidation = validateChartSeries(series);
			if (!seriesValidation.isValid) {
				errors.push(`Series ${index}: ${seriesValidation.errors.join(", ")}`);
			}
			warnings.push(
				...seriesValidation.warnings.map((w) => `Series ${index}: ${w}`),
			);
		});
	}

	// Validate optional fields
	if (data.title && typeof data.title !== "string") {
		warnings.push("title should be a string");
	}

	if (data.orientation && typeof data.orientation !== "string") {
		warnings.push("orientation should be a string");
	}

	if (
		data.orientation &&
		!["horizontal", "vertical"].includes(data.orientation)
	) {
		warnings.push("orientation should be horizontal or vertical");
	}

	if (
		typeof data.stacked !== "boolean" &&
		typeof data.stacked !== "undefined"
	) {
		warnings.push("stacked should be a boolean");
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Sanitize a data point
 */
export function sanitizeDataPoint(
	point: any,
	options: SanitizationOptions = {},
): DataPoint {
	const sanitized: DataPoint = { ...point };

	// Sanitize x value
	if (typeof sanitized.x === "undefined" || sanitized.x === null) {
		if (options.fillMissingValues) {
			sanitized.x = options.defaultValue || 0;
		}
	}

	// Sanitize y value
	if (typeof sanitized.y === "undefined" || sanitized.y === null) {
		if (options.fillMissingValues) {
			sanitized.y = options.defaultValue || 0;
		}
	} else if (typeof sanitized.y === "number") {
		if (options.clampOutliers) {
			if (options.minValue !== undefined && sanitized.y < options.minValue) {
				sanitized.y = options.minValue;
			}
			if (options.maxValue !== undefined && sanitized.y > options.maxValue) {
				sanitized.y = options.maxValue;
			}
		}
	}

	// Sanitize optional fields
	if (sanitized.label && typeof sanitized.label !== "string") {
		sanitized.label = String(sanitized.label);
	}

	if (sanitized.color && typeof sanitized.color !== "string") {
		sanitized.color = undefined;
	}

	return sanitized;
}

/**
 * Sanitize a chart series
 */
export function sanitizeChartSeries(
	series: any,
	options: SanitizationOptions = {},
): ChartSeries {
	const sanitized: ChartSeries = {
		name: series.name || "Unnamed Series",
		data: [],
		...series,
	};

	if (Array.isArray(series.data)) {
		sanitized.data = series.data
			.map((point: any) => sanitizeDataPoint(point, options))
			.filter((point: DataPoint) => {
				if (options.removeInvalidPoints) {
					const validation = validateDataPoint(point);
					return validation.isValid;
				}
				return true;
			});
	}

	return sanitized;
}

/**
 * Sanitize chart data
 */
export function sanitizeChartData(
	data: any,
	options: SanitizationOptions = {},
): ChartData {
	const sanitized: ChartData = {
		series: [],
		...data,
	};

	if (Array.isArray(data.series)) {
		sanitized.series = data.series.map((series: any) =>
			sanitizeChartSeries(series, options),
		);
	}

	return sanitized;
}

/**
 * Combined validate and sanitize function
 */
export function validateAndSanitizeChartData(
	data: any,
	sanitizationOptions: SanitizationOptions = {},
): { data: ChartData; validation: ValidationResult } {
	const validation = validateChartData(data);
	const sanitizedData = sanitizeChartData(data, sanitizationOptions);

	return {
		data: sanitizedData,
		validation,
	};
}

/**
 * Check if chart type is valid
 */
function isValidChartType(type: string): type is ChartType {
	const validTypes: ChartType[] = [
		"bar",
		"line",
		"pie",
		"area",
		"scatter",
		"histogram",
		"radar",
		"heatmap",
		"treemap",
		"funnel",
		"gauge",
		"candlestick",
		"boxplot",
		"waterfall",
		"sunburst",
		"polarArea",
		"network",
		"bubble",
	];
	return validTypes.includes(type as ChartType);
}
