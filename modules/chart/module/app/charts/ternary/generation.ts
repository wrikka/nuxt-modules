import type { TernaryData } from './types';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { ternaryToCartesian } from './utils';

/**
 * Generate ternary plot data
 */
export function generateTernaryData(
	points: Array<{
		a: number;
		b: number;
		c?: number; // Optional, will be calculated as 1-a-b
		value?: number;
		color?: string;
		label?: string;
		size?: number;
	}>,
	components: {
		a: { name: string; color?: string };
		b: { name: string; color?: string };
		c: { name: string; color?: string };
	},
	options: {
		title?: string;
		showGrid?: boolean;
		showLabels?: boolean;
		gridLines?: number;
		colorBy?: "value" | "component" | "none";
		valueRange?: { min: number; max: number };
		normalize?: boolean;
		sizeRange?: { min: number; max: number };
	} = {},
): TernaryData {
	const {
		title,
		showGrid = true,
		showLabels = true,
		gridLines = 10,
		colorBy = "component",
		valueRange,
		normalize = true,
		sizeRange = { min: 3, max: 10 },
	} = options;

	// Validate and normalize points
	const validPoints: Array<{
		a: number;
		b: number;
		c: number;
		value?: number;
		color?: string;
		label?: string;
		size?: number;
	}> = [];

	const invalidPoints: Array<{
		a: number;
		b: number;
		c?: number;
		reason: string;
	}> = [];

	points.forEach((point, index) => {
		let { a, b, c, value, color, label, size } = point;

		// Calculate c if not provided
		if (c === undefined) {
			c = 1 - a - b;
		}

		// Normalize if requested
		if (normalize) {
			const sum = a + b + c;
			if (sum > 0) {
				a /= sum;
				b /= sum;
				c /= sum;
			}
		}

		// Validate composition
		const tolerance = 0.01;
		const sum = a + b + c;
		const isValid =
			a >= 0 && a <= 1 &&
			b >= 0 && b <= 1 &&
			c >= 0 && c <= 1 &&
			Math.abs(sum - 1) < tolerance;

		if (isValid) {
			// Assign color based on colorBy option
			if (colorBy === "component") {
				// Color based on dominant component
				const maxComponent = Math.max(a, b, c);
				if (maxComponent === a) color = components.a.color || getSeriesColor(0);
				else if (maxComponent === b) color = components.b.color || getSeriesColor(1);
				else color = components.c.color || getSeriesColor(2);
			} else if (colorBy === "value" && value !== undefined && valueRange) {
				// Color based on value
				const ratio = (value - valueRange.min) / (valueRange.max - valueRange.min);
				color = `hsl(${240 * (1 - ratio)}, 70%, 50%)`; // Blue to red gradient
			}

			// Assign size based on value if available
			if (value !== undefined && valueRange) {
				const ratio = (value - valueRange.min) / (valueRange.max - valueRange.min);
				size = sizeRange.min + ratio * (sizeRange.max - sizeRange.min);
			} else if (size === undefined) {
				size = sizeRange.min;
			}

			validPoints.push({ a, b, c, value, color, label, size });
		} else {
			invalidPoints.push({ a, b, c, reason: `Invalid composition: a=${a}, b=${b}, c=${c}, sum=${sum}` });
		}
	});

	// Convert to Cartesian coordinates for plotting
	const cartesianPoints = validPoints.map((p) => {
		const { x, y } = ternaryToCartesian(p.a, p.b, p.c);
		return {
			x,
			y,
			value: p.value,
			color: p.color,
			label: p.label,
			size: p.size,
			original: p,
		};
	});

	// Generate grid lines if requested
	const grid: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
	if (showGrid) {
		for (let i = 1; i < gridLines; i++) {
			const ratio = i / gridLines;

			// Horizontal lines (parallel to base)
			const { x: x1, y: y1 } = ternaryToCartesian(0, ratio, 1 - ratio);
			const { x: x2, y: y2 } = ternaryToCartesian(ratio, 0, 1 - ratio);
			grid.push({ x1, y1, x2, y2 });

			// Left slanting lines
			const { x: x3, y: y3 } = ternaryToCartesian(ratio, 1 - ratio, 0);
			const { x: x4, y: y4 } = ternaryToCartesian(0, 1 - ratio, ratio);
			grid.push({ x1: x3, y1: y3, x2: x4, y2: y4 });

			// Right slanting lines
			const { x: x5, y: y5 } = ternaryToCartesian(1 - ratio, 0, ratio);
			const { x: x6, y: y6 } = ternaryToCartesian(ratio, ratio, 1 - 2 * ratio);
			if (ratio <= 0.5) {
				grid.push({ x1: x5, y1: y5, x2: x6, y2: y6 });
			}
		}
	}

	return {
		title,
		series: [
			{
				name: "Ternary Points",
				data: cartesianPoints,
				type: "scatter",
			},
		],
		showGrid,
		showLabels,
		gridLines,
		colorBy,
		valueRange,
		normalize,
		sizeRange,
		points: validPoints,
		components,
		grid,
		invalidPoints,
	};
}

