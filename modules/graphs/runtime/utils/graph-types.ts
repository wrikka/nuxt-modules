// Core Graph Types
export type WeightedGraph<T = string> = Map<
	T,
	Array<{ node: T; weight: number }>
>;

export type Graph<T = string> = Map<T, T[]>;

export type DirectedGraph<T = string> = Graph<T>;
export type UndirectedGraph<T = string> = Graph<T>;

// Adjacency Matrix representation
export type AdjacencyMatrix<T = string> = Map<T, Map<T, number>>;

// Edge types for different graph representations
export interface WeightedEdge<T = string> {
	from: T;
	to: T;
	weight: number;
}

export interface UnweightedEdge<T = string> {
	from: T;
	to: T;
}

// Node types for graph visualization and algorithms
export interface GraphNode {
	id: string | number;
	label?: string;
	color?: string;
	selected?: boolean;
	data?: Record<string, any>;
	// Position for visualization
	x?: number;
	y?: number;
}

export interface GraphEdge {
	from: string | number;
	to: string | number;
	weight?: number;
	highlighted?: boolean;
	directed?: boolean;
	label?: string;
	color?: string;
}

// Algorithm result types
export interface PathResult {
	path: (string | number)[];
	cost?: number;
	found: boolean;
}

export interface ShortestPathResult extends PathResult {
	distances?: Record<string, number>;
	previous?: Record<string, string | null>;
}

export interface AlgorithmResult<T = any> {
	success: boolean;
	result?: T;
	error?: string;
	executionTime?: number;
	steps?: any[];
}

// Traversal result types
export interface TraversalResult {
	order: (string | number)[];
	visited: Set<string | number>;
	parent?: Map<string | number, string | number | null>;
	level?: Map<string | number, number>;
}

// MST (Minimum Spanning Tree) result types
export interface MSTResult {
	edges: WeightedEdge[];
	totalWeight: number;
}

// Component analysis result types
export interface ConnectedComponentsResult {
	components: (string | number)[][];
	componentCount: number;
}

// Cycle detection result types
export interface CycleDetectionResult {
	hasCycle: boolean;
	cycle?: (string | number)[];
}

// Topological sort result types
export interface TopologicalSortResult {
	order: (string | number)[];
	hasCycle: boolean;
}

// Union-Find data structure types
export interface UnionFindResult {
	find: (element: string | number) => string | number;
	union: (a: string | number, b: string | number) => boolean;
	connected: (a: string | number, b: string | number) => boolean;
	getComponents: () => (string | number)[][];
}

// Position and coordinate types for visualization
export interface Position {
	x: number;
	y: number;
}

export interface Bounds {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	width: number;
	height: number;
}

// Layout algorithm types
export type LayoutAlgorithm = 'circular' | 'grid' | 'force-directed' | 'random' | 'tree';

export interface LayoutOptions {
	algorithm: LayoutAlgorithm;
	padding?: number;
	center?: Position;
	nodeSize?: number;
	linkDistance?: number;
	iterations?: number;
}

// Visualization configuration types
export interface VisualizationConfig {
	width: number;
	height: number;
	nodeSize: number;
	nodeColor: string;
	edgeColor: string;
	backgroundColor: string;
	showLabels: boolean;
	showWeights: boolean;
	animated: boolean;
	animationSpeed: number;
	layout: LayoutOptions;
}

// Graph algorithm configuration types
export interface AlgorithmConfig {
	maxIterations?: number;
	timeout?: number;
	heuristic?: (node: string | number, goal: string | number) => number;
	weight?: (edge: GraphEdge) => number;
}

// Error types
export class GraphError extends Error {
	constructor(
		message: string,
		public code: string,
		public data?: any
	) {
		super(message);
		this.name = 'GraphError';
	}
}

export class AlgorithmError extends GraphError {
	constructor(message: string, data?: any) {
		super(message, 'ALGORITHM_ERROR', data);
		this.name = 'AlgorithmError';
	}
}

export class ValidationError extends GraphError {
	constructor(message: string, data?: any) {
		super(message, 'VALIDATION_ERROR', data);
		this.name = 'ValidationError';
	}
}
