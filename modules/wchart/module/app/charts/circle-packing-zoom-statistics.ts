/**
 * Calculate circle packing zoom statistics
 */
export function calculateCirclePackingZoomStatistics(
	circles: Array<{
		id: string;
		level: number;
		children: string[];
		value: number;
		r: number;
		visible: boolean;
	}>,
): {
	structure: {
		totalCircles: number;
		visibleCircles: number;
		maxDepth: number;
		leafCircles: number;
		internalCircles: number;
		averageBranchingFactor: number;
	};
	geometry: {
		totalArea: number;
		averageCircleArea: number;
		radiusRange: { min: number; max: number; average: number };
		packingEfficiency: number;
	};
	zoom: {
		currentLevel: number;
		zoomableCircles: number;
		visibleLevels: number[];
	};
	hierarchy: {
		valueDistribution: {
			min: number;
			max: number;
			average: number;
			std: number;
		};
		levelDistribution: Array<{
			level: number;
			circles: number;
			totalValue: number;
			averageRadius: number;
		}>;
	};
} {
	const totalCircles = circles.length;
	const visibleCircles = circles.filter((c) => c.visible).length;
	const maxDepth = Math.max(...circles.map((c) => c.level));
	const leafCircles = circles.filter((c) => c.children.length === 0).length;
	const internalCircles = totalCircles - leafCircles;

	const branchingFactors = circles
		.filter((c) => c.children.length > 0)
		.map((c) => c.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	// Geometry statistics
	const circleAreas = circles
		.filter((c) => c.visible)
		.map((c) => Math.PI * c.r * c.r);

	const totalArea = circleAreas.reduce((sum, area) => sum + area, 0);
	const averageCircleArea = visibleCircles > 0 ? totalArea / visibleCircles : 0;

	const radii = circles.filter((c) => c.visible).map((c) => c.r);
	const minRadius = radii.length > 0 ? Math.min(...radii) : 0;
	const maxRadius = radii.length > 0 ? Math.max(...radii) : 0;
	const averageRadius =
		radii.length > 0 ? radii.reduce((sum, r) => sum + r, 0) / radii.length : 0;

	// Simplified packing efficiency
	const packingEfficiency = 0.7; // Placeholder - would need proper calculation

	// Zoom statistics
	const currentLevel = Math.max(
		...circles.filter((c) => c.visible).map((c) => c.level),
	);
	const zoomableCircles = circles.filter((c) => c.children.length > 0).length;
	const visibleLevels = [
		...new Set(circles.filter((c) => c.visible).map((c) => c.level)),
	].sort();

	// Hierarchy statistics
	const values = circles.map((c) => c.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const averageValue = values.reduce((sum, v) => sum + v, 0) / values.length;
	const valueVariance =
		values.reduce((sum, v) => sum + Math.pow(v - averageValue, 2), 0) /
		values.length;
	const valueStd = Math.sqrt(valueVariance);

	const levelDistribution: Array<{
		level: number;
		circles: number;
		totalValue: number;
		averageRadius: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelCircles = circles.filter((c) => c.level === level);
		const levelValue = levelCircles.reduce((sum, c) => sum + c.value, 0);
		const levelRadii = levelCircles.map((c) => c.r);
		const averageRadiusAtLevel =
			levelRadii.length > 0
				? levelRadii.reduce((sum, r) => sum + r, 0) / levelRadii.length
				: 0;

		levelDistribution.push({
			level,
			circles: levelCircles.length,
			totalValue: levelValue,
			averageRadius: averageRadiusAtLevel,
		});
	}

	return {
		structure: {
			totalCircles,
			visibleCircles,
			maxDepth,
			leafCircles,
			internalCircles,
			averageBranchingFactor,
		},
		geometry: {
			totalArea,
			averageCircleArea,
			radiusRange: { min: minRadius, max: maxRadius, average: averageRadius },
			packingEfficiency,
		},
		zoom: {
			currentLevel,
			zoomableCircles,
			visibleLevels,
		},
		hierarchy: {
			valueDistribution: {
				min: minValue,
				max: maxValue,
				average: averageValue,
				std: valueStd,
			},
			levelDistribution,
		},
	};
}


