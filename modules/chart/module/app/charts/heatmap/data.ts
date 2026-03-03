import type { HeatmapData } from '@/module/app/types/chart-basic';

/**
 * Generate heatmap data from 2D array
 */
export function generateHeatmapData(
	data: number[][],
	options: {
		xLabels?: string[];
		yLabels?: string[];
		title?: string;
		colors?: string[];
		minValue?: number;
		maxValue?: number;
	} = {},
): HeatmapData {
	const { xLabels, yLabels, colors, minValue, maxValue } = options;

	const defaultXLabels =
		xLabels || data[0]?.map((_, index) => `X${index}`) || [];
	const defaultYLabels = yLabels || data.map((_, index) => `Y${index}`);

	return {
		data,
		xLabels: defaultXLabels,
		yLabels: defaultYLabels,
		colors,
	};
}

/**
 * Generate heatmap from coordinate-value pairs
 */
export function generateHeatmapFromPoints(
	points: Array<{ x: number; y: number; value: number }>,
	gridSize: { width: number; height: number },
	options: {
		xLabels?: string[];
		yLabels?: string[];
		title?: string;
		colors?: string[];
	} = {},
): HeatmapData {
	const { xLabels, yLabels, colors } = options;

	const data: number[][] = Array.from({ length: gridSize.height }, () =>
		Array.from({ length: gridSize.width }, () => 0),
	);

	const xMin = Math.min(...points.map((p) => p.x));
	const xMax = Math.max(...points.map((p) => p.x));
	const yMin = Math.min(...points.map((p) => p.y));
	const yMax = Math.max(...points.map((p) => p.y));

	const xRange = xMax - xMin || 1;
	const yRange = yMax - yMin || 1;

	points.forEach((point) => {
		const xIndex = Math.floor(
			((point.x - xMin) / xRange) * (gridSize.width - 1),
		);
		const yIndex = Math.floor(
			((point.y - yMin) / yRange) * (gridSize.height - 1),
		);

		if (
			xIndex >= 0 &&
			xIndex < gridSize.width &&
			yIndex >= 0 &&
			yIndex < gridSize.height
		) {
			data[yIndex][xIndex] += point.value;
		}
	});

	const defaultXLabels =
		xLabels || Array.from({ length: gridSize.width }, (_, i) => `X${i}`);
	const defaultYLabels =
		yLabels || Array.from({ length: gridSize.height }, (_, i) => `Y${i}`);

	return {
		data,
		xLabels: defaultXLabels,
		yLabels: defaultYLabels,
		colors,
	};
}

/**
 * Create correlation heatmap from multiple variables
 */
export function generateCorrelationHeatmap(
	variables: Array<{ name: string; values: number[] }>,
): HeatmapData {
	const n = variables.length;
	const correlations: number[][] = Array.from({ length: n }, () =>
		Array(n).fill(0),
	);

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i === j) {
				correlations[i][j] = 1; // Perfect correlation with itself
			} else {
				correlations[i][j] = calculateCorrelation(
					variables[i].values,
					variables[j].values,
				);
			}
		}
	}

	return {
		data: correlations,
		xLabels: variables.map((v) => v.name),
		yLabels: variables.map((v) => v.name),
	};
}

// Helper function for correlation calculation
function calculateCorrelation(x: number[], y: number[]): number {
	const n = x.length;
	const sumX = x.reduce((a, b) => a + b, 0);
	const sumY = y.reduce((a, b) => a + b, 0);
	const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
	const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
	const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

	const numerator = n * sumXY - sumX * sumY;
	const denominator = Math.sqrt(
		(n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY),
	);

	return denominator === 0 ? 0 : numerator / denominator;
}


