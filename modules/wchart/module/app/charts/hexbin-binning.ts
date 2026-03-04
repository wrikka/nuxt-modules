/**
 * Convert Cartesian to hexagonal coordinates
 */
export function cartesianToHex(
	x: number,
	y: number,
	size: number,
): { q: number; r: number } {
	const q = ((2 / 3) * x) / size;
	const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
	return { q: Math.round(q), r: Math.round(r) };
}

/**
 * Convert hexagonal to Cartesian coordinates
 */
export function hexToCartesian(
	q: number,
	r: number,
	size: number,
): { x: number; y: number } {
	const x = size * ((3 / 2) * q);
	const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
	return { x, y };
}

/**
 * Calculate hexagonal bins
 */
export function calculateHexBins(
	points: Array<{ x: number; y: number; value?: number }>,
	binSize: number,
): Array<{
	x: number;
	y: number;
	count: number;
	values: number[];
	points: Array<{ x: number; y: number; value?: number }>;
}> {
	const bins = new Map<
		string,
		{
			x: number;
			y: number;
			count: number;
			values: number[];
			points: Array<{ x: number; y: number; value?: number }>;
		}
	>();

	points.forEach((point) => {
		// Convert to hexagonal coordinates
		const hexCoords = cartesianToHex(point.x, point.y, binSize);
		const key = `${hexCoords.q},${hexCoords.r}`;

		if (!bins.has(key)) {
			// Convert back to Cartesian for display
			const cartCoords = hexToCartesian(hexCoords.q, hexCoords.r, binSize);
			bins.set(key, {
				x: cartCoords.x,
				y: cartCoords.y,
				count: 0,
				values: [],
				points: [],
			});
		}

		const bin = bins.get(key)!;
		bin.count++;
		bin.values.push(point.value || 1);
		bin.points.push(point);
	});

	return Array.from(bins.values());
}


