import type {
	ComboData,
	ChartSeries,
	ChartData,
	DataPoint,
} from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Combo chart utilities - combining multiple chart types in one visualization
 */

/**
 * Generate combo chart data with mixed chart types
 */
export function generateComboData(
	series: Array<{
		name: string;
		data: DataPoint[];
		chartType?: "bar" | "line" | "area" | "scatter";
		color?: string;
		yAxis?: "left" | "right";
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		stacked?: boolean;
		showLegend?: boolean;
		yAxes?: Array<{
			id: string;
			title?: string;
			position?: "left" | "right";
			min?: number;
			max?: number;
		}>;
	} = {},
): ComboData {
	const {
		title,
		orientation = "vertical",
		stacked = false,
		showLegend = true,
		yAxes = [],
	} = options;

	// Process series with default chart types and colors
	const processedSeries: Array<ChartSeries & { chartType?: string }> =
		series.map((s, index) => ({
			name: s.name,
			data: s.data,
			type: s.chartType || "bar",
			color: s.color || getSeriesColor(index),
			chartType: s.chartType,
			yAxis: s.yAxis,
		}));

	const chartData: ChartData = {
		title,
		series: processedSeries,
		orientation,
		stacked,
	};

	return {
		...chartData,
		series: processedSeries,
	};
}

/**
 * Generate combo chart from arrays with different types per series
 */
export function generateComboFromArrays(
	labels: string[],
	seriesData: Array<{
		name: string;
		values: number[];
		chartType?: "bar" | "line" | "area" | "scatter";
		color?: string;
		yAxis?: "left" | "right";
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		stacked?: boolean;
		showLegend?: boolean;
		yAxes?: Array<{
			id: string;
			title?: string;
			position?: "left" | "right";
			min?: number;
			max?: number;
		}>;
	} = {},
): ComboData {
	const series = seriesData.map(
		({ name, values, chartType, color, yAxis }) => ({
			name,
			data: labels.map((label, index) => ({
				x: label,
				y: values[index] || 0,
				label: values[index]?.toString(),
			})),
			chartType,
			color,
			yAxis,
		}),
	);

	return generateComboData(series, options);
}

/**
 * Generate common combo patterns
 */
export function generateComboPatterns() {
	return {
		// Bar + Line combo (common for showing trend with bars)
		barLine: (
			categories: string[],
			barValues: number[],
			lineValues: number[],
			options: {
				title?: string;
				barLabel?: string;
				lineLabel?: string;
				colors?: [string, string];
			} = {},
		): ComboData => {
			const { title, barLabel = "Bars", lineLabel = "Line", colors } = options;
			return generateComboFromArrays(
				categories,
				[
					{
						name: barLabel,
						values: barValues,
						chartType: "bar",
						color: colors?.[0],
					},
					{
						name: lineLabel,
						values: lineValues,
						chartType: "line",
						color: colors?.[1],
					},
				],
				{ title },
			);
		},

		// Area + Scatter combo
		areaScatter: (
			xValues: number[],
			areaValues: number[],
			scatterPoints: Array<{ x: number; y: number }>,
			options: {
				title?: string;
				areaLabel?: string;
				scatterLabel?: string;
				colors?: [string, string];
			} = {},
		): ComboData => {
			const {
				title,
				areaLabel = "Area",
				scatterLabel = "Points",
				colors,
			} = options;

			const series = [
				{
					name: areaLabel,
					data: xValues.map((x, i) => ({ x, y: areaValues[i] })),
					chartType: "area",
					color: colors?.[0],
				},
				{
					name: scatterLabel,
					data: scatterPoints,
					chartType: "scatter",
					color: colors?.[1],
				},
			];

			return generateComboData(series, { title });
		},

		// Dual axis combo (one series on left, one on right)
		dualAxis: (
			categories: string[],
			leftValues: number[],
			rightValues: number[],
			options: {
				title?: string;
				leftLabel?: string;
				rightLabel?: string;
				leftType?: "bar" | "line" | "area";
				rightType?: "line" | "area";
				colors?: [string, string];
			} = {},
		): ComboData => {
			const {
				title,
				leftLabel = "Left Axis",
				rightLabel = "Right Axis",
				leftType = "bar",
				rightType = "line",
				colors,
			} = options;

			const yAxes = [
				{ id: "left", title: leftLabel, position: "left" },
				{ id: "right", title: rightLabel, position: "right" },
			];

			return generateComboFromArrays(
				categories,
				[
					{
						name: leftLabel,
						values: leftValues,
						chartType: leftType,
						color: colors?.[0],
						yAxis: "left",
					},
					{
						name: rightLabel,
						values: rightValues,
						chartType: rightType,
						color: colors?.[1],
						yAxis: "right",
					},
				],
				{ title, yAxes },
			);
		},
	};
}

/**
 * Validate combo chart data for consistency
 */
export function validateComboData(data: ComboData): {
	valid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check if series exist
	if (!data.series || data.series.length === 0) {
		errors.push("Combo chart must have at least one series");
	}

	// Check for mixed chart types (main purpose of combo)
	const chartTypes = new Set(data.series.map((s) => s.chartType || s.type));
	if (chartTypes.size < 2) {
		warnings.push(
			"Combo chart should typically have multiple different chart types",
		);
	}

	// Validate dual axis setup
	const yAxes = data.series.map((s) => s.yAxis).filter(Boolean);
	if (yAxes.length > 0 && new Set(yAxes).size > 2) {
		errors.push("Combo chart supports maximum 2 Y-axes (left and right)");
	}

	// Check data consistency
	data.series.forEach((series, index) => {
		if (!series.data || series.data.length === 0) {
			errors.push(`Series ${index + 1} (${series.name}) has no data points`);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}


