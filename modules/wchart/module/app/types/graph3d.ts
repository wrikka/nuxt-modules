/**
 * Graph 3D positioning types
 */
export interface Graph3DNode {
	id: string;
	name: string;
	group?: string;
	value?: number;
	color?: string;
	size?: number;
	shape?: "sphere" | "cube" | "cylinder";
}

export interface Graph3DPositionedNode extends Graph3DNode {
	x: number;
	y: number;
	z: number;
}

export interface Graph3DEdge {
	source: string;
	target: string;
}

export interface Graph3DDimensions {
	width: number;
	height: number;
	depth: number;
}

export type Graph3DLayout = "force" | "grid" | "sphere" | "tree" | "random";

export type NodeSizeMode = "fixed" | "value" | "degree";
