import { calculateGaugeAngle } from './gauge-calculations';

/**
 * Determine gauge color based on value and thresholds
 */
export function determineGaugeColor(
	value: number,
	thresholds: Array<{ value: number; color: string }> = [],
): string {
	if (thresholds.length === 0) {
		// Default color logic
		if (value >= 80) return "#4CAF50"; // Green
		if (value >= 60) return "#FFC107"; // Yellow
		return "#F44336"; // Red
	}

	// Sort thresholds by value ascending
	const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

	for (const threshold of sortedThresholds) {
		if (value <= threshold.value) {
			return threshold.color;
		}
	}

	// If value is above all thresholds, return the last color
	return sortedThresholds[sortedThresholds.length - 1].color;
}

/**
 * Generate gauge thresholds configuration
 */
export function generateGaugeThresholds(
	min: number = 0,
	max: number = 100,
	levels: number = 3,
): Array<{ value: number; color: string; label: string }> {
	const range = max - min;
	const step = range / levels;

	const colors = ["#F44336", "#FFC107", "#4CAF50"]; // Red, Yellow, Green

	const thresholds: Array<{ value: number; color: string; label: string }> = [];

	for (let i = 1; i <= levels; i++) {
		const value = min + step * i;
		const colorIndex = Math.min(i - 1, colors.length - 1);

		let label = "";
		if (i === 1) label = "Low";
		else if (i === levels) label = "High";
		else label = "Medium";

		thresholds.push({
			value,
			color: colors[colorIndex],
			label,
		});
	}

	return thresholds;
}

/**
 * Calculate gauge arc path
 */
export function calculateGaugeArc(
	value: number,
	centerX: number,
	centerY: number,
	innerRadius: number,
	outerRadius: number,
	min: number = 0,
	max: number = 100,
	startAngle: number = -90,
	endAngle: number = 90,
): string {
	const angle = calculateGaugeAngle(value, min, max, startAngle, endAngle);
	const angleRad = (angle * Math.PI) / 180;

	const x1 = centerX + innerRadius * Math.cos(angleRad);
	const y1 = centerY + innerRadius * Math.sin(angleRad);
	const x2 = centerX + outerRadius * Math.cos(angleRad);
	const y2 = centerY + outerRadius * Math.sin(angleRad);

	// Create arc path
	const largeArcFlag = Math.abs(angle - startAngle) > 180 ? 1 : 0;
	const startAngleRad = (startAngle * Math.PI) / 180;

	const startX1 = centerX + innerRadius * Math.cos(startAngleRad);
	const startY1 = centerY + innerRadius * Math.sin(startAngleRad);
	const startX2 = centerX + outerRadius * Math.cos(startAngleRad);
	const startY2 = centerY + outerRadius * Math.sin(startAngleRad);

	return `M ${startX2} ${startY2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX1} ${startY1} Z`;
}

/**
 * Calculate gauge needle position
 */
export function calculateGaugeNeedlePosition(
	value: number,
	centerX: number,
	centerY: number,
	needleLength: number,
	min: number = 0,
	max: number = 100,
	startAngle: number = -90,
	endAngle: number = 90,
): { x: number; y: number } {
	const angle = calculateGaugeAngle(value, min, max, startAngle, endAngle);
	const angleRad = (angle * Math.PI) / 180;

	return {
		x: centerX + needleLength * Math.cos(angleRad),
		y: centerY + needleLength * Math.sin(angleRad),
	};
}

/**
 * Generate gauge ticks
 */
export function generateGaugeTicks(
	min: number = 0,
	max: number = 100,
	majorTicks: number = 10,
	minorTicks: number = 5,
	startAngle: number = -90,
	endAngle: number = 90,
): Array<{ value: number; angle: number; isMajor: boolean }> {
	const ticks: Array<{ value: number; angle: number; isMajor: boolean }> = [];
	const totalTicks = majorTicks * minorTicks;

	for (let i = 0; i <= totalTicks; i++) {
		const value = min + ((max - min) * i) / totalTicks;
		const angle = calculateGaugeAngle(value, min, max, startAngle, endAngle);
		const isMajor = i % minorTicks === 0;

		ticks.push({
			value,
			angle,
			isMajor,
		});
	}

	return ticks;
}

/**
 * Generate gauge labels
 */
export function generateGaugeLabels(
	min: number = 0,
	max: number = 100,
	count: number = 5,
	startAngle: number = -90,
	endAngle: number = 90,
): Array<{ value: number; angle: number; label: string }> {
	const labels: Array<{ value: number; angle: number; label: string }> = [];
	const step = (max - min) / (count - 1);

	for (let i = 0; i < count; i++) {
		const value = min + step * i;
		const angle = calculateGaugeAngle(value, min, max, startAngle, endAngle);

		labels.push({
			value,
			angle,
			label: Math.round(value).toString(),
		});
	}

	return labels;
}

/**
 * Calculate gauge zones
 */
export function calculateGaugeZones(
	thresholds: Array<{ value: number; color: string; label?: string }>,
	min: number = 0,
	max: number = 100,
	startAngle: number = -90,
	endAngle: number = 90,
): Array<{
	startAngle: number;
	endAngle: number;
	color: string;
	label?: string;
}> {
	const zones: Array<{
		startAngle: number;
		endAngle: number;
		color: string;
		label?: string;
	}> = [];

	// Add zone from min to first threshold
	if (thresholds.length > 0) {
		const firstThreshold = thresholds[0];
		zones.push({
			startAngle,
			endAngle: calculateGaugeAngle(
				firstThreshold.value,
				min,
				max,
				startAngle,
				endAngle,
			),
			color: firstThreshold.color,
			label: firstThreshold.label,
		});
	}

	// Add zones between thresholds
	for (let i = 0; i < thresholds.length - 1; i++) {
		const current = thresholds[i];
		const next = thresholds[i + 1];

		zones.push({
			startAngle: calculateGaugeAngle(
				current.value,
				min,
				max,
				startAngle,
				endAngle,
			),
			endAngle: calculateGaugeAngle(next.value, min, max, startAngle, endAngle),
			color: next.color,
			label: next.label,
		});
	}

	// Add zone from last threshold to max
	if (thresholds.length > 0) {
		const lastThreshold = thresholds[thresholds.length - 1];
		zones.push({
			startAngle: calculateGaugeAngle(
				lastThreshold.value,
				min,
				max,
				startAngle,
				endAngle,
			),
			endAngle,
			color: lastThreshold.color,
			label: lastThreshold.label,
		});
	}

	return zones;
}


