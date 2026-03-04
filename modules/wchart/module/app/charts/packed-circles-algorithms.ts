/**
 * Packed circles packing algorithms
 */

/**
 * Force-directed circle packing algorithm
 */
export function forceDirectedPacking(
	circles: Array<{
		name: string;
		value: number;
		r: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
		collisions: number;
	}>,
	containerWidth: number,
	containerHeight: number,
	padding: number,
	maxIterations: number,
): Array<{
	name: string;
	value: number;
	r: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	collisions: number;
}> {
	const circlesCopy = circles.map((c) => ({ ...c }));

	for (let iteration = 0; iteration < maxIterations; iteration++) {
		let totalMovement = 0;

		// Reset velocities
		circlesCopy.forEach((circle) => {
			circle.vx = 0;
			circle.vy = 0;
		});

		// Calculate forces between circles
		for (let i = 0; i < circlesCopy.length; i++) {
			for (let j = i + 1; j < circlesCopy.length; j++) {
				const c1 = circlesCopy[i];
				const c2 = circlesCopy[j];

				const dx = c2.x - c1.x;
				const dy = c2.y - c1.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const minDistance = c1.r + c2.r + padding;

				if (distance < minDistance && distance > 0) {
					// Circles are overlapping
					const overlap = minDistance - distance;
					const force = overlap * 0.1; // Force strength

					const forceX = (dx / distance) * force;
					const forceY = (dy / distance) * force;

					c1.vx -= forceX;
					c1.vy -= forceY;
					c2.vx += forceX;
					c2.vy += forceY;

					c1.collisions++;
					c2.collisions++;
				}
			}
		}

		// Apply container boundaries
		circlesCopy.forEach((circle) => {
			const leftBound = circle.r + padding;
			const rightBound = containerWidth - circle.r - padding;
			const topBound = circle.r + padding;
			const bottomBound = containerHeight - circle.r - padding;

			if (circle.x < leftBound) {
				circle.vx += (leftBound - circle.x) * 0.1;
			} else if (circle.x > rightBound) {
				circle.vx += (rightBound - circle.x) * 0.1;
			}

			if (circle.y < topBound) {
				circle.vy += (topBound - circle.y) * 0.1;
			} else if (circle.y > bottomBound) {
				circle.vy += (bottomBound - circle.y) * 0.1;
			}
		});

		// Update positions
		circlesCopy.forEach((circle) => {
			const movement = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
			totalMovement += movement;

			circle.x += circle.vx;
			circle.y += circle.vy;

			// Dampen velocities
			circle.vx *= 0.9;
			circle.vy *= 0.9;
		});

		// Early stopping if movement is small
		if (totalMovement < 0.1) {
			break;
		}
	}

	return circlesCopy;
}

/**
 * Spiral packing algorithm
 */
export function spiralPacking(
	circles: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
}> {
	// Simplified spiral packing
	const centerX = containerWidth / 2;
	const centerY = containerHeight / 2;

	const values = circles.map((c) => c.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	return circles.map((circle, index) => {
		const radius = 5 + ((circle.value - minValue) / (maxValue - minValue)) * 20;
		const angle = index * 0.5; // Spiral angle
		const distance = 10 + index * 5; // Distance from center

		return {
			name: circle.name,
			x: centerX + distance * Math.cos(angle),
			y: centerY + distance * Math.sin(angle),
			r: radius,
			value: circle.value,
		};
	});
}

/**
 * Grid packing algorithm
 */
export function gridPacking(
	circles: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
}> {
	const sortedCircles = [...circles].sort((a, b) => b.value - a.value);
	const cols = Math.ceil(Math.sqrt(sortedCircles.length));
	const rows = Math.ceil(sortedCircles.length / cols);

	const cellWidth = containerWidth / cols;
	const cellHeight = containerHeight / rows;

	return sortedCircles.map((circle, index) => {
		const col = index % cols;
		const row = Math.floor(index / cols);

		const values = circles.map((c) => c.value);
		const minValue = Math.min(...values);
		const maxValue = Math.max(...values);
		const radius =
			5 +
			(((circle.value - minValue) / (maxValue - minValue)) *
				Math.min(cellWidth, cellHeight)) /
				4;

		return {
			name: circle.name,
			x: col * cellWidth + cellWidth / 2,
			y: row * cellHeight + cellHeight / 2,
			r: radius,
			value: circle.value,
		};
	});
}


