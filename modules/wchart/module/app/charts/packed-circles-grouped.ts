import type { PackedCirclesData } from '@/module/app/types/chart-basic';

/**
 * Packed circles grouped utilities
 */

/**
 * Generate grouped packed circles
 */
export function generateGroupedPackedCircles(
	groups: Array<{
		name: string;
		circles: Array<{
			name: string;
			value: number;
			color?: string;
		}>;
		color?: string;
	}>,
	options: {
		title?: string;
		groupPadding?: number;
		interGroupSpacing?: number;
	} = {},
): {
	title?: string;
	groups: Array<{
		name: string;
		circles: PackedCirclesData["circles"];
		bounds: { x: number; y: number; width: number; height: number };
		color?: string;
	}>;
} {
	const { title, groupPadding = 10, interGroupSpacing = 20 } = options;

	const processedGroups = groups.map((group, groupIndex) => ({
		name: group.name,
		circles: group.circles.map((circle) => ({
			name: circle.name,
			value: circle.value,
			color: circle.color,
			group: group.name,
		})),
		color: group.color,
		bounds: { x: 0, y: 0, width: 0, height: 0 }, // Will be calculated
	}));

	// This is a simplified grouping - in practice, you'd need more sophisticated
	// algorithms to position groups without overlap

	return {
		title,
		groups: processedGroups,
	};
}


