import type {
	SlopeData,
	ChartData,
	DataPoint,
} from "../types/chart.js";
import { getSeriesColor } from "../utils/chart-utils.js";
import { calculateTrendLine } from './connected-scatter-utils';

/**
 * Generate slope chart data
 */
export function generateSlopeData(
	slopes: Array<{
		label: string;
		start: { x: string | number; y: number };
		end: { x: string | number; y: number };
		color?: string;
		thickness?: number;
	}>,
	options: {
		title?: string;
		showLabels?: boolean;
		labelPosition?: "start" | "end" | "both" | "none";
		showValues?: boolean;
		lineStyle?: "solid" | "dashed" | "dotted";
		arrowHeads?: boolean;
		gridLines?: boolean;
		normalizeScale?: boolean;
		sortBy?: "slope" | "startValue" | "endValue" | "label" | "none";
	} = {},
): SlopeData {
	const {
		title,
		showLabels = true,
		labelPosition = "both",
		showValues = false,
		lineStyle = "solid",
		arrowHeads = true,
		gridLines = true,
		normalizeScale = false,
		sortBy = "none",
	} = options;

	// Calculate slope statistics and sort if requested
	let processedSlopes = slopes.map((slope, index) => {
		const slopeValue =
			(slope.end.y - slope.start.y) /
			(typeof slope.end.x === "number" && typeof slope.start.x === "number"
				? slope.end.x - slope.start.x
				: 1);
		const change = slope.end.y - slope.start.y;
		const percentChange =
			slope.start.y !== 0 ? (change / slope.start.y) * 100 : 0;

		return {
			label: slope.label,
			start: slope.start,
			end: slope.end,
			color: slope.color || getSeriesColor(index),
			thickness: slope.thickness || 2,
			slope: slopeValue,
			change,
			percentChange,
			direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
		};
	});

	// Sort slopes
	switch (sortBy) {
		case "slope":
			processedSlopes.sort((a, b) => b.slope - a.slope);
			break;
		case "startValue":
			processedSlopes.sort((a, b) => b.start.y - a.start.y);
			break;
		case "endValue":
			processedSlopes.sort((a, b) => b.end.y - a.end.y);
			break;
		case "label":
			processedSlopes.sort((a, b) => a.label.localeCompare(b.label));
			break;
		case "none":
		default:
			// Keep original order
			break;
	}

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Slope Chart",
				data: processedSlopes.flatMap((slope) => [
					{
						x: slope.start.x,
						y: slope.start.y,
						label:
							showLabels &&
								(labelPosition === "start" || labelPosition === "both")
								? showValues
									? `${slope.label}: ${slope.start.y}`
									: slope.label
								: undefined,
						color: slope.color,
					},
					{
						x: slope.end.x,
						y: slope.end.y,
						label:
							showLabels &&
								(labelPosition === "end" || labelPosition === "both")
								? showValues
									? `${slope.label}: ${slope.end.y}`
									: slope.label
								: undefined,
						color: slope.color,
					},
				]),
				type: "slope",
			},
		],
	};

	return {
		...chartData,
		slopes: processedSlopes,
	};
}

/**
 * Generate slope chart from arrays
 */
export function generateSlopeFromArrays(
	labels: string[],
	startValues: number[],
	endValues: number[],
	options: {
		title?: string;
		startLabel?: string;
		endLabel?: string;
		colors?: string[];
	} = {},
): SlopeData {
	const {
		startLabel = "Start",
		endLabel = "End",
		colors,
		...otherOptions
	} = options;

	const slopes = labels.map((label, index) => ({
		label,
		start: { x: startLabel, y: startValues[index] },
		end: { x: endLabel, y: endValues[index] },
		color: colors?.[index],
	}));

	return generateSlopeData(slopes, otherOptions);
}


