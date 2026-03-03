import {
	forceDirectedPacking,
	spiralPacking,
	gridPacking,
} from './packed-circles-algorithms';

/**
 * Packed circles layout calculation utilities
 */

/**
 * Calculate packed circles layout
 */
export function calculatePackedCirclesLayout(
	circles: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
	options: {
		padding?: number;
		minRadius?: number;
		maxRadius?: number;
		maxIterations?: number;
	} = {},
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
	collisions: number;
}> {
	const {
		padding = 2,
		minRadius = 5,
		maxRadius = 50,
		maxIterations = 1000,
	} = options;

	// Calculate radii based on values
	const values = circles.map((c) => c.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	const scaledCircles = circles.map((circle) => {
		let radius: number;
		if (minValue === maxValue) {
			radius = (minRadius + maxRadius) / 2;
		} else {
			radius =
				minRadius +
				((circle.value - minValue) / (maxValue - minValue)) *
					(maxRadius - minRadius);
		}

		return {
			name: circle.name,
			value: circle.value,
			r: radius,
			x: Math.random() * (containerWidth - 2 * radius) + radius,
			y: Math.random() * (containerHeight - 2 * radius) + radius,
			vx: 0,
			vy: 0,
			collisions: 0,
		};
	});

	// Pack circles using force-directed algorithm
	const packed = forceDirectedPacking(
		scaledCircles,
		containerWidth,
		containerHeight,
		padding,
		maxIterations,
	);

	return packed.map(
		(circle: {
			name: string;
			value: number;
			r: number;
			x: number;
			y: number;
			vx: number;
			vy: number;
			collisions: number;
		}) => ({
			name: circle.name,
			x: circle.x,
			y: circle.y,
			r: circle.r,
			value: circle.value,
			collisions: circle.collisions,
		}),
	);
}

/**
 * Optimize circle packing for better layout
 */
export function optimizeCirclePacking(
	circles: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
	options: {
		strategy?: "force" | "spiral" | "grid";
		maxIterations?: number;
	} = {},
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
}> {
	const { strategy = "force", maxIterations = 500 } = options;

	switch (strategy) {
		case "force":
			return calculatePackedCirclesLayout(
				circles,
				containerWidth,
				containerHeight,
				{ maxIterations },
			);

		case "spiral":
			return spiralPacking(circles, containerWidth, containerHeight);

		case "grid":
			return gridPacking(circles, containerWidth, containerHeight);

		default:
			return calculatePackedCirclesLayout(
				circles,
				containerWidth,
				containerHeight,
			);
	}
}


