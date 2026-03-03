import type { StepData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Step chart utilities - line chart with step transitions
 */

/**
 * Generate step chart data
 */
export function generateStepData(
	data: Array<{ x: string | number | Date; y: number; color?: string }>,
	options: {
		title?: string;
		stepPosition?: "start" | "middle" | "end";
		lineWidth?: number;
		showPoints?: boolean;
		pointSize?: number;
		fillArea?: boolean;
		fillOpacity?: number;
		smoothTransitions?: boolean;
	} = {},
): StepData {
	const {
		title,
		stepPosition = "middle",
		lineWidth = 2,
		showPoints = false,
		pointSize = 4,
		fillArea = false,
		fillOpacity = 0.1,
		smoothTransitions = false,
	} = options;

	// Create step data points based on step position
	const stepData: DataPoint[] = [];

	data.forEach((point, index) => {
		const currentPoint: DataPoint = {
			x: point.x,
			y: point.y,
			label: point.y.toString(),
			color: point.color || getSeriesColor(0),
		};

		stepData.push(currentPoint);

		// Add intermediate step points based on step position
		if (index < data.length - 1) {
			const nextPoint = data[index + 1];

			if (stepPosition === "middle") {
				// Add horizontal step at midpoint between x values
				const midX =
					typeof point.x === "number" && typeof nextPoint.x === "number"
						? (point.x + nextPoint.x) / 2
						: point.x; // Keep as is for non-numeric x

				stepData.push({
					x: midX,
					y: point.y,
					color: point.color || getSeriesColor(0),
				});
			} else if (stepPosition === "start") {
				// Horizontal step first, then vertical
				stepData.push({
					x: nextPoint.x,
					y: point.y,
					color: point.color || getSeriesColor(0),
				});
			}
			// For 'end', no intermediate point needed - just connect directly
		}
	});

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Step Chart",
				data: stepData,
				type: "step",
			},
		],
	};

	return {
		...chartData,
		stepPosition,
	};
}

/**
 * Generate step chart from arrays
 */
export function generateStepFromArrays(
	xValues: Array<string | number | Date>,
	yValues: number[],
	options: {
		title?: string;
		color?: string;
		stepPosition?: "start" | "middle" | "end";
		lineWidth?: number;
		showPoints?: boolean;
		pointSize?: number;
		fillArea?: boolean;
		fillOpacity?: number;
	} = {},
): StepData {
	const { color, ...otherOptions } = options;

	const data = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		color,
	}));

	return generateStepData(data, otherOptions);
}

/**
 * Generate comparison step chart (multiple series)
 */
export function generateComparisonStepData(
	series: Array<{
		name: string;
		data: Array<{ x: string | number | Date; y: number }>;
		color?: string;
	}>,
	options: {
		title?: string;
		stepPosition?: "start" | "middle" | "end";
		showLegend?: boolean;
		lineWidth?: number;
		showPoints?: boolean;
	} = {},
): StepData {
	const {
		title,
		stepPosition = "middle",
		showLegend = true,
		lineWidth = 2,
		showPoints = false,
	} = options;

	const processedSeries = series.map((s, index) => {
		const stepData = generateStepData(
			s.data.map((d) => ({ ...d, color: s.color })),
			{
				stepPosition,
				lineWidth,
				showPoints,
			},
		);

		return {
			name: s.name,
			data: stepData.series[0].data,
			type: "step" as const,
			color: s.color || getSeriesColor(index),
		};
	});

	const chartData: ChartData = {
		title,
		series: processedSeries,
	};

	return {
		...chartData,
		stepPosition,
	};
}

/**
 * Generate step chart for time series data
 */
export function generateTimeStepData(
	timeSeries: Array<{ timestamp: Date; value: number }>,
	options: {
		title?: string;
		stepPosition?: "start" | "middle" | "end";
		timeFormat?: "date" | "hours" | "minutes";
		color?: string;
		showPoints?: boolean;
	} = {},
): StepData {
	const { timeFormat = "date", color, ...otherOptions } = options;

	const data = timeSeries.map((item) => ({
		x:
			timeFormat === "hours"
				? item.timestamp.getHours()
				: timeFormat === "minutes"
					? item.timestamp.getTime() / 60000
					: item.timestamp,
		y: item.value,
		color,
	}));

	return generateStepData(data, otherOptions);
}

/**
 * Calculate step chart statistics
 */
export function calculateStepStatistics(
	data: Array<{ x: string | number | Date; y: number }>,
): {
	totalSteps: number;
	maxValue: number;
	minValue: number;
	averageValue: number;
	totalChange: number;
	stepChanges: Array<{
		from: number;
		to: number;
		change: number;
		percentage: number;
	}>;
} {
	if (data.length < 2) {
		return {
			totalSteps: 0,
			maxValue: data[0]?.y || 0,
			minValue: data[0]?.y || 0,
			averageValue: data[0]?.y || 0,
			totalChange: 0,
			stepChanges: [],
		};
	}

	const values = data.map((d) => d.y);
	const maxValue = Math.max(...values);
	const minValue = Math.min(...values);
	const averageValue =
		values.reduce((sum, val) => sum + val, 0) / values.length;

	const stepChanges = [];
	for (let i = 1; i < data.length; i++) {
		const from = data[i - 1].y;
		const to = data[i].y;
		const change = to - from;
		const percentage = from !== 0 ? (change / from) * 100 : 0;

		stepChanges.push({ from, to, change, percentage });
	}

	const totalChange = data[data.length - 1].y - data[0].y;

	return {
		totalSteps: stepChanges.length,
		maxValue,
		minValue,
		averageValue,
		totalChange,
		stepChanges,
	};
}


