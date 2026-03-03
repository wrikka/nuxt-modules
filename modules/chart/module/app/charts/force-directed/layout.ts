/**
 * Calculate force-directed layout
 */
export function calculateForceDirectedLayout(
	nodes: Array<{
		id: string;
		name: string;
		x?: number;
		y?: number;
		fixed?: boolean;
	}>,
	links: Array<{
		source: string;
		target: string;
		strength?: number;
	}>,
	containerWidth: number,
	containerHeight: number,
	options: {
		iterations?: number;
		repulsion?: number;
		attraction?: number;
		gravity?: number;
		damping?: number;
		maxVelocity?: number;
		centerForce?: number;
	} = {},
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	fixed?: boolean;
}> {
	const {
		iterations = 300,
		repulsion = 100,
		attraction = 0.01,
		gravity = 0.1,
		damping = 0.9,
		maxVelocity = 10,
		centerForce = 0.01,
	} = options;

	// Initialize positions if not provided
	const positionedNodes = nodes.map((node) => ({
		...node,
		x: node.x ?? Math.random() * containerWidth,
		y: node.y ?? Math.random() * containerHeight,
		vx: 0,
		vy: 0,
	}));

	// Create node map for fast lookup
	const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));

	// Force-directed algorithm
	for (let iter = 0; iter < iterations; iter++) {
		// Reset forces
		positionedNodes.forEach((node) => {
			if (!node.fixed) {
				node.vx = 0;
				node.vy = 0;
			}
		});

		// Repulsion forces between all nodes
		for (let i = 0; i < positionedNodes.length; i++) {
			for (let j = i + 1; j < positionedNodes.length; j++) {
				const node1 = positionedNodes[i];
				const node2 = positionedNodes[j];

				if (node1.fixed && node2.fixed) continue;

				const dx = node2.x - node1.x;
				const dy = node2.y - node1.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance === 0) continue;

				const force = repulsion / (distance * distance);
				const forceX = (dx / distance) * force;
				const forceY = (dy / distance) * force;

				if (!node1.fixed) {
					node1.vx -= forceX;
					node1.vy -= forceY;
				}
				if (!node2.fixed) {
					node2.vx += forceX;
					node2.vy += forceY;
				}
			}
		}

		// Attraction forces along links
		links.forEach((link) => {
			const sourceNode = nodeMap.get(link.source);
			const targetNode = nodeMap.get(link.target);

			if (!sourceNode || !targetNode) return;
			if (sourceNode.fixed && targetNode.fixed) return;

			const dx = targetNode.x - sourceNode.x;
			const dy = targetNode.y - sourceNode.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance === 0) return;

			const strength = link.strength || 1;
			const force = attraction * strength * distance;
			const forceX = (dx / distance) * force;
			const forceY = (dy / distance) * force;

			if (!sourceNode.fixed) {
				sourceNode.vx += forceX;
				sourceNode.vy += forceY;
			}
			if (!targetNode.fixed) {
				targetNode.vx -= forceX;
				targetNode.vy -= forceY;
			}
		});

		// Center gravity force
		const centerX = containerWidth / 2;
		const centerY = containerHeight / 2;

		positionedNodes.forEach((node) => {
			if (node.fixed) return;

			const dx = centerX - node.x;
			const dy = centerY - node.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 0) {
				const force = centerForce * distance;
				node.vx += (dx / distance) * force;
				node.vy += (dy / distance) * force;
			}
		});

		// Gravity to prevent nodes from flying away
		positionedNodes.forEach((node) => {
			if (node.fixed) return;

			const distanceFromCenter = Math.sqrt(
				Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2),
			);

			if (distanceFromCenter > containerWidth / 4) {
				const force = gravity * distanceFromCenter;
				const dx = centerX - node.x;
				const dy = centerY - node.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance > 0) {
					node.vx += (dx / distance) * force;
					node.vy += (dy / distance) * force;
				}
			}
		});

		// Update positions
		positionedNodes.forEach((node) => {
			if (node.fixed) return;

			// Limit velocity
			const velocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
			if (velocity > maxVelocity) {
				node.vx = (node.vx / velocity) * maxVelocity;
				node.vy = (node.vy / velocity) * maxVelocity;
			}

			node.x += node.vx;
			node.y += node.vy;

			// Apply damping
			node.vx *= damping;
			node.vy *= damping;

			// Keep nodes within bounds
			node.x = Math.max(0, Math.min(containerWidth, node.x));
			node.y = Math.max(0, Math.min(containerHeight, node.y));
		});
	}

	return positionedNodes;
}


