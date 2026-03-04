import { calculateNodeSize, calculateNodeColor } from './graph3d-utils';

/**
 * Force-directed 3D graph positioning
 */
export function positionForceGraph3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}>,
	edges: Array<{
		source: string;
		target: string;
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: "fixed" | "value" | "degree",
	colorBy: string,
	nodeDegrees: Map<string, number>,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	z: number;
	group?: string;
	value?: number;
	color?: string;
	size?: number;
	shape?: "sphere" | "cube" | "cylinder";
}> {
	// Initialize with random positions
	const positionedNodes = nodes.map((node) => ({
		...node,
		x: Math.random() * dimensions.width,
		y: Math.random() * dimensions.height,
		z: Math.random() * dimensions.depth,
		vx: 0,
		vy: 0,
		vz: 0,
	}));

	// Force-directed algorithm
	const iterations = 100;
	const repulsion = 5000;
	const attraction = 0.001;
	const damping = 0.95;
	const timeStep = 0.1;

	for (let iter = 0; iter < iterations; iter++) {
		// Reset forces
		positionedNodes.forEach((node) => {
			node.vx = 0;
			node.vy = 0;
			node.vz = 0;
		});

		// Repulsion forces between all nodes
		for (let i = 0; i < positionedNodes.length; i++) {
			for (let j = i + 1; j < positionedNodes.length; j++) {
				const node1 = positionedNodes[i];
				const node2 = positionedNodes[j];

				const dx = node2.x - node1.x;
				const dy = node2.y - node1.y;
				const dz = node2.z - node1.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance > 0) {
					const force = repulsion / (distance * distance);
					const fx = (dx / distance) * force * timeStep;
					const fy = (dy / distance) * force * timeStep;
					const fz = (dz / distance) * force * timeStep;

					node1.vx -= fx;
					node1.vy -= fy;
					node1.vz -= fz;
					node2.vx += fx;
					node2.vy += fy;
					node2.vz += fz;
				}
			}
		}

		// Attraction forces along edges
		edges.forEach((edge) => {
			const sourceNode = positionedNodes.find((n) => n.id === edge.source);
			const targetNode = positionedNodes.find((n) => n.id === edge.target);

			if (sourceNode && targetNode) {
				const dx = targetNode.x - sourceNode.x;
				const dy = targetNode.y - sourceNode.y;
				const dz = targetNode.z - sourceNode.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance > 0) {
					const force = attraction * distance * timeStep;
					const fx = (dx / distance) * force;
					const fy = (dy / distance) * force;
					const fz = (dz / distance) * force;

					sourceNode.vx += fx;
					sourceNode.vy += fy;
					sourceNode.vz += fz;
					targetNode.vx -= fx;
					targetNode.vy -= fy;
					targetNode.vz -= fz;
				}
			}
		});

		// Update positions
		positionedNodes.forEach((node) => {
			node.x += node.vx;
			node.y += node.vy;
			node.z += node.vz;

			// Apply damping
			node.vx *= damping;
			node.vy *= damping;
			node.vz *= damping;

			// Keep within bounds
			node.x = Math.max(0, Math.min(dimensions.width, node.x));
			node.y = Math.max(0, Math.min(dimensions.height, node.y));
			node.z = Math.max(0, Math.min(dimensions.depth, node.z));
		});
	}

	// Final processing
	return positionedNodes.map((node) => {
		const degree = nodeDegrees.get(node.id) || 0;
		const size = calculateNodeSize(nodeSize, node, degree);
		const color = calculateNodeColor(colorBy, node, degree, 0);
		const { vx, vy, vz, ...finalNode } = node;
		return {
			...finalNode,
			size,
			color,
		};
	});
}


