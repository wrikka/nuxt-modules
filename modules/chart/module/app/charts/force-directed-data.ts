import type { ForceDirectedData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate node size based on sizing mode
 */
function calculateNodeSize(
	nodeSize: "fixed" | "value" | "degree",
	node: any,
	degree: number,
): number {
	let size = node.size || 10;
	switch (nodeSize) {
		case "value":
			size = node.value ? Math.sqrt(node.value) * 2 + 5 : 10;
			break;
		case "degree":
			size = Math.sqrt(degree) * 3 + 5;
			break;
		case "fixed":
		default:
			break;
	}
	return size;
}

/**
 * Calculate node color based on coloring mode
 */
function calculateNodeColor(
	colorBy: string,
	node: any,
	degree: number,
	defaultColorSeed: number,
): string {
	if (node.color) return node.color;
	switch (colorBy) {
		case "group":
			return node.group
				? getSeriesColor(
						node.group.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % 10,
					)
				: getSeriesColor(defaultColorSeed);
		case "value":
			const intensity = node.value ? Math.min(node.value / 100, 1) : 0.5;
			return `hsl(${240 - intensity * 240}, 70%, 50%)`;
		case "degree":
			const degreeIntensity = Math.min(degree / 10, 1);
			return `hsl(${120 - degreeIntensity * 120}, 70%, 50%)`;
		default:
			return getSeriesColor(defaultColorSeed);
	}
}

/**
 * Generate force-directed network data
 */
export function generateForceDirectedData(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}>,
	options: {
		title?: string;
		nodeSize?: "fixed" | "value" | "degree";
		linkWidth?: "fixed" | "value";
		colorBy?: "group" | "value" | "degree" | "none";
		showLabels?: boolean;
		labelSize?: number;
		physics?: {
			repulsion?: number;
			attraction?: number;
			gravity?: number;
			damping?: number;
			maxVelocity?: number;
		};
	} = {},
): ForceDirectedData {
	const {
		title,
		nodeSize = "degree",
		linkWidth = "value",
		colorBy = "group",
		showLabels = true,
		labelSize = 12,
		physics = {},
	} = options;

	// Process nodes
	const processedNodes = nodes.map((node, index) => {
		// Calculate degree for sizing/coloring
		const degree = links.filter(
			(link) => link.source === node.id || link.target === node.id,
		).length;

		const size = calculateNodeSize(nodeSize, node, degree);
		const color = calculateNodeColor(colorBy, node, degree, index);

		return {
			id: node.id,
			name: node.name,
			group: node.group,
			value: node.value,
			color,
			size,
			degree,
		};
	});

	// Process links
	const processedLinks = links.map((link) => {
		let width = 1;

		switch (linkWidth) {
			case "value":
				width = link.value ? Math.sqrt(link.value) + 1 : 1;
				break;
			case "fixed":
			default:
				width = 1;
		}

		return {
			source: link.source,
			target: link.target,
			value: link.value,
			color: link.color || "#999",
			strength: link.strength || 1,
			width,
		};
	});

	return {
		title: title || "Force-Directed Network",
		series: [],
		nodes: processedNodes,
		links: processedLinks,
	};
}

/**
 * Generate force-directed network from adjacency matrix
 */
export function generateForceDirectedFromMatrix(
	nodeNames: string[],
	adjacencyMatrix: number[][],
	options: {
		title?: string;
		nodeGroups?: string[];
		nodeValues?: number[];
		threshold?: number; // Minimum link strength to include
	} = {},
): ForceDirectedData {
	const { nodeGroups, nodeValues, threshold = 0, ...otherOptions } = options;

	const nodes = nodeNames.map((name, index) => ({
		id: name,
		name,
		group: nodeGroups?.[index],
		value: nodeValues?.[index],
		size: undefined,
		color: undefined,
	}));

	const links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}> = [];

	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
			const strength = adjacencyMatrix[i][j];
			if (strength > threshold) {
				links.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value: strength,
					strength,
				});
			}
		}
	}

	return generateForceDirectedData(nodes, links, otherOptions);
}


