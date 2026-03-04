import type { BulletData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Bullet chart utilities and data generation
 */

/**
 * Generate bullet chart data
 */
export function generateBulletData(
	measures: Array<{
		title: string;
		value: number;
		target: number;
		ranges: number[];
		colors?: string[];
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showLabels?: boolean;
		showValues?: boolean;
		rangeLabels?: string[];
	} = {},
): BulletData {
	const {
		title,
		orientation = "horizontal",
		showLabels = true,
		showValues = true,
		rangeLabels = ["Poor", "Satisfactory", "Good"],
	} = options;

	// Validate ranges (should be 2-3 ranges typically)
	const validatedMeasures = measures.map((measure) => {
		const ranges = [...measure.ranges];
		const colors = measure.colors || [
			"#FF5722", // Red for poor
			"#FFC107", // Yellow for satisfactory
			"#4CAF50", // Green for good
		];

		// Ensure we have colors for all ranges
		while (colors.length < ranges.length) {
			colors.push(getSeriesColor(colors.length));
		}

		return {
			...measure,
			ranges,
			colors: colors.slice(0, ranges.length),
		};
	});

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Bullet Chart",
				data: validatedMeasures.map((measure) => ({
					x: measure.title,
					y: measure.value,
					label: showValues ? measure.value.toString() : undefined,
				})),
				type: "bullet",
			},
		],
	};

	return {
		...chartData,
		measures: validatedMeasures,
	};
}

/**
 * Generate single bullet chart
 */
export function generateSingleBulletData(
	title: string,
	value: number,
	target: number,
	ranges: number[],
	options: {
		chartTitle?: string;
		colors?: string[];
		showLabels?: boolean;
		showValues?: boolean;
		rangeLabels?: string[];
	} = {},
): BulletData {
	const { chartTitle, ...otherOptions } = options;

	return generateBulletData(
		[
			{
				title,
				value,
				target,
				ranges,
				colors: otherOptions.colors,
			},
		],
		{
			title: chartTitle,
			...otherOptions,
		},
	);
}

/**
 * Generate KPI bullet charts
 */
export function generateKPIBulletCharts(
	kpis: Array<{
		name: string;
		current: number;
		target: number;
		ranges: [number, number, number]; // [poor, satisfactory, good]
		unit?: string;
	}>,
	options: {
		title?: string;
		showUnits?: boolean;
	} = {},
): BulletData {
	const { title, showUnits = true } = options;

	const measures = kpis.map((kpi) => ({
		title: kpi.name,
		value: kpi.current,
		target: kpi.target,
		ranges: kpi.ranges,
		colors: ["#FF5722", "#FFC107", "#4CAF50"],
	}));

	return generateBulletData(measures, {
		title,
		showValues: showUnits,
		showLabels: true,
	});
}

/**
 * Calculate bullet chart performance indicators
 */
export function calculateBulletPerformance(
	value: number,
	target: number,
	ranges: number[],
): {
	performance: "poor" | "satisfactory" | "good" | "excellent";
	achievement: number; // percentage of target achieved
	rangeIndex: number; // which range the value falls into
} {
	const achievement = (value / target) * 100;

	let performance: "poor" | "satisfactory" | "good" | "excellent" = "poor";
	let rangeIndex = 0;

	// Determine which range the value falls into
	for (let i = ranges.length - 1; i >= 0; i--) {
		if (value >= ranges[i]) {
			rangeIndex = i;
			break;
		}
	}

	// Determine performance level
	if (achievement >= 100) {
		performance = "excellent";
	} else if (rangeIndex === ranges.length - 1) {
		performance = "good";
	} else if (rangeIndex === ranges.length - 2) {
		performance = "satisfactory";
	} else {
		performance = "poor";
	}

	return { performance, achievement, rangeIndex };
}

/**
 * Generate bullet chart with performance indicators
 */
export function generateBulletWithPerformance(
	measures: Array<{
		title: string;
		value: number;
		target: number;
		ranges: number[];
		colors?: string[];
	}>,
	options: {
		title?: string;
		showPerformance?: boolean;
	} = {},
): BulletData {
	const { title, showPerformance = false } = options;

	const bulletData = generateBulletData(measures, { title });

	if (showPerformance) {
		// Add performance calculations to each measure
		bulletData.measures = bulletData.measures.map((measure) => ({
			...measure,
			performance: calculateBulletPerformance(
				measure.value,
				measure.target,
				measure.ranges,
			),
		}));
	}

	return bulletData;
}

/**
 * Generate comparative bullet charts
 */
export function generateComparativeBulletCharts(
	periods: Array<{
		name: string;
		measures: Array<{
			title: string;
			value: number;
			target: number;
			ranges: number[];
		}>;
	}>,
	options: {
		title?: string;
	} = {},
): ChartData {
	const { title } = options;

	const series = periods.map((period, periodIndex) => ({
		name: period.name,
		data: period.measures.map((measure) => ({
			x: measure.title,
			y: measure.value,
		})),
		type: "bullet" as const,
		color: getSeriesColor(periodIndex),
	}));

	return {
		title,
		series,
	};
}

/**
 * Validate bullet chart ranges
 */
export function validateBulletRanges(ranges: number[]): {
	valid: boolean;
	message?: string;
	sortedRanges: number[];
} {
	if (ranges.length < 2 || ranges.length > 4) {
		return {
			valid: false,
			message: "Bullet chart should have 2-4 ranges",
			sortedRanges: ranges,
		};
	}

	const sortedRanges = [...ranges].sort((a, b) => a - b);

	// Check for duplicates
	if (new Set(sortedRanges).size !== sortedRanges.length) {
		return {
			valid: false,
			message: "Range values must be unique",
			sortedRanges,
		};
	}

	return {
		valid: true,
		sortedRanges,
	};
}


