/**
 * Calculate gauge angle from value
 */
export function calculateGaugeAngle(
	value: number,
	min: number = 0,
	max: number = 100,
	startAngle: number = -90,
	endAngle: number = 90,
): number {
	const normalizedValue = Math.max(min, Math.min(max, value));
	const range = max - min;
	const angleRange = endAngle - startAngle;

	return startAngle + (angleRange * (normalizedValue - min)) / range;
}

/**
 * Calculate gauge percentage
 */
export function calculateGaugePercentage(
	value: number,
	min: number = 0,
	max: number = 100,
): number {
	const range = max - min;
	return range === 0
		? 0
		: Math.max(0, Math.min(100, ((value - min) / range) * 100));
}

/**
 * Normalize gauge value to 0-1 range
 */
export function normalizeGaugeValue(
	value: number,
	min: number = 0,
	max: number = 100,
): number {
	const range = max - min;
	return range === 0 ? 0 : Math.max(0, Math.min(1, (value - min) / range));
}


