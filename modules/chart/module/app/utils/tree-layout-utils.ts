/**
 * Position nodes in tree layout
 */
export function positionTreeLayout(
	nodes: Array<{
		id: string;
		level: number;
		parent?: string;
		children: string[];
		x: number;
		y: number;
	}>,
	orientation: "horizontal" | "vertical",
	levelGap: number,
	siblingGap: number,
): void {
	const levelNodes = new Map<
		number,
		Array<{
			id: string;
			level: number;
			x: number;
			y: number;
			children: string[];
		}>
	>();

	// Group nodes by level
	nodes.forEach((node) => {
		if (!levelNodes.has(node.level)) {
			levelNodes.set(node.level, []);
		}
		levelNodes.get(node.level)!.push(node);
	});

	// Position nodes level by level
	levelNodes.forEach((levelNodesList, level) => {
		let currentPos = 0;

		levelNodesList.forEach((node, index) => {
			const childCount = node.children.length;
			let nodeX = currentPos;
			let nodeY = level * levelGap;

			if (orientation === "horizontal") {
				nodeX = level * levelGap;
				nodeY = currentPos;
			}

			node.x = nodeX;
			node.y = nodeY;

			// Reserve space for children
			if (childCount > 0) {
				currentPos += childCount * siblingGap;
			} else {
				currentPos += siblingGap;
			}
		});
	});
}

/**
 * Position nodes in cluster layout
 */
export function positionClusterLayout(
	nodes: Array<{
		id: string;
		level: number;
		parent?: string;
		children: string[];
		x: number;
		y: number;
	}>,
	orientation: "horizontal" | "vertical",
	levelGap: number,
	siblingGap: number,
): void {
	// Similar to tree layout but more compact
	positionTreeLayout(nodes, orientation, levelGap, siblingGap * 0.7);
}

/**
 * Position nodes in radial layout
 */
export function positionRadialLayout(
	nodes: Array<{
		id: string;
		level: number;
		x: number;
		y: number;
	}>,
	levelGap: number,
): void {
	const centerX = 400;
	const centerY = 300;

	nodes.forEach((node) => {
		const radius = node.level * levelGap + 50;
		const angle = (node.level * 0.5 + Math.random()) * Math.PI * 2; // Distribute randomly

		node.x = centerX + radius * Math.cos(angle);
		node.y = centerY + radius * Math.sin(angle);
	});
}
