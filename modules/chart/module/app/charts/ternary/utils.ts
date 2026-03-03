/**
 * Convert Cartesian to ternary coordinates
 */
export function cartesianToTernary(
	x: number,
	y: number,
): { a: number; b: number; c: number } {
	// Convert from Cartesian back to ternary coordinates
	// This is the inverse of the transformation used in generateTernaryData

	// Assuming the triangle has height sqrt(3)/2 and width 1
	const c = (2 * y) / Math.sqrt(3);
	const b = x - c / 2;
	const a = 1 - b - c;

	return { a, b, c };
}

/**
 * Convert ternary to Cartesian coordinates
 */
export function ternaryToCartesian(
	a: number,
	b: number,
	c: number,
): { x: number; y: number } {
	// Standard ternary to Cartesian transformation
	const x = (0.5 * (2 * b + c)) / (a + b + c);
	const y = ((Math.sqrt(3) / 2) * c) / (a + b + c);

	return { x, y };
}


