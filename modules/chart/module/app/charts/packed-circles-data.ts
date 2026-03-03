import type { PackedCirclesData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Packed circles data generation utilities
 */

/**
 * Generate packed circles data
 */
export function generatePackedCirclesData(
	circles: Array<{
		name: string;
		value: number;
		color?: string;
		group?: string;
	}>,
	options: {
		title?: string;
		padding?: number;
		sortBy?: "value" | "name" | "group" | "none";
		colorBy?: "group" | "value" | "none";
		colorScheme?: string[];
		minRadius?: number;
		maxRadius?: number;
	} = {},
): PackedCirclesData {
	const {
		title,
		padding = 2,
		sortBy = "value",
		colorBy = "value",
		colorScheme,
		minRadius = 5,
		maxRadius = 50,
	} = options;

	// Sort circles if requested
	let sortedCircles = circles;
	if (sortBy !== "none") {
		sortedCircles = [...circles].sort((a, b) => {
			switch (sortBy) {
				case "value":
					return b.value - a.value;
				case "name":
					return a.name.localeCompare(b.name);
				case "group":
					return (a.group || "").localeCompare(b.group || "");
				default:
					return 0;
			}
		});
	}

	// Assign colors based on strategy
	const processedCircles = sortedCircles.map((circle, index) => {
		let color = circle.color;

		if (!color) {
			switch (colorBy) {
				case "group":
					if (circle.group) {
						// Simple hash for group colors
						const hash = circle.group.split("").reduce((a, b) => {
							a = (a << 5) - a + b.charCodeAt(0);
							return a & a;
						}, 0);
						color = colorScheme
							? colorScheme[Math.abs(hash) % colorScheme.length]
							: getSeriesColor(Math.abs(hash) % 10);
					} else {
						color = getSeriesColor(index);
					}
					break;
				case "value":
					// Color by value intensity
					const intensity =
						(circle.value - Math.min(...circles.map((c) => c.value))) /
						(Math.max(...circles.map((c) => c.value)) -
							Math.min(...circles.map((c) => c.value)));
					color = `hsl(${240 - intensity * 240}, 70%, 50%)`; // Blue to red gradient
					break;
				default:
					color = getSeriesColor(index);
			}
		}

		return {
			name: circle.name,
			value: circle.value,
			color,
			group: circle.group,
		};
	});

	return {
		title: title || "Packed Circles",
		circles: processedCircles,
	};
}

/**
 * Generate packed circles from arrays
 */
export function generatePackedCirclesFromArrays(
	names: string[],
	values: number[],
	options: {
		title?: string;
		groups?: string[];
		colors?: string[];
	} = {},
): PackedCirclesData {
	const { groups, colors, ...otherOptions } = options;

	const circles = names.map((name, index) => ({
		name,
		value: values[index],
		color: colors?.[index],
		group: groups?.[index],
	}));

	return generatePackedCirclesData(circles, otherOptions);
}


