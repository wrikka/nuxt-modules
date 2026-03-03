import type { ChartData } from '../types/chart-basic';
import { getSeriesColor } from '../utils/chart-utils';

export interface TernaryData extends ChartData {
	points: Array<{
		a: number; // Component A (0-1)
		b: number; // Component B (0-1)
		c: number; // Component C (0-1, calculated as 1-a-b)
		value?: number;
		color?: string;
		label?: string;
		size?: number;
	}>;
	components: {
		a: { name: string; color?: string };
		b: { name: string; color?: string };
		c: { name: string; color?: string };
	};
}

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
	} = {},
): TernaryData {
	const {
		title,
		colorBy = "value",
		valueRange,
		normalize = true,
	} = options;

	// Process and validate points
	const processedPoints = points.map((point, index) => {
		// Calculate component C if not provided
		const c = point.c !== undefined ? point.c : 1 - point.a - point.b;

		// Validate that components sum to 1 (within tolerance)
		const sum = point.a + point.b + c;
		const tolerance = 0.01;

		if (Math.abs(sum - 1) > tolerance) {
			console.warn(
				`Point ${index} components don't sum to 1: ${point.a} + ${point.b} + ${c} = ${sum}`,
			);
		}

		// Normalize if requested
		let normalizedA = point.a;
		let normalizedB = point.b;
		let normalizedC = c;

		if (normalize) {
			const total = point.a + point.b + c;
			if (total > 0) {
				normalizedA = point.a / total;
				normalizedB = point.b / total;
				normalizedC = c / total;
			}
		}

		// Assign color based on strategy
		let color = point.color;
		if (!color) {
			switch (colorBy) {
				case "value":
					if (point.value !== undefined && valueRange) {
						const intensity =
							(point.value - valueRange.min) /
							(valueRange.max - valueRange.min);
						color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
					}
					break;
				case "component":
					// Color based on dominant component
					const maxComponent = Math.max(normalizedA, normalizedB, normalizedC);
					if (maxComponent === normalizedA)
						color = components.a.color || getSeriesColor(0);
					else if (maxComponent === normalizedB)
						color = components.b.color || getSeriesColor(1);
					else color = components.c.color || getSeriesColor(2);
					break;
				default:
					color = getSeriesColor(index);
			}
		}

		return {
			a: normalizedA,
			b: normalizedB,
			c: normalizedC,
			value: point.value,
			color,
			label: point.label,
			size: point.size || 6,
		};
	});

	// Convert to Cartesian coordinates for plotting
	const cartesianPoints = processedPoints.map((point) => {
		// Convert ternary coordinates to Cartesian
		// Using standard ternary plot transformation
		const x = (0.5 * (2 * point.b + point.c)) / (point.a + point.b + point.c);
		const y = ((Math.sqrt(3) / 2) * point.c) / (point.a + point.b + point.c);

		return {
			x,
			y,
			...point,
		};
	});

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Ternary Points",
				data: cartesianPoints.map((point) => ({
					x: point.x,
					y: point.y,
					label: point.label,
					color: point.color,
					size: point.size,
				})),
				type: "ternary" as const,
			},
		],
	};

	return {
		...chartData,
		points: processedPoints,
		components,
	};
}

/**
 * Generate ternary plot from arrays
 */
export function generateTernaryFromArrays(
	aValues: number[],
	bValues: number[],
	cValues?: number[],
	options: {
		title?: string;
		componentNames?: [string, string, string];
		values?: number[];
		colors?: string[];
		labels?: string[];
	} = {},
): TernaryData {
	const {
		componentNames = ["Component A", "Component B", "Component C"],
		values,
		colors,
		labels,
		...otherOptions
	} = options;

	const points = aValues.map((a, index) => ({
		a,
		b: bValues[index]!,
		c: cValues?.[index],
		value: values?.[index],
		color: colors?.[index],
		label: labels?.[index],
	}));

	const components = {
		a: { name: componentNames[0] },
		b: { name: componentNames[1] },
		c: { name: componentNames[2] },
	};

	return generateTernaryData(points, components, otherOptions);
}


