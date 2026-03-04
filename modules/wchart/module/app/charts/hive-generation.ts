import type { ChartData } from '@/module/app/types/chart-basic';
import type { HiveData } from './hive-types';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate hive plot data
 */
export function generateHiveData(
	axes: Array<{
		name: string;
		values: Array<{
			id: string;
			value: number;
			color?: string;
			size?: number;
		}>;
	}>,
	links: Array<{
		sourceAxis: string;
		sourceId: string;
		targetAxis: string;
		targetId: string;
		value?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		radius?: number;
		innerRadius?: number;
		showLinks?: boolean;
		linkOpacity?: number;
		normalizeValues?: boolean;
		colorBy?: "axis" | "value" | "group" | "none";
		valueRange?: { min: number; max: number };
	} = {},
): HiveData {
	const {
		title,
		radius = 200,
		innerRadius = 20,
		showLinks = true,
		linkOpacity = 0.3,
		normalizeValues = true,
		colorBy = "axis",
		valueRange,
	} = options;

	// Calculate angles for axes
	const angleStep = (2 * Math.PI) / axes.length;
	const processedAxes = axes.map((axis, index) => {
		const angle = index * angleStep;

		// Process values
		let processedValues = axis.values;
		if (normalizeValues) {
			const allValues = axes.flatMap((a) => a.values.map((v) => v.value));
			const globalMin = Math.min(...allValues);
			const globalMax = Math.max(...allValues);

			processedValues = axis.values.map((value) => ({
				...value,
				value: (value.value - globalMin) / (globalMax - globalMin),
			}));
		}

		// Assign colors
		const coloredValues = processedValues.map((value, valueIndex) => {
			let color = value.color;

			if (!color) {
				switch (colorBy) {
					case "axis":
						color = getSeriesColor(index);
						break;
					case "value":
						if (valueRange) {
							const intensity =
								(value.value - valueRange.min) /
								(valueRange.max - valueRange.min);
							color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
						}
						break;
					case "group":
						// Simplified grouping - could be enhanced
						color = getSeriesColor(valueIndex % 10);
						break;
					default:
						color = getSeriesColor(valueIndex);
				}
			}

			return {
				...value,
				color,
			};
		});

		return {
			name: axis.name,
			angle,
			values: coloredValues,
		};
	});

	// Process links
	const processedLinks = showLinks
		? links.map((link) => ({
				source: { axis: link.sourceAxis, id: link.sourceId },
				target: { axis: link.targetAxis, id: link.targetId },
				value: link.value,
				color: link.color || "#999",
				strength: link.value || 1,
			}))
		: [];

	const chartData: ChartData = {
		title,
		series: processedAxes.flatMap((axis) =>
			axis.values.map((value) => ({
				name: `${axis.name}-${value.id}`,
				data: [
					{
						x: axis.angle,
						y: value.value,
						label: value.id,
						color: value.color,
						size: value.size || 4,
					},
				],
				type: "hive" as const,
			})),
		),
	};

	return {
		...chartData,
		axes: processedAxes,
		links: processedLinks,
	};
}

/**
 * Generate hive plot from matrix data
 */
export function generateHiveFromMatrix(
	axisNames: string[],
	dataMatrix: number[][],
	ids: string[],
	options: {
		title?: string;
		linkThreshold?: number;
	} = {},
): HiveData {
	const { title, linkThreshold = 0 } = options;

	const axes = axisNames.map((name, index) => ({
		name,
		values: ids.map((id, idIndex) => ({
			id,
			value: dataMatrix[index][idIndex],
			color: undefined,
			size: undefined,
		})),
	}));

	// Generate links based on matrix relationships
	const links: Array<{
		sourceAxis: string;
		sourceId: string;
		targetAxis: string;
		targetId: string;
		value?: number;
	}> = [];

	for (let i = 0; i < axisNames.length; i++) {
		for (let j = i + 1; j < axisNames.length; j++) {
			for (let k = 0; k < ids.length; k++) {
				const value1 = dataMatrix[i][k];
				const value2 = dataMatrix[j][k];

				if (value1 > linkThreshold && value2 > linkThreshold) {
					links.push({
						sourceAxis: axisNames[i],
						sourceId: ids[k],
						targetAxis: axisNames[j],
						targetId: ids[k],
						value: Math.min(value1, value2),
					});
				}
			}
		}
	}

	return generateHiveData(axes, links, { title });
}

/**
 * Generate hive plot for network analysis
 */
export function generateNetworkHive(
	nodes: Array<{
		id: string;
		attributes: Record<string, number>;
		color?: string;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
	}>,
	attributeNames: string[],
	options: {
		title?: string;
		sortBy?: "degree" | "centrality" | "name";
	} = {},
): HiveData {
	const { title, sortBy = "degree" } = options;

	// Calculate node degrees
	const degrees = new Map<string, number>();
	links.forEach((link) => {
		degrees.set(link.source, (degrees.get(link.source) || 0) + 1);
		degrees.set(link.target, (degrees.get(link.target) || 0) + 1);
	});

	// Sort attributes based on strategy
	let sortedAttributeNames = attributeNames;
	if (sortBy === "degree") {
		// Sort by average degree correlation
		sortedAttributeNames = attributeNames.sort((a, b) => {
			const avgA =
				nodes.reduce(
					(sum, node) => sum + (degrees.get(node.id) || 0) * node.attributes[a],
					0,
				) / nodes.length;
			const avgB =
				nodes.reduce(
					(sum, node) => sum + (degrees.get(node.id) || 0) * node.attributes[b],
					0,
				) / nodes.length;
			return avgB - avgA;
		});
	}

	// Create axes from attributes
	const axes = sortedAttributeNames.map((attrName, index) => ({
		name: attrName,
		values: nodes.map((node) => ({
			id: node.id,
			value: node.attributes[attrName] || 0,
			color: node.color,
			size: Math.sqrt((degrees.get(node.id) || 0) + 1) * 2,
		})),
	}));

	// Create links from network connections
	const processedLinks = links.map((link) => ({
		sourceAxis: attributeNames[0], // Could be enhanced to find best axis
		sourceId: link.source,
		targetAxis: attributeNames[1],
		targetId: link.target,
		value: link.value,
	}));

	return generateHiveData(axes, processedLinks, { title });
}


