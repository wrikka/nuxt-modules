import type { CirclePackingData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Process hierarchy recursively
 */
export function processHierarchy(
	hierarchy: Array<{
		name: string;
		value?: number;
		children?: CirclePackingData["hierarchy"];
		color?: string;
	}>,
	sortBy: "value" | "name" | "none",
	colorScheme?: string[],
	depth: number = 0,
	maxDepth?: number,
): CirclePackingData["hierarchy"] {
	if (maxDepth !== undefined && depth > maxDepth) {
		return [];
	}

	let processed = hierarchy.map((item, index) => ({
		name: item.name,
		value: item.value,
		color:
			item.color ||
			(colorScheme
				? colorScheme[index % colorScheme.length]
				: getSeriesColor(index)),
		children: item.children
			? processHierarchy(
					item.children,
					sortBy,
					colorScheme,
					depth + 1,
					maxDepth,
				)
			: undefined,
	}));

	// Sort if requested
	if (sortBy !== "none") {
		processed.sort((a, b) => {
			if (sortBy === "value") {
				const aVal =
					a.value || (a.children ? calculateHierarchyValue(a.children) : 0);
				const bVal =
					b.value || (b.children ? calculateHierarchyValue(b.children) : 0);
				return bVal - aVal;
			} else {
				return a.name.localeCompare(b.name);
			}
		});
	}

	return processed;
}

/**
 * Calculate total value of hierarchy
 */
export function calculateHierarchyValue(
	hierarchy: CirclePackingData["hierarchy"],
): number {
	return hierarchy.reduce((sum, item) => {
		const itemValue =
			item.value ||
			(item.children ? calculateHierarchyValue(item.children) : 0);
		return sum + itemValue;
	}, 0);
}

/**
 * Calculate circle packing layout (simplified pack layout)
 */
export function calculateCirclePackingLayout(
	hierarchy: CirclePackingData["hierarchy"],
	containerWidth: number,
	containerHeight: number,
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
	depth: number;
	color?: string;
	children?: any[];
}> {
	const circles: Array<{
		name: string;
		x: number;
		y: number;
		r: number;
		value: number;
		depth: number;
		color?: string;
		children?: any[];
	}> = [];

	const centerX = containerWidth / 2;
	const centerY = containerHeight / 2;

	// Calculate total value for root circle
	const totalValue = calculateHierarchyValue(hierarchy);
	const rootRadius = Math.min(containerWidth, containerHeight) / 2;

	circles.push({
		name: "root",
		x: centerX,
		y: centerY,
		r: rootRadius,
		value: totalValue,
		depth: 0,
	});

	// Pack child circles
	packCircles(hierarchy, centerX, centerY, rootRadius, 1, circles);

	return circles;
}

/**
 * Pack circles recursively
 */
export function packCircles(
	hierarchy: CirclePackingData["hierarchy"],
	parentX: number,
	parentY: number,
	parentRadius: number,
	depth: number,
	circles: Array<{
		name: string;
		x: number;
		y: number;
		r: number;
		value: number;
		depth: number;
		color?: string;
		children?: any[];
	}>,
): void {
	if (hierarchy.length === 0) return;

	const totalValue = calculateHierarchyValue(hierarchy);
	const childCircles: Array<{
		name: string;
		value: number;
		r: number;
		color?: string;
		children?: CirclePackingData["hierarchy"];
	}> = [];

	// Calculate radii for child circles
	hierarchy.forEach((item) => {
		const value =
			item.value ||
			(item.children ? calculateHierarchyValue(item.children) : 0);
		const radius = parentRadius * Math.sqrt(value / totalValue) * 0.9; // 0.9 for padding

		childCircles.push({
			name: item.name,
			value,
			r: radius,
			color: item.color,
			children: item.children,
		});
	});

	// Position child circles using simplified circle packing
	const positions = packCirclesInCircle(
		childCircles,
		parentX,
		parentY,
		parentRadius * 0.8,
	);

	positions.forEach((pos, index) => {
		const item = hierarchy[index];
		circles.push({
			name: pos.name,
			x: pos.x,
			y: pos.y,
			r: pos.r,
			value: pos.value,
			depth,
			color: pos.color,
		});

		// Recursively pack children
		if (item.children && item.children.length > 0) {
			packCircles(item.children, pos.x, pos.y, pos.r, depth + 1, circles);
		}
	});
}

/**
 * Pack circles within a circle (simplified algorithm)
 */
export function packCirclesInCircle(
	circles: Array<{
		name: string;
		value: number;
		r: number;
		color?: string;
		children?: CirclePackingData["hierarchy"];
	}>,
	centerX: number,
	centerY: number,
	maxRadius: number,
): Array<{
	name: string;
	x: number;
	y: number;
	r: number;
	value: number;
	color?: string;
	children?: CirclePackingData["hierarchy"];
}> {
	const positioned: Array<{
		name: string;
		x: number;
		y: number;
		r: number;
		value: number;
		color?: string;
		children?: CirclePackingData["hierarchy"];
	}> = [];

	// Sort by size (largest first)
	const sorted = [...circles].sort((a, b) => b.r - a.r);

	sorted.forEach((circle) => {
		let placed = false;
		let attempts = 0;
		const maxAttempts = 50;

		while (!placed && attempts < maxAttempts) {
			// Try random position within the circle
			const angle = Math.random() * 2 * Math.PI;
			const distance = Math.random() * (maxRadius - circle.r);

			const x = centerX + distance * Math.cos(angle);
			const y = centerY + distance * Math.sin(angle);

			// Check if it fits without overlapping existing circles
			let overlaps = false;
			for (const existing of positioned) {
				const dx = x - existing.x;
				const dy = y - existing.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const minDistance = circle.r + existing.r + 2; // padding

				if (distance < minDistance) {
					overlaps = true;
					break;
				}
			}

			if (!overlaps) {
				positioned.push({
					name: circle.name,
					x,
					y,
					r: circle.r,
					value: circle.value,
					color: circle.color,
					children: circle.children,
				});
				placed = true;
			}

			attempts++;
		}

		// If couldn't place, put it at center (will overlap but better than nothing)
		if (!placed) {
			positioned.push({
				name: circle.name,
				x: centerX,
				y: centerY,
				r: circle.r,
				value: circle.value,
				color: circle.color,
				children: circle.children,
			});
		}
	});

	return positioned;
}


