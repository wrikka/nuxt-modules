import type {
	HeatmapData,
	ChartData,
	ChartSeries,
	DataPoint,
} from '@/module/app/types/chart-basic';

/**
 * Apply Gaussian blur to heatmap data
 */
export function applyGaussianBlur(
	heatmap: HeatmapData,
	sigma: number = 1,
): HeatmapData {
	const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
	const kernel = generateGaussianKernel(kernelSize, sigma);

	const blurredData = heatmap.data.map((row, y) =>
		row.map((_, x) => applyKernel(heatmap.data, x, y, kernel)),
	);

	return {
		...heatmap,
		data: blurredData,
	};
}

// Helper functions for Gaussian blur
function generateGaussianKernel(size: number, sigma: number): number[][] {
	const kernel: number[][] = [];
	const center = Math.floor(size / 2);

	for (let i = 0; i < size; i++) {
		kernel[i] = [];
		for (let j = 0; j < size; j++) {
			const x = i - center;
			const y = j - center;
			kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
		}
	}

	// Normalize kernel
	const sum = kernel.flat().reduce((a, b) => a + b, 0);
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			kernel[i][j] /= sum;
		}
	}

	return kernel;
}

function applyKernel(
	data: number[][],
	x: number,
	y: number,
	kernel: number[][],
): number {
	const kernelSize = kernel.length;
	const halfSize = Math.floor(kernelSize / 2);
	let sum = 0;

	for (let i = 0; i < kernelSize; i++) {
		for (let j = 0; j < kernelSize; j++) {
			const dataY = Math.max(0, Math.min(data.length - 1, y + i - halfSize));
			const dataX = Math.max(
				0,
				Math.min(data[0]?.length - 1 || 0, x + j - halfSize),
			);
			sum += data[dataY][dataX] * kernel[i][j];
		}
	}

	return sum;
}

/**
 * Convert heatmap to chart data format for other visualizations
 */
export function heatmapToChartData(heatmap: HeatmapData): ChartData {
	const series: ChartSeries[] = [];

	heatmap.data.forEach((row, yIndex) => {
		const data: DataPoint[] = row.map((value, xIndex) => ({
			x: heatmap.xLabels[xIndex] || `X${xIndex}`,
			y: value,
		}));

		series.push({
			name: heatmap.yLabels[yIndex] || `Y${yIndex}`,
			data,
			type: "line",
		});
	});

	return { series };
}


