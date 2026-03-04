import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Voronoi utilities - Voronoi diagrams for spatial data
 */

export interface VoronoiData extends ChartData {
	points: Array<{
		x: number;
		y: number;
		value?: number;
		color?: string;
		label?: string;
	}>;
	voronoiCells?: Array<{
		site: { x: number; y: number };
		vertices: Array<{ x: number; y: number }>;
		neighbors: Array<{ x: number; y: number }>;
		area: number;
		color?: string;
	}>;
}

/**
 * Generate Voronoi diagram data
 */
export function generateVoronoiData(
	points: Array<{
		x: number;
		y: number;
		value?: number;
		color?: string;
		label?: string;
	}>,
	options: {
		title?: string;
		showCells?: boolean;
		showPoints?: boolean;
		cellOpacity?: number;
		boundary?: { x: number; y: number; width: number; height: number };
		colorBy?: "value" | "density" | "distance" | "none";
		valueRange?: { min: number; max: number };
	} = {},
): VoronoiData {
	const {
		title,
		showCells = true,
		showPoints = true,
		cellOpacity = 0.3,
		boundary = { x: 0, y: 0, width: 800, height: 600 },
		colorBy = "value",
		valueRange,
	} = options;

	// Generate Voronoi cells
	const voronoiCells = showCells
		? calculateVoronoiCells(points, boundary)
		: undefined;

	// Apply coloring based on strategy
	if (voronoiCells && colorBy !== "none") {
		voronoiCells.forEach((cell, index) => {
			let color: string;

			switch (colorBy) {
				case "value":
					const value = points[index]?.value;
					if (value !== undefined && valueRange) {
						const intensity =
							(value - valueRange.min) / (valueRange.max - valueRange.min);
						color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
					} else {
						color = getSeriesColor(index);
					}
					break;
				case "density":
					// Color by cell area (smaller = denser = more intense)
					const densityIntensity = Math.max(0, 1 - cell.area / 50000); // Normalize
					color = `hsl(${240 - densityIntensity * 240}, 70%, 50%)`;
					break;
				case "distance":
					// Color by distance from center
					const centerX = boundary.x + boundary.width / 2;
					const centerY = boundary.y + boundary.height / 2;
					const distance = Math.sqrt(
						Math.pow(cell.site.x - centerX, 2) +
						Math.pow(cell.site.y - centerY, 2),
					);
					const maxDistance = Math.sqrt(
						Math.pow(boundary.width / 2, 2) + Math.pow(boundary.height / 2, 2),
					);
					const distanceIntensity = distance / maxDistance;
					color = `hsl(${240 - distanceIntensity * 240}, 70%, 50%)`;
					break;
				default:
					color = getSeriesColor(index);
			}

			cell.color = color;
		});
	}

	const chartData: ChartData = {
		title,
		series: showPoints
			? [
				{
					name: "Voronoi Points",
					data: points.map((point) => ({
						x: point.x,
						y: point.y,
						label: point.label,
						color: point.color || getSeriesColor(0),
					})),
					type: "voronoi" as const,
				},
			]
			: [],
	};

	return {
		...chartData,
		points,
		voronoiCells,
	};
}

/**
 * Generate Voronoi from arrays
 */
export function generateVoronoiFromArrays(
	xValues: number[],
	yValues: number[],
	options: {
		title?: string;
		values?: number[];
		labels?: string[];
		colors?: string[];
	} = {},
): VoronoiData {
	const { values, labels, colors, ...otherOptions } = options;

	const points = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		value: values?.[index],
		color: colors?.[index],
		label: labels?.[index],
	}));

	return generateVoronoiData(points, otherOptions);
}

/**
 * Calculate Voronoi cells using Fortune's algorithm approximation
 */
function calculateVoronoiCells(
	points: Array<{ x: number; y: number }>,
	boundary: { x: number; y: number; width: number; height: number },
): Array<{
	site: { x: number; y: number };
	vertices: Array<{ x: number; y: number }>;
	neighbors: Array<{ x: number; y: number }>;
	area: number;
	color?: string;
}> {
	// Simplified Voronoi calculation using Delaunay triangulation approximation
	// In a real implementation, you'd use a proper Voronoi library

	const cells: Array<{
		site: { x: number; y: number };
		vertices: Array<{ x: number; y: number }>;
		neighbors: Array<{ x: number; y: number }>;
		area: number;
		color?: string;
	}> = [];

	points.forEach((point, index) => {
		// Find nearest neighbors
		const distances = points
			.map((otherPoint, otherIndex) => ({
				point: otherPoint,
				distance: Math.sqrt(
					Math.pow(point.x - otherPoint.x, 2) +
					Math.pow(point.y - otherPoint.y, 2),
				),
				index: otherIndex,
			}))
			.filter((d) => d.distance > 0)
			.sort((a, b) => a.distance - b.distance);

		const nearestNeighbors = distances.slice(0, Math.min(6, distances.length));

		// Generate approximate Voronoi cell vertices
		const vertices: Array<{ x: number; y: number }> = [];
		const angleStep = (2 * Math.PI) / nearestNeighbors.length;

		nearestNeighbors.forEach((neighbor, neighborIndex) => {
			const angle = angleStep * neighborIndex;
			const midX = (point.x + neighbor.point.x) / 2;
			const midY = (point.y + neighbor.point.y) / 2;

			// Perpendicular bisector
			const dx = neighbor.point.x - point.x;
			const dy = neighbor.point.y - point.y;
			const length = Math.sqrt(dx * dx + dy * dy);

			if (length > 0) {
				const perpX = -dy / length;
				const perpY = dx / length;

				// Extend from midpoint
				const extension = 50; // Arbitrary extension
				const vertexX = midX + perpX * extension;
				const vertexY = midY + perpY * extension;

				vertices.push({ x: vertexX, y: vertexY });
			}
		});

		// Calculate approximate area using polygon area formula
		let area = 0;
		if (vertices.length >= 3) {
			for (let i = 0; i < vertices.length; i++) {
				const j = (i + 1) % vertices.length;
				area += vertices[i].x * vertices[j].y;
				area -= vertices[j].x * vertices[i].y;
			}
			area = Math.abs(area) / 2;
		}

		cells.push({
			site: { x: point.x, y: point.y },
			vertices,
			neighbors: nearestNeighbors.map((n) => n.point),
			area: Math.max(area, 100), // Minimum area
		});
	});

	return cells;
}

