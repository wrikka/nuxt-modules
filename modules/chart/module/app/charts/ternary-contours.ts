import { generateTernaryData, type TernaryData } from './ternary-data';

/**
 * Generate ternary plot with contour lines
 */
export function generateTernaryWithContours(
	points: Array<{
		a: number;
		b: number;
		c?: number;
		value: number;
	}>,
	components: {
		a: { name: string };
		b: { name: string };
		c: { name: string };
	},
	options: {
		title?: string;
		contourLevels?: number;
		colorScale?: string[];
	} = {},
): TernaryData {
	const {
		title,
		colorScale = ["#f7fbff", "#08306b"],
	} = options;

	// This is a simplified contour generation
	// In practice, you'd use interpolation algorithms

	const processedPoints = points.map((point) => ({
		a: point.a,
		b: point.b,
		c: point.c !== undefined ? point.c : 1 - point.a - point.b,
		value: point.value,
	}));

	// Assign colors based on value ranges
	const values = processedPoints.map((p) => p.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	const coloredPoints = processedPoints.map((point) => {
		const intensity = (point.value - minValue) / (maxValue - minValue);
		const colorIndex = Math.floor(intensity * (colorScale.length - 1));
		const color =
			colorScale[Math.max(0, Math.min(colorScale.length - 1, colorIndex))];

		return {
			...point,
			color,
		};
	});

	return generateTernaryData(coloredPoints, components, {
		title: title || "Ternary Plot with Contours",
		colorBy: "value",
		valueRange: { min: minValue, max: maxValue },
	});
}


