/**
 * Calculate treemap layout using squarified algorithm
 */
export function calculateTreemapLayout(
	data: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
): Array<{
	name: string;
	value: number;
	x: number;
	y: number;
	width: number;
	height: number;
}> {
	const totalValue = data.reduce((sum, item) => sum + item.value, 0);
	const sortedData = [...data].sort((a, b) => b.value - a.value);

	const result: Array<{
		name: string;
		value: number;
		x: number;
		y: number;
		width: number;
		height: number;
	}> = [];

	let x = 0;
	let y = 0;
	let width = containerWidth;
	let height = containerHeight;

	function squarify(children: typeof sortedData, w: number, h: number): void {
		if (children.length === 0) return;

		const total = children.reduce((sum, child) => sum + child.value, 0);

		if (w >= h) {
			// Split vertically
			const currentWidth = (total / totalValue) * w;
			let currentY = y;

			children.forEach((child) => {
				const childHeight = (child.value / total) * h;
				result.push({
					name: child.name,
					value: child.value,
					x,
					y: currentY,
					width: currentWidth,
					height: childHeight,
				});
				currentY += childHeight;
			});

			x += currentWidth;
			width -= currentWidth;
		} else {
			// Split horizontally
			const currentHeight = (total / totalValue) * h;
			let currentX = x;

			children.forEach((child) => {
				const childWidth = (child.value / total) * w;
				result.push({
					name: child.name,
					value: child.value,
					x: currentX,
					y,
					width: childWidth,
					height: currentHeight,
				});
				currentX += childWidth;
			});

			y += currentHeight;
			height -= currentHeight;
		}
	}

	squarify(sortedData, width, height);

	return result;
}

/**
 * Calculate treemap aspect ratios to optimize layout
 */
export function calculateTreemapAspectRatios(
	layout: Array<{ width: number; height: number }>,
): number[] {
	return layout.map((rect) => {
		const ratio = rect.width / rect.height;
		return ratio > 1 ? ratio : 1 / ratio;
	});
}

/**
 * Optimize treemap layout by adjusting the order of items
 */
export function optimizeTreemapLayout(
	data: Array<{ name: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
): Array<{
	name: string;
	value: number;
	x: number;
	y: number;
	width: number;
	height: number;
}> {
	// Try different sorting orders to find the best aspect ratios
	const orders = [
		(a: any, b: any) => b.value - a.value, // Largest first
		(a: any, b: any) => a.value - b.value, // Smallest first
		(a: any, b: any) => a.name.localeCompare(b.name), // Alphabetical
	];

	let bestLayout: any[] = [];
	let bestScore = Infinity;

	orders.forEach((orderFunc) => {
		const sortedData = [...data].sort(orderFunc);
		const layout = calculateTreemapLayout(
			sortedData,
			containerWidth,
			containerHeight,
		);
		const aspectRatios = calculateTreemapAspectRatios(layout);
		const score = aspectRatios.reduce(
			(sum, ratio) => sum + Math.pow(ratio - 1, 2),
			0,
		);

		if (score < bestScore) {
			bestScore = score;
			bestLayout = layout;
		}
	});

	return bestLayout;
}


