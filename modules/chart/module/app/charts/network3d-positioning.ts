import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate node size based on sizing mode
 */
function calculateNodeSize(
	nodeSize: "fixed" | "value" | "degree",
	node: any,
	degree: number,
): number {
	let size = node.size || 5;
	switch (nodeSize) {
		case "value":
			size = node.value ? Math.max(3, Math.sqrt(node.value) * 2) : 5;
			break;
		case "degree":
			size = Math.max(3, Math.sqrt(degree) * 3);
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
export function calculateNodeColor(
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
						node.group
							.split("")
							.reduce((a: number, b: string) => a + b.charCodeAt(0), 0) % 10,
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
 * Position nodes in 3D space
 */
export function positionNodes3D(
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
	}>,
	layout: "force" | "sphere" | "grid" | "random",
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
}> {
	switch (layout) {
		case "force":
			return positionForce3D(
				nodes,
				links,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "sphere":
			return positionSphere3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "grid":
			return positionGrid3D(nodes, dimensions, nodeSize, colorBy, nodeDegrees);
		case "random":
		default:
			return positionRandom3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
	}
}

/**
 * Force-directed 3D positioning
 */
function positionForce3D(
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
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
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

	// Force-directed algorithm (simplified 3D version)
	const iterations = 50;
	const repulsion = 1000;
	const attraction = 0.01;
	const damping = 0.9;

	for (let iter = 0; iter < iterations; iter++) {
		// Reset forces
		positionedNodes.forEach((node) => {
			node.vx = 0;
			node.vy = 0;
			node.vz = 0;
		});

		// Repulsion forces
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
					const fx = (dx / distance) * force;
					const fy = (dy / distance) * force;
					const fz = (dz / distance) * force;

					node1.vx -= fx;
					node1.vy -= fy;
					node1.vz -= fz;
					node2.vx += fx;
					node2.vy += fy;
					node2.vz += fz;
				}
			}
		}

		// Attraction forces along links
		links.forEach((link) => {
			const sourceNode = positionedNodes.find((n) => n.id === link.source);
			const targetNode = positionedNodes.find((n) => n.id === link.target);

			if (sourceNode && targetNode) {
				const dx = targetNode.x - sourceNode.x;
				const dy = targetNode.y - sourceNode.y;
				const dz = targetNode.z - sourceNode.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance > 0) {
					const force = attraction * distance;
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

		// Apply forces and update positions
		positionedNodes.forEach((node) => {
			node.vx *= damping;
			node.vy *= damping;
			node.vz *= damping;
			node.x += node.vx;
			node.y += node.vy;
			node.z += node.vz;

			// Keep within bounds
			node.x = Math.max(0, Math.min(dimensions.width, node.x));
			node.y = Math.max(0, Math.min(dimensions.height, node.y));
			node.z = Math.max(0, Math.min(dimensions.depth, node.z));
		});
	}

	// Apply sizing and coloring
	return positionedNodes.map((node) => {
		const degree = nodeDegrees.get(node.id) || 0;
		return {
			...node,
			size: calculateNodeSize(nodeSize, node, degree),
			color: calculateNodeColor(
				colorBy,
				node,
				degree,
				node.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % 10,
			),
		};
	});
}

/**
 * Spherical 3D positioning
 */
function positionSphere3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
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
}> {
	const centerX = dimensions.width / 2;
	const centerY = dimensions.height / 2;
	const centerZ = dimensions.depth / 2;
	const radius =
		Math.min(dimensions.width, dimensions.height, dimensions.depth) / 3;

	return nodes.map((node, index) => {
		const phi = Math.acos(1 - 2 * (index / nodes.length));
		const theta = Math.PI * (1 + Math.sqrt(5)) * index;
		const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
		const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
		const z = centerZ + radius * Math.cos(phi);
		const degree = nodeDegrees.get(node.id) || 0;
		return {
			...node,
			x,
			y,
			z,
			size: calculateNodeSize(nodeSize, node, degree),
			color: calculateNodeColor(colorBy, node, degree, index % 10),
		};
	});
}

/**
 * Grid 3D positioning
 */
function positionGrid3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
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
}> {
	const gridSize = Math.ceil(Math.cbrt(nodes.length));
	const spacingX = dimensions.width / gridSize;
	const spacingY = dimensions.height / gridSize;
	const spacingZ = dimensions.depth / gridSize;

	return nodes.map((node, index) => {
		const x = (index % gridSize) * spacingX + spacingX / 2;
		const y =
			(Math.floor(index / gridSize) % gridSize) * spacingY + spacingY / 2;
		const z =
			Math.floor(index / (gridSize * gridSize)) * spacingZ + spacingZ / 2;
		const degree = nodeDegrees.get(node.id) || 0;
		return {
			...node,
			x,
			y,
			z,
			size: calculateNodeSize(nodeSize, node, degree),
			color: calculateNodeColor(colorBy, node, degree, index % 10),
		};
	});
}

/**
 * Random 3D positioning
 */
function positionRandom3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
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
}> {
	return nodes.map((node, index) => {
		const degree = nodeDegrees.get(node.id) || 0;
		return {
			...node,
			x: Math.random() * dimensions.width,
			y: Math.random() * dimensions.height,
			z: Math.random() * dimensions.depth,
			size: calculateNodeSize(nodeSize, node, degree),
			color: calculateNodeColor(colorBy, node, degree, index % 10),
		};
	});
}


