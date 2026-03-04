import type { HexbinData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateHexBins } from './hexbin-layout';

/**
 * Generate hexbin data
 */
export function generateHexbinData(
	points: Array<{
		x: number;
		y: number;
		value?: number;
	}>,
	options: {
		title?: string;
		binSize?: number;
		colorScale?: string[];
		minCount?: number;
		maxCount?: number;
		showEmptyBins?: boolean;
		normalizeByArea?: boolean;
	} = {},
): HexbinData {
	const {
		title,
		binSize = 10,
		colorScale = ["#f7fbff", "#08306b"],
		minCount,
		maxCount,
		showEmptyBins = false,
		normalizeByArea = false,
	} = options;

	// Calculate hexagonal bins
	const bins = calculateHexBins(points, binSize);

	// Filter and process bins
	let processedBins = bins.filter((bin) => showEmptyBins || bin.count > 0);

	// Apply min/max count filters
	if (minCount !== undefined) {
		processedBins = processedBins.filter((bin) => bin.count >= minCount);
	}
	if (maxCount !== undefined) {
		processedBins = processedBins.filter((bin) => bin.count <= maxCount);
	}

	// Calculate statistics for color scaling
	const counts = processedBins.map((bin) => bin.count);
	const minCountActual = Math.min(...counts);
	const maxCountActual = Math.max(...counts);

	// Assign colors based on count
	const processedPoints = processedBins.map((bin) => {
		const intensity =
			maxCountActual > minCountActual
				? (bin.count - minCountActual) / (maxCountActual - minCountActual)
				: 0.5;

		const colorIndex = Math.floor(intensity * (colorScale.length - 1));
		const color =
			colorScale[Math.max(0, Math.min(colorScale.length - 1, colorIndex))];

		return {
			x: bin.x,
			y: bin.y,
			value: bin.count,
			color,
		};
	});

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Hexbins",
				data: processedPoints,
				type: "hexbin",
			},
		],
	};

	return {
		...chartData,
		points: processedPoints,
		binSize,
	};
}

/**
 * Generate hexbin from arrays
 */
export function generateHexbinFromArrays(
	xValues: number[],
	yValues: number[],
	options: {
		title?: string;
		values?: number[];
	} = {},
): HexbinData {
	const { values, ...otherOptions } = options;

	const points = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		value: values?.[index],
	}));

	return generateHexbinData(points, otherOptions);
}

/**
 * Generate hexbin with density overlay
 */
export function generateHexbinWithDensity(
	points: Array<{ x: number; y: number; value?: number }>,
	options: {
		title?: string;
		binSize?: number;
		showContours?: boolean;
		contourLevels?: number;
	} = {},
): HexbinData {
	const {
		title,
		binSize = 10,
		showContours = false,
		contourLevels = 5,
	} = options;

	const hexData = generateHexbinData(points, { title, binSize });

	// Add contour lines if requested
	if (showContours) {
		// This would require more complex contour calculation
		// For now, just return the basic hexbin data
		console.warn("Contour generation not yet implemented");
	}

	return hexData;
}

/**
 * Generate comparative hexbin (two datasets)
 */
export function generateComparativeHexbin(
	dataset1: Array<{ x: number; y: number; value?: number }>,
	dataset2: Array<{ x: number; y: number; value?: number }>,
	labels: [string, string] = ["Dataset 1", "Dataset 2"],
	options: {
		title?: string;
		binSize?: number;
		comparisonMode?: "difference" | "ratio" | "overlay";
	} = {},
): {
	title?: string;
	datasets: [HexbinData, HexbinData];
	comparison?: HexbinData;
} {
	const { title, binSize = 10, comparisonMode = "overlay" } = options;

	const data1 = generateHexbinData(dataset1, { title: labels[0], binSize });
	const data2 = generateHexbinData(dataset2, { title: labels[1], binSize });

	let comparison: HexbinData | undefined;

	if (comparisonMode === "difference" || comparisonMode === "ratio") {
		// Create comparison bins
		const bins1 = calculateHexBins(dataset1, binSize);
		const bins2 = calculateHexBins(dataset2, binSize);

		const comparisonBins = new Map<
			string,
			{
				x: number;
				y: number;
				count1: number;
				count2: number;
				comparisonValue: number;
			}
		>();

		// Add all bins from dataset 1
		bins1.forEach((bin) => {
			comparisonBins.set(`${bin.x},${bin.y}`, {
				x: bin.x,
				y: bin.y,
				count1: bin.count,
				count2: 0,
				comparisonValue:
					comparisonMode === "difference" ? bin.count : bin.count,
			});
		});

		// Add/merge bins from dataset 2
		bins2.forEach((bin) => {
			const key = `${bin.x},${bin.y}`;
			const existing = comparisonBins.get(key);

			if (existing) {
				existing.count2 = bin.count;
				existing.comparisonValue =
					comparisonMode === "difference"
						? existing.count1 - bin.count
						: existing.count1 > 0
							? bin.count / existing.count1
							: 0;
			} else {
				comparisonBins.set(key, {
					x: bin.x,
					y: bin.y,
					count1: 0,
					count2: bin.count,
					comparisonValue: comparisonMode === "difference" ? -bin.count : 0,
				});
			}
		});

		// Create comparison hexbin data
		const comparisonPoints = Array.from(comparisonBins.values()).map((bin) => ({
			x: bin.x,
			y: bin.y,
			value: bin.comparisonValue,
		}));

		comparison = generateHexbinData(comparisonPoints, {
			title: `${labels[0]} vs ${labels[1]} (${comparisonMode})`,
			binSize,
		});
	}

	return {
		title,
		datasets: [data1, data2],
		comparison,
	};
}


