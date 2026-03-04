import type {
	ConnectedScatterData,
	ChartData,
	DataPoint,
} from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateTrendLine } from './connected-scatter-utils';

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