/**
 * Generate Voronoi with density-based coloring
 */
export function generateDensityVoronoi(
	points: Array<{ x: number; y: number; value?: number }>,
	options: {
		title?: string;
		bandwidth?: number;
		colorScale?: string[];
	} = {},
): VoronoiData {
	const {
		title,
		bandwidth = 50,
		colorScale = ["#f7fbff", "#08306b"],
	} = options;

	// Calculate kernel density estimate for each point
	const densities = points.map((point) => {
		let density = 0;
		points.forEach((otherPoint) => {
			const distance = Math.sqrt(
				Math.pow(point.x - otherPoint.x, 2) +
				Math.pow(point.y - otherPoint.y, 2),
			);
			const weight = otherPoint.value || 1;
			density += weight * Math.exp(-0.5 * Math.pow(distance / bandwidth, 2));
		});
		return density;
	});

	const minDensity = Math.min(...densities);
	const maxDensity = Math.max(...densities);

	const coloredPoints = points.map((point, index) => {
		const density = densities[index];
		const intensity = (density - minDensity) / (maxDensity - minDensity);
		const colorIndex = Math.floor(intensity * (colorScale.length - 1));
		const color =
			colorScale[Math.max(0, Math.min(colorScale.length - 1, colorIndex))];

		return {
			...point,
			value: density,
			color,
		};
	});

	return generateVoronoiData(coloredPoints, {
		title: title || "Density-based Voronoi",
		colorBy: "value",
		valueRange: { min: minDensity, max: maxDensity },
	});
}

/**
 * Calculate Voronoi statistics
 */
export function calculateVoronoiStatistics(
	points: Array<{ x: number; y: number; value?: number }>,
	voronoiCells?: Array<{
		site: { x: number; y: number };
		vertices: Array<{ x: number; y: number }>;
		area: number;
	}>,
): {
	points: {
		count: number;
		averageDistance: number;
		minDistance: number;
		maxDistance: number;
	};
	cells:
	| {
		count: number;
		averageArea: number;
		totalArea: number;
		areaVariance: number;
	}
	| undefined;
	spatial: {
		centroid: { x: number; y: number };
		boundingBox: { x: number; y: number; width: number; height: number };
		dispersion: number;
	};
} {
	const n = points.length;

	// Calculate pairwise distances
	const distances: number[] = [];
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const distance = Math.sqrt(
				Math.pow(points[i].x - points[j].x, 2) +
				Math.pow(points[i].y - points[j].y, 2),
			);
			distances.push(distance);
		}
	}

	const averageDistance =
		distances.reduce((sum, d) => sum + d, 0) / distances.length;
	const minDistance = Math.min(...distances);
	const maxDistance = Math.max(...distances);

	// Calculate centroid
	const sumX = points.reduce((sum, p) => sum + p.x, 0);
	const sumY = points.reduce((sum, p) => sum + p.y, 0);
	const centroid = { x: sumX / n, y: sumY / n };

	// Calculate bounding box
	const minX = Math.min(...points.map((p) => p.x));
	const maxX = Math.max(...points.map((p) => p.x));
	const minY = Math.min(...points.map((p) => p.y));
	const maxY = Math.max(...points.map((p) => p.y));

	const boundingBox = {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};

	// Calculate dispersion (average distance from centroid)
	const dispersion =
		points.reduce((sum, p) => {
			const distance = Math.sqrt(
				Math.pow(p.x - centroid.x, 2) + Math.pow(p.y - centroid.y, 2),
			);
			return sum + distance;
		}, 0) / n;

	let cellStats = undefined;
	if (voronoiCells) {
		const areas = voronoiCells.map((cell) => cell.area);
		const averageArea = areas.reduce((sum, a) => sum + a, 0) / areas.length;
		const totalArea = areas.reduce((sum, a) => sum + a, 0);
		const areaVariance =
			areas.reduce((sum, a) => sum + Math.pow(a - averageArea, 2), 0) /
			areas.length;

		cellStats = {
			count: voronoiCells.length,
			averageArea,
			totalArea,
			areaVariance,
		};
	}

	return {
		points: {
			count: n,
			averageDistance,
			minDistance,
			maxDistance,
		},
		cells: cellStats,
		spatial: {
			centroid,
			boundingBox,
			dispersion,
		},
	};
}

/**
 * Generate Voronoi with custom boundary
 */
export function generateBoundedVoronoi(
	points: Array<{ x: number; y: number; value?: number }>,
	boundary: { x: number; y: number; width: number; height: number },
	options: {
		title?: string;
		clipToBoundary?: boolean;
	} = {},
): VoronoiData {
	const { title, clipToBoundary = true } = options;

	return generateVoronoiData(points, {
		title: title || "Bounded Voronoi",
		boundary,
		showCells: true,
	});
}


