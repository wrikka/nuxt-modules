import type {
	ConnectedScatterData,
	ChartData,
	DataPoint,
} from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateTrendLine, calculateRegressionLine } from './connected-scatter-utils';

/**
 * Connected scatter utilities - scatter with connected points
 */

/**
 * Generate connected scatter data
 */
export function generateConnectedScatterData(
	points: Array<{
		x: string | number;
		y: number;
		label?: string;
		color?: string;
		size?: number;
	}>,
	options: {
		title?: string;
		connectPoints?: boolean;
		lineColor?: string;
		lineWidth?: number;
		showTrendLine?: boolean;
		trendLineColor?: string;
		pointSize?: number;
		sortBy?: "x" | "y" | "none";
		showLabels?: boolean;
	} = {},
): ConnectedScatterData {
	const {
		title,
		connectPoints = true,
		lineColor,
		lineWidth = 2,
		showTrendLine = false,
		trendLineColor = "#ff6b6b",
		pointSize = 6,
		sortBy = "none",
		showLabels = false,
	} = options;

	// Sort points if requested
	let sortedPoints = points;
	if (sortBy === "x") {
		sortedPoints = [...points].sort((a, b) => {
			const aX = typeof a.x === "string" ? a.x : a.x;
			const bX = typeof b.x === "string" ? b.x : b.x;
			if (typeof aX === "string" && typeof bX === "string") {
				return aX.localeCompare(bX);
			}
			return (aX as number) - (bX as number);
		});
	} else if (sortBy === "y") {
		sortedPoints = [...points].sort((a, b) => a.y - b.y);
	}

	// Process points
	const processedPoints = sortedPoints.map((point, index) => ({
		x: point.x,
		y: point.y,
		label: showLabels ? point.label || `(${point.x}, ${point.y})` : undefined,
		color: point.color || getSeriesColor(0),
		size: point.size || pointSize,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Connected Scatter",
				data: processedPoints,
				type: "scatter",
			},
		],
	};

	// Add connection line series if requested
	if (connectPoints && processedPoints.length > 1) {
		chartData.series.push({
			name: "Connection Line",
			data: processedPoints.map((point) => ({
				x: point.x,
				y: point.y,
				color: lineColor || processedPoints[0].color,
			})),
			type: "line",
		});
	}

	// Add trend line if requested
	if (showTrendLine && processedPoints.length > 1) {
		const trendLine = calculateTrendLine(processedPoints);
		if (trendLine) {
			chartData.series.push({
				name: "Trend Line",
				data: trendLine,
				type: "line",
			});
		}
	}

	return {
		...chartData,
		points: processedPoints,
		connectPoints,
	};
}

/**
 * Generate connected scatter from arrays
 */
export function generateConnectedScatterFromArrays(
	xValues: Array<string | number>,
	yValues: number[],
	options: {
		title?: string;
		labels?: string[];
		colors?: string[];
		sizes?: number[];
	} = {},
): ConnectedScatterData {
	const { labels, colors, sizes, ...otherOptions } = options;

	const points = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		label: labels?.[index],
		color: colors?.[index],
		size: sizes?.[index],
	}));

	return generateConnectedScatterData(points, otherOptions);
}

/**
 * Generate time series connected scatter
 */
export function generateTimeSeriesConnectedScatter(
	timeSeries: Array<{
		time: string | number | Date;
		value: number;
		label?: string;
		color?: string;
	}>,
	options: {
		title?: string;
		connectPoints?: boolean;
		showMovingAverage?: boolean;
		movingAveragePeriod?: number;
		movingAverageColor?: string;
	} = {},
): ConnectedScatterData {
	const {
		title,
		connectPoints = true,
		showMovingAverage = false,
		movingAveragePeriod = 5,
		movingAverageColor = "#4ecdc4",
	} = options;

	const points = timeSeries.map((item) => ({
		x: item.time,
		y: item.value,
		label: item.label,
		color: item.color || getSeriesColor(0),
	}));

	let optionsWithMA = { ...options };
	delete optionsWithMA.showMovingAverage;
	delete optionsWithMA.movingAveragePeriod;
	delete optionsWithMA.movingAverageColor;

	const data = generateConnectedScatterData(points, optionsWithMA);

	// Add moving average if requested
	if (showMovingAverage && points.length >= movingAveragePeriod) {
		const maPoints: DataPoint[] = [];

		for (let i = movingAveragePeriod - 1; i < points.length; i++) {
			const window = points.slice(i - movingAveragePeriod + 1, i + 1);
			const average = window.reduce((sum, p) => sum + p.y, 0) / window.length;

			maPoints.push({
				x: points[i].x,
				y: average,
				color: movingAverageColor,
			});
		}

		data.series.push({
			name: `Moving Average (${movingAveragePeriod})`,
			data: maPoints,
			type: "line",
		});
	}

	return data;
}

/**
 * Generate bivariate connected scatter (two variables)
 */
export function generateBivariateConnectedScatter(
	data: Array<{
		x: number;
		y: number;
		label?: string;
		time?: string | number | Date;
	}>,
	options: {
		title?: string;
		connectByTime?: boolean;
		showRegression?: boolean;
		regressionColor?: string;
	} = {},
): ConnectedScatterData {
	const {
		title,
		connectByTime = false,
		showRegression = false,
		regressionColor = "#ff6b6b",
	} = options;

	let points = data.map((item) => ({
		x: item.x,
		y: item.y,
		label: item.label,
		color: getSeriesColor(0),
	}));

	// Sort by time if connecting by time
	if (connectByTime) {
		points = data
			.sort((a, b) => {
				if (!a.time || !b.time) return 0;
				const aTime =
					typeof a.time === "string" ? new Date(a.time).getTime() : a.time;
				const bTime =
					typeof b.time === "string" ? new Date(b.time).getTime() : b.time;
				return aTime - bTime;
			})
			.map((item) => ({
				x: item.x,
				y: item.y,
				label: item.label,
				color: getSeriesColor(0),
			}));
	}

	const result = generateConnectedScatterData(points, {
		title,
		connectPoints: connectByTime,
	});

	// Add regression line if requested
	if (showRegression && points.length > 2) {
		const regressionLine = calculateRegressionLine(points);
		if (regressionLine) {
			result.series.push({
				name: "Regression Line",
				data: regressionLine,
				type: "line",
			});
		}
	}

	return result;
}

export { calculateConnectedScatterStatistics } from './connected-scatter-stats';


