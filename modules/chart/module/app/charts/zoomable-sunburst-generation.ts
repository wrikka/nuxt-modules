import type { ChartData } from '@/module/app/types/chart-basic';
import type { ZoomableSunburstData } from './zoomable-sunburst-types';
import { calculateSunburstLayout } from './zoomable-sunburst-layout';

/**
 * Generate zoomable sunburst data
 */
export function generateZoomableSunburstData(
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
		centerX?: number;
		centerY?: number;
		radius?: number;
		innerRadius?: number;
		colorBy?: "level" | "value" | "branch" | "parent";
		sortBy?: "value" | "name" | "none";
		showLabels?: boolean;
		labelSize?: number;
	} = {},
): ZoomableSunburstData {
	const {
		title,
		centerX = 400,
		centerY = 300,
		radius = 200,
		innerRadius = 0,
		colorBy = "level",
		sortBy = "value",
		showLabels = true,
		labelSize = 12,
	} = options;

	// Calculate sunburst layout
	const nodes = calculateSunburstLayout(
		root,
		centerX,
		centerY,
		radius,
		innerRadius,
		colorBy,
		sortBy,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Zoomable Sunburst",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: showLabels ? node.name : undefined,
					color: node.color,
					value: node.value,
				})),
				type: "zoomableSunburst" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.depth));

	return {
		...chartData,
		nodes,
		center: { x: centerX, y: centerY },
		maxRadius: radius,
		maxDepth,
		zoomLevel: 1,
		focusedNode: root.id,
	};
}

/**
 * Generate sunburst from flat data
 */
export function generateZoomableSunburstFromFlatData(
	nodes: Array<{
		id: string;
		name: string;
		parent?: string;
		value?: number;
	}>,
	options: {
		title?: string;
		rootId?: string;
	} = {},
): ZoomableSunburstData {
	const { title, rootId } = options;

	// Build tree structure
	const nodeMap = new Map(
		nodes.map((node) => [node.id, { ...node, children: [] as any[] }]),
	);
	let root: any = null;

	nodes.forEach((node) => {
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
		const rootNode = nodes.find((node) => !node.parent);
		if (rootNode) {
			root = nodeMap.get(rootNode.id);
		}
	}

	if (!root) {
		throw new Error("Could not determine root node");
	}

	return generateZoomableSunburstData(root, { title });
}