/**
 * Analyze ternary composition data
 */
export function analyzeTernaryComposition(
	data: TernaryData,
): {
	points: {
		count: number;
		validPoints: number;
		invalidPoints: Array<{
			a: number;
			b: number;
			c?: number;
			reason: string;
		}>;
	};
	composition: {
		meanA: number;
		meanB: number;
		meanC: number;
		stdA: number;
		stdB: number;
		stdC: number;
		dominantComponent: "a" | "b" | "c";
	};
	value?: {
		mean: number;
		median: number;
		min: number;
		max: number;
		std: number;
	};
	distribution: {
		centroid: { a: number; b: number; c: number };
		spread: number;
		clusters: number;
	};
} {
	const { points: originalPoints, invalidPoints } = data;
	const n = originalPoints.length;

	if (n === 0) {
		return {
			points: { count: 0, validPoints: 0, invalidPoints },
			composition: { meanA: 0, meanB: 0, meanC: 0, stdA: 0, stdB: 0, stdC: 0, dominantComponent: "a" },
			distribution: { centroid: { a: 0, b: 0, c: 0 }, spread: 0, clusters: 0 },
		};
	}

	const validPoints = originalPoints.filter(p => typeof p.a === 'number' && typeof p.b === 'number' && typeof p.c === 'number');

	// Calculate means
	const meanA = validPoints.reduce((sum, p) => sum + p.a, 0) / validPoints.length;
	const meanB = validPoints.reduce((sum, p) => sum + p.b, 0) / validPoints.length;
	const meanC = validPoints.reduce((sum, p) => sum + p.c, 0) / validPoints.length;

	// Calculate standard deviations
	const varianceA = validPoints.reduce((sum, p) => sum + Math.pow(p.a - meanA, 2), 0) / validPoints.length;
	const varianceB = validPoints.reduce((sum, p) => sum + Math.pow(p.b - meanB, 2), 0) / validPoints.length;
	const varianceC = validPoints.reduce((sum, p) => sum + Math.pow(p.c - meanC, 2), 0) / validPoints.length;
	const stdA = Math.sqrt(varianceA);
	const stdB = Math.sqrt(varianceB);
	const stdC = Math.sqrt(varianceC);

	// Determine dominant component
	const means = { a: meanA, b: meanB, c: meanC };
	const dominantComponent = Object.entries(means).reduce((a, b) => a[1] > b[1] ? a : b)[0] as "a" | "b" | "c";

	// Calculate centroid
	const centroid = { a: meanA, b: meanB, c: meanC };

	// Calculate spread (average distance from centroid)
	const spread = validPoints.reduce((sum, p) => {
		const distance = Math.sqrt(
			Math.pow(p.a - centroid.a, 2) +
			Math.pow(p.b - centroid.b, 2) +
			Math.pow(p.c - centroid.c, 2),
		);
		return sum + distance;
	}, 0) / validPoints.length;

	// Value statistics (if available)
	const pointsWithValues = validPoints.filter(p => p.value !== undefined);
	let valueStats = undefined;

	if (pointsWithValues.length > 0) {
		const values = pointsWithValues.map(p => p.value!);
		const sortedValues = [...values].sort((a, b) => a - b);

		valueStats = {
			mean: values.reduce((sum, v) => sum + v, 0) / values.length,
			median: sortedValues[Math.floor(sortedValues.length / 2)],
			min: sortedValues[0],
			max: sortedValues[sortedValues.length - 1],
			std: Math.sqrt(
				values.reduce((sum, v, _, arr) => {
					const mean = arr.reduce((s, val) => s + val, 0) / arr.length;
					return sum + Math.pow(v - mean, 2);
				}, 0) / values.length,
			),
		};
	}

	// Simplified cluster detection (count of distinct regions)
	const clusters = Math.max(1, Math.floor(validPoints.length / 10));

	return {
		points: {
			count: n,
			validPoints: validPoints.length,
			invalidPoints,
		},
		composition: {
			meanA,
			meanB,
			meanC,
			stdA,
			stdB,
			stdC,
			dominantComponent,
		},
		value: valueStats,
		distribution: {
			centroid,
			spread,
			clusters,
		},
	};
}


