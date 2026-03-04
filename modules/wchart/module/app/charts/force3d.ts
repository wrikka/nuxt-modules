import type { ChartData } from '@/module/app/types/chart-basic';
import type { Force3DData } from './force3d-types';
import { calculateNodeSize, calculateNodeColor } from './force3d-utils';

/**
 * Force 3D utilities - 3D force-directed graphs
 */

export type { Force3DData } from './force3d-types';

/**
 * Generate 3D force-directed graph data
 */
export function generateForce3DData(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		fixed?: boolean;
		mass?: number;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
		distance?: number;
	}>,
	options: {
		title?: string;
		dimensions?: { width: number; height: number; depth: number };
		forces?: {
			repulsion?: {
				strength?: number;
				distance?: number;
				range?: [number, number];
			};
			attraction?: { strength?: number; distance?: number };
			gravity?: {
				strength?: number;
				center?: { x: number; y: number; z: number };
			};
			centering?: {
				strength?: number;
				center?: { x: number; y: number; z: number };
			};
		};
		simulation?: {
			alpha?: number;
			alphaMin?: number;
			alphaDecay?: number;
			velocityDecay?: number;
			iterations?: number;
		};
		colorBy?: "group" | "value" | "degree" | "community";
		sizeBy?: "fixed" | "value" | "degree" | "mass";
	} = {},
): Force3DData {
	const {
		title,
		dimensions = { width: 800, height: 600, depth: 400 },
		forces = {},
		simulation = {},
		colorBy = "group",
		sizeBy = "degree",
	} = options;

	// Initialize forces
	const defaultForces = {
		repulsion: {
			strength: -1000,
			distance: 50,
			range: [1, Infinity] as [number, number],
		},
		attraction: {
			strength: 0.1,
			distance: 100,
		},
		gravity: {
			strength: 0.1,
			center: {
				x: dimensions.width / 2,
				y: dimensions.height / 2,
				z: dimensions.depth / 2,
			},
		},
		centering: {
			strength: 0.01,
			center: {
				x: dimensions.width / 2,
				y: dimensions.height / 2,
				z: dimensions.depth / 2,
			},
		},
	};

	const finalForces = {
		repulsion: { ...defaultForces.repulsion, ...forces.repulsion },
		attraction: { ...defaultForces.attraction, ...forces.attraction },
		gravity: { ...defaultForces.gravity, ...forces.gravity },
		centering: { ...defaultForces.centering, ...forces.centering },
	};

	// Initialize simulation parameters
	const defaultSimulation = {
		alpha: 1,
		alphaMin: 0.001,
		alphaDecay: 0.0228,
		velocityDecay: 0.4,
		iterations: 300,
	};

	const finalSimulation = { ...defaultSimulation, ...simulation };

	// Calculate node degrees for sizing/coloring
	const nodeDegrees = new Map<string, number>();
	nodes.forEach((node) => nodeDegrees.set(node.id, 0));

	links.forEach((link) => {
		nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
		nodeDegrees.set(link.target, (nodeDegrees.get(link.target) || 0) + 1);
	});

	// Initialize node positions and properties
	const positionedNodes = nodes.map((node, index) => {
		const degree = nodeDegrees.get(node.id) || 0;
		const size = calculateNodeSize(sizeBy, node, degree);
		const color = calculateNodeColor(colorBy, node, degree, index);

		return {
			id: node.id,
			name: node.name,
			x: Math.random() * dimensions.width,
			y: Math.random() * dimensions.height,
			z: Math.random() * dimensions.depth,
			vx: 0,
			vy: 0,
			vz: 0,
			fx: 0,
			fy: 0,
			fz: 0,
			group: node.group,
			value: node.value,
			color,
			size,
			fixed: node.fixed || false,
			mass: node.mass || 1,
		};
	});

	// Process links
	const processedLinks = links.map((link) => ({
		source: link.source,
		target: link.target,
		value: link.value,
		color: link.color || "#999",
		strength: link.strength || 1,
		distance: link.distance,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "3D Force Graph",
				data: positionedNodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "force3d" as const,
			},
		],
	};

	return {
		...chartData,
		nodes: positionedNodes,
		links: processedLinks,
		forces: finalForces,
		simulation: finalSimulation,
	};
}

// Re-exports
export {
	simulateForce3D,
	addForce3D,
	fixNodes3D,
	resetForce3DSimulation,
} from './force3d-simulation';

export { calculateForce3DStatistics } from './force3d-statistics';

export { generateForce3DFromMatrix } from './force3d-generation';


