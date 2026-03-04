import type { Force3DData } from './force3d-types';

/**
 * Run force-directed simulation
 */
export function simulateForce3D(
	forceData: Force3DData,
	iterations?: number,
): Force3DData {
	const simIterations = iterations || forceData.simulation.iterations;
	const nodes = [...forceData.nodes];
	const links = forceData.links;
	const forces = forceData.forces;
	const simulation = forceData.simulation;

	// Create node map for fast lookup
	const nodeMap = new Map(nodes.map((node) => [node.id, node]));

	let alpha = simulation.alpha;

	for (
		let iter = 0;
		iter < simIterations && alpha > simulation.alphaMin;
		iter++
	) {
		// Reset forces
		nodes.forEach((node) => {
			if (!node.fixed) {
				node.fx = 0;
				node.fy = 0;
				node.fz = 0;
			}
		});

		// Apply repulsion forces
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const node1 = nodes[i];
				const node2 = nodes[j];

				if (node1.fixed && node2.fixed) continue;

				const dx = node2.x - node1.x;
				const dy = node2.y - node1.y;
				const dz = node2.z - node1.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance > 0) {
					let force =
						(forces.repulsion.strength * (node1.mass * node2.mass)) /
						(distance * distance);

					// Apply distance constraints
					const minDistance = forces.repulsion.range
						? forces.repulsion.range[0]
						: 1;
					const maxDistance = forces.repulsion.range
						? forces.repulsion.range[1]
						: Infinity;

					if (distance < minDistance) {
						force =
							(forces.repulsion.strength * (node1.mass * node2.mass)) /
							(minDistance * minDistance);
					} else if (distance > maxDistance) {
						force = 0;
					}

					const fx = (dx / distance) * force;
					const fy = (dy / distance) * force;
					const fz = (dz / distance) * force;

					if (!node1.fixed) {
						node1.fx -= fx;
						node1.fy -= fy;
						node1.fz -= fz;
					}
					if (!node2.fixed) {
						node2.fx += fx;
						node2.fy += fy;
						node2.fz += fz;
					}
				}
			}
		}

		// Apply attraction forces along links
		links.forEach((link) => {
			const sourceNode = nodeMap.get(link.source);
			const targetNode = nodeMap.get(link.target);

			if (!sourceNode || !targetNode) return;
			if (sourceNode.fixed && targetNode.fixed) return;

			const dx = targetNode.x - sourceNode.x;
			const dy = targetNode.y - sourceNode.y;
			const dz = targetNode.z - sourceNode.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance > 0) {
				const targetDistance =
					link.distance || forces.attraction.distance || 100;
				const force =
					forces.attraction.strength *
					(distance - targetDistance) *
					(link.strength || 1);

				const fx = (dx / distance) * force;
				const fy = (dy / distance) * force;
				const fz = (dz / distance) * force;

				if (!sourceNode.fixed) {
					sourceNode.fx += fx;
					sourceNode.fy += fy;
					sourceNode.fz += fz;
				}
				if (!targetNode.fixed) {
					targetNode.fx -= fx;
					targetNode.fy -= fy;
					targetNode.fz -= fz;
				}
			}
		});

		// Apply gravity force
		const gravityCenter = forces.gravity.center || { x: 400, y: 300, z: 200 };
		nodes.forEach((node) => {
			if (node.fixed) return;

			const dx = gravityCenter.x - node.x;
			const dy = gravityCenter.y - node.y;
			const dz = gravityCenter.z - node.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance > 0) {
				const force = forces.gravity.strength * node.mass;

				node.fx += (dx / distance) * force;
				node.fy += (dy / distance) * force;
				node.fz += (dz / distance) * force;
			}
		});

		// Apply centering force
		const centerPoint = forces.centering.center || { x: 400, y: 300, z: 200 };
		nodes.forEach((node) => {
			if (node.fixed) return;

			const dx = centerPoint.x - node.x;
			const dy = centerPoint.y - node.y;
			const dz = centerPoint.z - node.z;

			node.fx += dx * forces.centering.strength;
			node.fy += dy * forces.centering.strength;
			node.fz += dz * forces.centering.strength;
		});

		// Update velocities and positions
		nodes.forEach((node) => {
			if (node.fixed) return;

			// Update velocities
			node.vx = (node.vx + node.fx * alpha) * simulation.velocityDecay;
			node.vy = (node.vy + node.fy * alpha) * simulation.velocityDecay;
			node.vz = (node.vz + node.fz * alpha) * simulation.velocityDecay;

			// Update positions
			node.x += node.vx;
			node.y += node.vy;
			node.z += node.vz;
		});

		// Cool down
		alpha *= simulation.alphaDecay;
	}

	return {
		...forceData,
		nodes,
		simulation: {
			...forceData.simulation,
			alpha,
		},
	};
}

/**
 * Add force to 3D force-directed graph
 */
export function addForce3D(
	forceData: Force3DData,
	forceType: "repulsion" | "attraction" | "gravity" | "centering",
	parameters: any,
): Force3DData {
	const newForces = { ...forceData.forces };

	switch (forceType) {
		case "repulsion":
			newForces.repulsion = { ...newForces.repulsion, ...parameters };
			break;
		case "attraction":
			newForces.attraction = { ...newForces.attraction, ...parameters };
			break;
		case "gravity":
			newForces.gravity = { ...newForces.gravity, ...parameters };
			break;
		case "centering":
			newForces.centering = { ...newForces.centering, ...parameters };
			break;
	}

	return {
		...forceData,
		forces: newForces,
	};
}

/**
 * Fix/unfix nodes in 3D force-directed graph
 */
export function fixNodes3D(
	forceData: Force3DData,
	nodeIds: string[],
	fixed: boolean = true,
	position?: { x: number; y: number; z: number },
): Force3DData {
	const updatedNodes = forceData.nodes.map((node) => {
		if (nodeIds.includes(node.id)) {
			return {
				...node,
				fixed,
				...(position && { x: position.x, y: position.y, z: position.z }),
			};
		}
		return node;
	});

	return {
		...forceData,
		nodes: updatedNodes,
	};
}

/**
 * Reset 3D force-directed simulation
 */
export function resetForce3DSimulation(forceData: Force3DData): Force3DData {
	const resetNodes = forceData.nodes.map((node) => ({
		...node,
		x: Math.random() * 800, // Assuming default dimensions
		y: Math.random() * 600,
		z: Math.random() * 400,
		vx: 0,
		vy: 0,
		vz: 0,
		fx: 0,
		fy: 0,
		fz: 0,
	}));

	return {
		...forceData,
		nodes: resetNodes,
		simulation: {
			...forceData.simulation,
			alpha: 1,
		},
	};
}


