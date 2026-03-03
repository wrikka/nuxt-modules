import type { HeatmapData } from '@/module/app/types/chart-basic';

/**
 * Normalize heatmap data to 0-1 range
 */
export function normalizeHeatmapData(heatmap: HeatmapData): HeatmapData {
	const allValues = heatmap.data.flat();
	const min = Math.min(...allValues);
	const max = Math.max(...allValues);
	const range = max - min;

	if (range === 0) {
		return {
			...heatmap,
			data: heatmap.data.map((row) => row.map(() => 0.5)),
		};
	}

	return {
		...heatmap,
		data: heatmap.data.map((row) => row.map((value) => (value - min) / range)),
	};
}

/**
 * Calculate heatmap statistics
 */
export function calculateHeatmapStats(heatmap: HeatmapData) {
	const allValues = heatmap.data.flat();

	return {
		min: Math.min(...allValues),
		max: Math.max(...allValues),
		mean: allValues.reduce((sum, val) => sum + val, 0) / allValues.length,
		total: allValues.reduce((sum, val) => sum + val, 0),
		rows: heatmap.data.length,
		cols: heatmap.data[0]?.length || 0,
		totalCells: allValues.length,
		zeroCells: allValues.filter((val) => val === 0).length,
		nonZeroCells: allValues.filter((val) => val !== 0).length,
	};
}

/**
 * Find hotspots in heatmap (cells with high values)
 */
export function findHeatmapHotspots(
	heatmap: HeatmapData,
	threshold?: number,
): Array<{
	x: number;
	y: number;
	value: number;
	xLabel: string;
	yLabel: string;
}> {
	const stats = calculateHeatmapStats(heatmap);
	const thresholdValue =
		threshold ?? stats.mean + (stats.max - stats.mean) * 0.7;

	const hotspots: Array<{
		x: number;
		y: number;
		value: number;
		xLabel: string;
		yLabel: string;
	}> = [];

	heatmap.data.forEach((row, yIndex) => {
		row.forEach((value, xIndex) => {
			if (value >= thresholdValue) {
				hotspots.push({
					x: xIndex,
					y: yIndex,
					value,
					xLabel: heatmap.xLabels[xIndex] || `X${xIndex}`,
					yLabel: heatmap.yLabels[yIndex] || `Y${yIndex}`,
				});
			}
		});
	});

	return hotspots.sort((a, b) => b.value - a.value);
}

/**
 * Calculate row and column sums for heatmap
 */
export function calculateHeatmapSums(heatmap: HeatmapData) {
	const rowSums = heatmap.data.map((row, index) => ({
		label: heatmap.yLabels[index] || `Row ${index}`,
		sum: row.reduce((sum, val) => sum + val, 0),
		values: row,
	}));

	const colSums =
		heatmap.data[0]?.map((_, colIndex) => {
			const sum = heatmap.data.reduce((total, row) => total + row[colIndex], 0);
			return {
				label: heatmap.xLabels[colIndex] || `Col ${colIndex}`,
				sum,
				values: heatmap.data.map((row) => row[colIndex]),
			};
		}) || [];

	return { rowSums, colSums };
}


