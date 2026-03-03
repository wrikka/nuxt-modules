/**
 * Calculate alluvial layout
 */
export function calculateAlluvialLayout(
	nodes: Array<{ id: string; name: string; group?: string }>,
	links: Array<{ source: string; target: string; value: number }>,
	containerWidth: number,
	containerHeight: number,
	options: {
		nodeWidth?: number;
		nodePadding?: number;
		align?: "left" | "right" | "center" | "justify";
	} = {},
): {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		value: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		points: Array<{ x: number; y: number }>;
		value: number;
		color?: string;
	}>;
} {
	const { nodeWidth = 20, nodePadding = 8, align = "justify" } = options;

	// Group nodes by their "column" (source vs target)
	const nodeGroups = new Map<
		string,
		Array<{
			id: string;
			name: string;
			group?: string;
			outgoing: number;
			incoming: number;
		}>
	>();

	nodes.forEach((node) => {
		const column = node.group === "source" ? "source" : "target";
		if (!nodeGroups.has(column)) {
			nodeGroups.set(column, []);
		}

		// Calculate flow values
		const outgoing = links
			.filter((l) => l.source === node.id)
			.reduce((sum, l) => sum + l.value, 0);
		const incoming = links
			.filter((l) => l.target === node.id)
			.reduce((sum, l) => sum + l.value, 0);

		nodeGroups.get(column)!.push({
			...node,
			outgoing,
			incoming,
		});
	});

	// Calculate positions
	const columns = Array.from(nodeGroups.keys());
	const columnWidth = containerWidth / columns.length;

	const positionedNodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		value: number;
	}> = [];

	const linkMap = new Map<
		string,
		Array<{ target: string; value: number; sourceY?: number; targetY?: number }>
	>();

	columns.forEach((column, columnIndex) => {
		const columnNodes = nodeGroups.get(column)!;
		const x = columnIndex * columnWidth + (columnWidth - nodeWidth) / 2;

		// Sort nodes by flow value
		columnNodes.sort(
			(a, b) => b.outgoing + b.incoming - (a.outgoing + a.incoming),
		);

		let currentY = nodePadding;

		columnNodes.forEach((node) => {
			const value = Math.max(node.outgoing, node.incoming);
			const height = Math.max(
				10,
				(value / 100) * (containerHeight - 2 * nodePadding),
			); // Scale height

			positionedNodes.push({
				id: node.id,
				name: node.name,
				x,
				y: currentY,
				width: nodeWidth,
				height,
				value,
			});

			currentY += height + nodePadding;
		});
	});

	// Calculate link paths
	const positionedLinks: Array<{
		source: string;
		target: string;
		points: Array<{ x: number; y: number }>;
		value: number;
		color?: string;
	}> = [];

	links.forEach((link) => {
		const sourceNode = positionedNodes.find((n) => n.id === link.source);
		const targetNode = positionedNodes.find((n) => n.id === link.target);

		if (!sourceNode || !targetNode) return;

		// Create smooth curve between source and target
		const sourceX = sourceNode.x + sourceNode.width;
		const sourceY = sourceNode.y + sourceNode.height / 2;
		const targetX = targetNode.x;
		const targetY = targetNode.y + targetNode.height / 2;

		// Control points for bezier curve
		const controlPoint1X = sourceX + (targetX - sourceX) / 3;
		const controlPoint2X = sourceX + (2 * (targetX - sourceX)) / 3;

		const points = [
			{ x: sourceX, y: sourceY },
			{ x: controlPoint1X, y: sourceY },
			{ x: controlPoint2X, y: targetY },
			{ x: targetX, y: targetY },
		];

		positionedLinks.push({
			source: link.source,
			target: link.target,
			points,
			value: link.value,
		});
	});

	return {
		nodes: positionedNodes,
		links: positionedLinks,
	};
}


