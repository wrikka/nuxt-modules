import type { ChartData } from '@/module/app/types/chart-basic';
import type { CollapsibleTreeData } from './collapsible-tree-types';
import {
	calculateTreeLayout,
	calculateTreeLinks,
	calculateTreeBounds,
} from './collapsible-tree-layout';

/**
 * Generate collapsible tree data
 */
export function generateCollapsibleTreeData(
	root: {
		id: string;
		name: string;
		children?: Array<{
			id: string;
			name: string;
			children?: any[];
			value?: number;
		}>;
	},
	options: {
		title?: string;
		layout?: "tree" | "cluster" | "radial";
		nodeSize?: number;
		levelGap?: number;
		siblingGap?: number;
		colorBy?: "level" | "branch" | "value" | "none";
		initialCollapseLevel?: number;
		orientation?: "horizontal" | "vertical";
	} = {},
): CollapsibleTreeData {
	const {
		title,
		layout = "tree",
		nodeSize = 20,
		levelGap = 100,
		siblingGap = 50,
		colorBy = "level",
		initialCollapseLevel = -1,
		orientation = "horizontal",
	} = options;

	// Calculate tree layout
	const nodes = calculateTreeLayout(
		root,
		layout,
		nodeSize,
		levelGap,
		siblingGap,
		colorBy,
		initialCollapseLevel,
		orientation,
	);

	const links = calculateTreeLinks(nodes);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Collapsible Tree",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "collapsibleTree" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.depth));
	const bounds = calculateTreeBounds(nodes);

	return {
		...chartData,
		nodes,
		links,
		layout,
		bounds,
		maxDepth,
	};
}

/**
 * Generate collapsible tree from flat data
 */
export function generateCollapsibleTreeFromFlatData(
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
): CollapsibleTreeData {
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

	return generateCollapsibleTreeData(root, { title });
}


