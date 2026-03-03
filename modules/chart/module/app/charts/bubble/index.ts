import type { ScatterData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Bubble chart utilities and data generation
 */

/**
 * Generate bubble chart data from x, y coordinates and sizes
 */
export function generateBubbleData(
	xValues: number[],
	yValues: number[],
	sizes: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		minSize?: number;
		maxSize?: number;
	} = {},
): ScatterData {
	const {
		title,
		seriesName = "Bubbles",
		color,
		minSize = 5,
		maxSize = 50,
	} = options;

	const data: DataPoint[] = xValues.map((x, index) => {
		const size = sizes[index];
		const scaledSize =
			minSize + (size / Math.max(...sizes)) * (maxSize - minSize);
		return {
			x,
			y: yValues[index],
			size: scaledSize,
			color: color || getSeriesColor(0),
		};
	});

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "bubble",
			},
		],
	};
}

/**
 * Generate bubble chart from data points array
 */
export function generateBubbleFromPoints(
	points: Array<{
		x: number;
		y: number;
		size: number;
		label?: string;
		color?: string;
	}>,
	options: {
		title?: string;
		seriesName?: string;
		minSize?: number;
		maxSize?: number;
	} = {},
): ScatterData {
	const {
		title,
		seriesName = "Data Bubbles",
		minSize = 5,
		maxSize = 50,
	} = options;

	const sizes = points.map((p) => p.size);
	const maxSizeValue = Math.max(...sizes);

	const data: DataPoint[] = points.map((point, index) => {
		const scaledSize =
			minSize + (point.size / maxSizeValue) * (maxSize - minSize);
		return {
			x: point.x,
			y: point.y,
			size: scaledSize,
			label: point.label,
			color: point.color || getSeriesColor(index),
		};
	});

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "bubble",
			},
		],
	};
}

/**
 * Generate multiple series bubble chart
 */
export function generateMultiBubbleData(
	seriesData: Array<{
		name: string;
		points: Array<{ x: number; y: number; size: number; label?: string }>;
		color?: string;
	}>,
): ScatterData {
	const series: ChartSeries[] = seriesData.map((seriesItem, index) => {
		const sizes = seriesItem.points.map((p) => p.size);
		const maxSize = Math.max(...sizes);

		const data: DataPoint[] = seriesItem.points.map((point) => {
			const scaledSize = 5 + (point.size / maxSize) * 45; // 5 to 50
			return {
				x: point.x,
				y: point.y,
				size: scaledSize,
				label: point.label,
				color: seriesItem.color || getSeriesColor(index),
			};
		});

		return {
			name: seriesItem.name,
			data,
			type: "bubble",
			color: seriesItem.color || getSeriesColor(index),
		};
	});

	return {
		series,
	};
}

/**
 * Calculate correlation between x, y and size for bubble chart
 */
export function calculateBubbleCorrelation(data: ScatterData): {
	xy: number;
	xSize: number;
	ySize: number;
} {
	const series = data.series[0];
	if (!series) return { xy: 0, xSize: 0, ySize: 0 };

	const points = series.data.filter(
		(p) =>
			typeof p.x === "number" &&
			typeof p.y === "number" &&
			typeof (p as any).size === "number",
	) as Array<{ x: number; y: number; size: number }>;

	if (points.length < 2) return { xy: 0, xSize: 0, ySize: 0 };

	const n = points.length;

	// XY correlation
	const sumX = points.reduce((sum, p) => sum + p.x, 0);
	const sumY = points.reduce((sum, p) => sum + p.y, 0);
	const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
	const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
	const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);

	const xyCorr =
		(n * sumXY - sumX * sumY) /
		Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

	// X-Size correlation
	const sumSize = points.reduce((sum, p) => sum + p.size, 0);
	const sumXSize = points.reduce((sum, p) => sum + p.x * p.size, 0);
	const sumSizeSize = points.reduce((sum, p) => sum + p.size * p.size, 0);

	const xSizeCorr =
		(n * sumXSize - sumX * sumSize) /
		Math.sqrt(
			(n * sumXX - sumX * sumX) * (n * sumSizeSize - sumSize * sumSize),
		);

	// Y-Size correlation
	const sumYSize = points.reduce((sum, p) => sum + p.y * p.size, 0);

	const ySizeCorr =
		(n * sumYSize - sumY * sumSize) /
		Math.sqrt(
			(n * sumYY - sumY * sumY) * (n * sumSizeSize - sumSize * sumSize),
		);

	return {
		xy: isNaN(xyCorr) ? 0 : xyCorr,
		xSize: isNaN(xSizeCorr) ? 0 : xSizeCorr,
		ySize: isNaN(ySizeCorr) ? 0 : ySizeCorr,
	};
}

/**
 * Find size-based clusters in bubble chart data
 */
export function findBubbleClusters(
	data: ScatterData,
	k: number = 3,
): Array<{
	centroid: { x: number; y: number; size: number };
	points: DataPoint[];
}> {
	const series = data.series[0];
	if (!series || series.data.length < k) return [];

	const points = series.data.filter(
		(p) =>
			typeof p.x === "number" &&
			typeof p.y === "number" &&
			typeof (p as any).size === "number",
	) as Array<{ x: number; y: number; size: number }>;

	// Simple clustering based on size ranges
	const sizes = points.map((p) => p.size).sort((a, b) => a - b);
	const sizeRanges = [];
	for (let i = 0; i < k; i++) {
		const start = Math.floor((sizes.length / k) * i);
		const end = Math.floor((sizes.length / k) * (i + 1));
		sizeRanges.push({
			min: sizes[start],
			max: sizes[end - 1] || sizes[sizes.length - 1],
		});
	}

	const clusters = sizeRanges
		.map((range) => {
			const clusterPoints = points.filter(
				(p) => p.size >= range.min && p.size <= range.max,
			);
			if (clusterPoints.length === 0) return null;

			const avgX =
				clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
			const avgY =
				clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
			const avgSize =
				clusterPoints.reduce((sum, p) => sum + p.size, 0) /
				clusterPoints.length;

			return {
				centroid: { x: avgX, y: avgY, size: avgSize },
				points: clusterPoints,
			};
		})
		.filter((cluster) => cluster !== null) as Array<{
		centroid: { x: number; y: number; size: number };
		points: DataPoint[];
	}>;

	return clusters;
}


