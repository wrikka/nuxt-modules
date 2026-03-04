import { positionForceGraph3D } from './graph3d-force-positioning';
import { positionGridGraph3D } from './graph3d-grid-positioning';
import { positionSphereGraph3D } from './graph3d-sphere-positioning';
import { positionTreeGraph3D } from './graph3d-tree-positioning';
import { positionRandomGraph3D } from './graph3d-random-positioning';

/**
 * Position graph nodes in 3D space
 */
export function positionGraphNodes3D(
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
	layout: "force" | "grid" | "sphere" | "tree" | "random",
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
	switch (layout) {
		case "force":
			return positionForceGraph3D(
				nodes,
				edges,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "grid":
			return positionGridGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "sphere":
			return positionSphereGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "tree":
			return positionTreeGraph3D(
				nodes,
				edges,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "random":
		default:
			return positionRandomGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
	}
}


