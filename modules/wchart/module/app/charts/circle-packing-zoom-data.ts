import type { ChartData } from '@/module/app/types/chart-basic';
import type { CirclePackingZoomData } from './circle-packing-zoom-types';
import { calculateCirclePackingZoomLayout } from './circle-packing-zoom-layout';

/**
 * Generate circle packing zoom data
 */
export function generateCirclePackingZoomData(
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
		colorBy?: "level" | "value" | "branch" | "size";
		initialZoomLevel?: number;
		showLabels?: boolean;
	} = {},
): CirclePackingZoomData {
	const {
		title,
		centerX = 400,
		centerY = 300,
		radius = 200,
		colorBy = "level",
		initialZoomLevel = 0,
		showLabels = true,
	} = options;

	// Calculate circle packing layout
	const allCircles = calculateCirclePackingZoomLayout(
		root,
		centerX,
		centerY,
		radius,
		colorBy,
	);

	// Set visibility based on zoom level
	const circles = allCircles.map((circle) => ({
		...circle,
		visible: circle.level <= initialZoomLevel,
		zoomable: circle.children.length > 0,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Circle Packing Zoom",
				data: circles
					.filter((circle) => circle.visible)
					.map((circle) => ({
						x: circle.x,
						y: circle.y,
						label: showLabels ? circle.name : undefined,
						color: circle.color,
						value: circle.value,
					})),
				type: "circlePackingZoom" as const,
			},
		],
	};

	return {
		...chartData,
		circles,
		center: { x: centerX, y: centerY },
		maxRadius: radius,
		currentZoomLevel: initialZoomLevel,
	};
}

/**
 * Generate circle packing zoom from flat data
 */
export function generateCirclePackingZoomFromFlatData(
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
): CirclePackingZoomData {
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

	return generateCirclePackingZoomData(root, { title });
}


