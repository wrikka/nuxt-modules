import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate radial positions for tree nodes
 */
export function calculateRadialPositions(
	root: any,
	centerX: number,
	centerY: number,
	radiusIncrement: number,
	startAngle: number,
	endAngle: number,
	sortBy: string,
	colorBy: string,
): {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		angle: number;
		radius: number;
		parent?: string;
		children: string[];
		color?: string;
		size?: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		color?: string;
		width?: number;
	}>;
} {
	const nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		angle: number;
		radius: number;
		parent?: string;
		children: string[];
		color?: string;
		size?: number;
	}> = [];

	const links: Array<{
		source: string;
		target: string;
		color?: string;
		width?: number;
	}> = [];

	// Traverse tree and assign positions
	function traverse(
		node: any,
		level: number,
		angle: number,
		angleRange: number,
		parent?: string,
	): void {
		const radius = level * radiusIncrement;

		// Calculate node size based on subtree
		const subtreeSize = calculateSubtreeSize(node);
		const size = Math.max(4, Math.sqrt(subtreeSize) * 2);

		// Assign color based on strategy
		let color: string;
		switch (colorBy) {
			case "level":
				color = getSeriesColor(level);
				break;
			case "branch":
				color = parent
					? getSeriesColor(
							Math.abs(
								parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
							) % 10,
						)
					: getSeriesColor(0);
				break;
			case "size":
				const intensity = Math.min(subtreeSize / 100, 1);
				color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
				break;
			default:
				color = getSeriesColor(0);
		}

		const nodeObj = {
			id: node.id,
			name: node.name,
			x: centerX + radius * Math.cos(angle),
			y: centerY + radius * Math.sin(angle),
			level,
			angle,
			radius,
			parent,
			children: node.children
				? node.children.map((child: any) => child.id)
				: [],
			color,
			size,
		};

		nodes.push(nodeObj);

		// Create link to parent
		if (parent) {
			links.push({
				source: parent,
				target: node.id,
				color: nodeObj.color,
				width: Math.max(1, Math.sqrt(subtreeSize) / 10),
			});
		}

		// Process children
		if (node.children && node.children.length > 0) {
			// Sort children if requested
			let sortedChildren = node.children;
			if (sortBy === "name") {
				sortedChildren = [...node.children].sort((a: any, b: any) =>
					a.name.localeCompare(b.name),
				);
			} else if (sortBy === "size") {
				sortedChildren = [...node.children].sort(
					(a: any, b: any) => calculateSubtreeSize(b) - calculateSubtreeSize(a),
				);
			}

			const childAngleRange = angleRange / sortedChildren.length;

			sortedChildren.forEach((child: any, index: number) => {
				const childAngle =
					angle - angleRange / 2 + (index + 0.5) * childAngleRange;
				traverse(child, level + 1, childAngle, childAngleRange, node.id);
			});
		}
	}

	traverse(root, 0, (startAngle + endAngle) / 2, endAngle - startAngle);

	return { nodes, links };
}

/**
 * Calculate subtree size (number of nodes in subtree)
 */
export function calculateSubtreeSize(node: any): number {
	let size = 1; // Count current node

	if (node.children) {
		node.children.forEach((child: any) => {
			size += calculateSubtreeSize(child);
		});
	}

	return size;
}

/**
 * Calculate radial tree layout bounds
 */
export function calculateRadialTreeBounds(
	nodes: Array<{ x: number; y: number; size?: number }>,
): {
	center: { x: number; y: number };
	radius: number;
	bounds: { x: number; y: number; width: number; height: number };
} {
	if (nodes.length === 0) {
		return {
			center: { x: 0, y: 0 },
			radius: 0,
			bounds: { x: 0, y: 0, width: 0, height: 0 },
		};
	}

	const xCoords = nodes.map((n) => n.x);
	const yCoords = nodes.map((n) => n.y);

	const minX = Math.min(...xCoords);
	const maxX = Math.max(...xCoords);
	const minY = Math.min(...yCoords);
	const maxY = Math.max(...yCoords);

	const center = {
		x: (minX + maxX) / 2,
		y: (minY + maxY) / 2,
	};

	const radius =
		Math.max(Math.abs(maxX - center.x), Math.abs(maxY - center.y)) +
		(nodes[0]?.size || 0) / 2;

	return {
		center,
		radius,
		bounds: {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY,
		},
	};
}


