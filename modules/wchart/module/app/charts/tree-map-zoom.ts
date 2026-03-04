import type { ChartData } from '@/module/app/types/chart-basic';
import { calculateTreeMapLayout } from "../utils/tree-map-layout-utils";
import {
	zoomTreeMapToNode,
	resetTreeMapZoom,
} from "../utils/tree-map-zoom-utils";

/**
 * TreeMap Zoom utilities - Zoomable treemaps with drill-down
 */

export interface TreeMapZoomData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
		visible: boolean;
		zoomable: boolean;
	}>;
	currentLevel: number;
	maxDepth: number;
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

/**
 * Generate treemap zoom data
 */
export function generateTreeMapZoomData(
	root: {
		id: string;
		name: string;
		value?: number;
		children?: Array<{
			id: string;
			name: string;
			value?: number;
			children?: any[];
		}>;
	},
	options: {
		title?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		padding?: number;
		colorBy?: "level" | "value" | "branch" | "none";
		algorithm?: "squarify" | "strip" | "slice";
		initialZoomLevel?: number;
	} = {},
): TreeMapZoomData {
	const {
		title,
		x = 0,
		y = 0,
		width = 800,
		height = 400,
		padding = 1,
		colorBy = "level",
		algorithm = "squarify",
		initialZoomLevel = 0,
	} = options;

	// Calculate treemap layout
	const allNodes = calculateTreeMapLayout(
		root,
		x,
		y,
		width,
		height,
		padding,
		colorBy,
		algorithm,
	);

	// Set visibility based on zoom level
	const nodes = allNodes.map((node) => ({
		...node,
		visible: node.level <= initialZoomLevel,
		zoomable: node.children.length > 0,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "TreeMap Zoom",
				data: nodes
					.filter((node) => node.visible)
					.map((node) => ({
						x: node.x,
						y: node.y,
						label: node.name,
						color: node.color,
						value: node.value,
					})),
				type: "treeMapZoom" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const bounds = { x, y, width, height };

	return {
		...chartData,
		nodes,
		currentLevel: initialZoomLevel,
		maxDepth,
		bounds,
	};
}

/**
    value?: number;
  }>,
  options: {
    title?: string;
    rootId?: string;
  } = {}
): TreeMapZoomData {
  const { title, rootId } = options;

  // Build tree structure
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] as any[] }]));
  let root: any = null;

  nodes.forEach(node => {
    if (node.parent) {
      const parent = nodeMap.get(node.parent);
      if (parent) {
        parent.children.push(nodeMap.get(node.id));
      }
    } else if (!rootId || node.id === rootId) {
      root = nodeMap.get(node.id);
    }
  });

  if (!root && nodes.length > 0) {
    const rootNode = nodes.find(node => !node.parent);
    if (rootNode) {
      root = nodeMap.get(rootNode.id);
    }
  }

  if (!root) {
    throw new Error('Could not determine root node');
  }

  return generateTreeMapZoomData(root, { title });
}

/**
 * Calculate treemap zoom statistics
 */
export function calculateTreeMapZoomStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		value: number;
		visible: boolean;
		width: number;
		height: number;
	}>,
): {
	structure: {
		totalNodes: number;
		visibleNodes: number;
		maxDepth: number;
		leafNodes: number;
		internalNodes: number;
		averageBranchingFactor: number;
	};
	layout: {
		totalArea: number;
		averageNodeArea: number;
		packingEfficiency: number;
		aspectRatioDistribution: {
			min: number;
			max: number;
			average: number;
		};
	};
	zoom: {
		currentLevel: number;
		zoomableNodes: number;
		visibleLevels: number[];
	};
} {
	const totalNodes = nodes.length;
	const visibleNodes = nodes.filter((n) => n.visible).length;
	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const leafNodes = nodes.filter((n) => n.children.length === 0).length;
	const internalNodes = totalNodes - leafNodes;

	const branchingFactors = nodes
		.filter((n) => n.children.length > 0)
		.map((n) => n.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	const visibleNodeAreas = nodes
		.filter((n) => n.visible)
		.map((n) => n.width * n.height);

	const totalArea = visibleNodeAreas.reduce((sum, area) => sum + area, 0);
	const averageNodeArea = visibleNodes > 0 ? totalArea / visibleNodes : 0;
	const packingEfficiency = totalArea > 0 ? totalArea / (800 * 400) : 0; // Assuming 800x400 bounds

	const aspectRatios = nodes
		.filter((n) => n.visible && n.width > 0 && n.height > 0)
		.map((n) => n.width / n.height);

	const minAspectRatio =
		aspectRatios.length > 0 ? Math.min(...aspectRatios) : 0;
	const maxAspectRatio =
		aspectRatios.length > 0 ? Math.max(...aspectRatios) : 0;
	const averageAspectRatio =
		aspectRatios.length > 0
			? aspectRatios.reduce((sum, ar) => sum + ar, 0) / aspectRatios.length
			: 0;

	// Assuming current level from visible nodes
	const currentLevel = Math.max(
		...nodes.filter((n) => n.visible).map((n) => n.level),
	);
	const zoomableNodes = nodes.filter((n) => n.children.length > 0).length;
	const visibleLevels = [
		...new Set(nodes.filter((n) => n.visible).map((n) => n.level)),
	].sort();

	return {
		structure: {
			totalNodes,
			visibleNodes,
			maxDepth,
			leafNodes,
			internalNodes,
			averageBranchingFactor,
		},
		layout: {
			totalArea,
			averageNodeArea,
			packingEfficiency,
			aspectRatioDistribution: {
				min: minAspectRatio,
				max: maxAspectRatio,
				average: averageAspectRatio,
			},
		},
		zoom: {
			currentLevel,
			zoomableNodes,
			visibleLevels,
		},
	};
}


