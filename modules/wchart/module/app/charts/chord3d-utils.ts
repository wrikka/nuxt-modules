import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { Chord3DData } from './chord3d';

/**
 * Calculate 3D chord layout
 */
export function calculateChord3DLayout(
	nodes: Array<{
		id: string;
		name: string;
		angle: number;
		radius: number;
		value: number;
	}>,
	ribbons: Array<{
		source: string;
		target: string;
		value: number;
		sourceAngle: number;
		targetAngle: number;
		sourceRadius: number;
		targetRadius: number;
		color?: string;
		opacity?: number;
		height?: number;
	}>,
	center: { x: number; y: number; z: number },
	radius: number,
	height: number,
): {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		z: number;
		angle: number;
		radius: number;
		value: number;
	}>;
	ribbons: Array<{
		source: string;
		target: string;
		points: Array<{ x: number; y: number; z: number }>;
		value: number;
		color?: string;
	}>;
} {
	// Position nodes in 3D space
	const positionedNodes = nodes.map((node) => ({
		...node,
		x: center.x + radius * Math.cos(node.angle),
		y: center.y + radius * Math.sin(node.angle),
		z: center.z,
	}));

	// Create ribbon geometries
	interface PositionedRibbon {
		source: string;
		target: string;
		points: Array<{ x: number; y: number; z: number }>;
		value: number;
		color: string;
	}

	const positionedRibbons: PositionedRibbon[] = ribbons
		.map((ribbon) => {
			const sourceNode = positionedNodes.find((n) => n.id === ribbon.source);
			const targetNode = positionedNodes.find((n) => n.id === ribbon.target);

			if (!sourceNode || !targetNode) {
				return null;
			}

			// Create ribbon path (simplified - would need proper ribbon geometry)
			const points: Array<{ x: number; y: number; z: number }> = [];

			// Generate points along the ribbon path
			const steps = 20;
			for (let i = 0; i <= steps; i++) {
				const t = i / steps;
				const angle =
					sourceNode.angle + (targetNode.angle - sourceNode.angle) * t;
				const r =
					sourceNode.radius + (targetNode.radius - sourceNode.radius) * t;

				const x = center.x + (radius + r) * Math.cos(angle);
				const y = center.y + (radius + r) * Math.sin(angle);
				const z = center.z + height * Math.sin(t * Math.PI);

				points.push({ x, y, z });
			}

			return {
				source: ribbon.source,
				target: ribbon.target,
				points,
				value: ribbon.value,
				color: ribbon.color || "#999",
			};
		})
		.filter((ribbon) => ribbon !== null);

	return {
		nodes: positionedNodes,
		ribbons: positionedRibbons,
	};
}

/**
 * Calculate 3D chord statistics
 */
export function calculateChord3DStatistics(
	matrix: number[][],
	labels: string[],
): {
	structure: {
		nodes: number;
		connections: number;
		density: number;
		directed: boolean;
		weighted: boolean;
	};
	flow: {
		totalFlow: number;
		averageFlow: number;
		maxFlow: number;
		minFlow: number;
	};
	nodes: {
		mostConnected: { label: string; connections: number };
		leastConnected: { label: string; connections: number };
		averageConnections: number;
	};
	balance: {
		reciprocity: number;
		asymmetry: number;
	};
} {
	const n = matrix.length;
	let totalConnections = 0;
	let totalFlow = 0;
	const nodeConnections: number[] = new Array(n).fill(0);
	const nodeFlows: number[] = new Array(n).fill(0);

	// Analyze matrix
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const value = matrix[i][j];
			if (value > 0) {
				totalConnections++;
				totalFlow += value;
				nodeConnections[i]++;
				nodeFlows[i] += value;
			}
		}
	}

	const density = n > 1 ? totalConnections / (n * (n - 1)) : 0;
	const directed = true; // Chord diagrams are typically directed
	const weighted = matrix.some((row) =>
		row.some((val) => val !== 0 && val !== 1),
	);

	const averageFlow = totalConnections > 0 ? totalFlow / totalConnections : 0;
	const flows = matrix.flat().filter((val) => val > 0);
	const maxFlow = flows.length > 0 ? Math.max(...flows) : 0;
	const minFlow = flows.length > 0 ? Math.min(...flows) : 0;

	// Find most and least connected nodes
	const maxConnections = Math.max(...nodeConnections);
	const minConnections = Math.min(...nodeConnections);
	const mostConnectedIndex = nodeConnections.indexOf(maxConnections);
	const leastConnectedIndex = nodeConnections.indexOf(minConnections);

	const mostConnected = {
		label: labels[mostConnectedIndex],
		connections: maxConnections,
	};

	const leastConnected = {
		label: labels[leastConnectedIndex],
		connections: minConnections,
	};

	const averageConnections =
		nodeConnections.reduce((sum, conn) => sum + conn, 0) / n;

	// Calculate reciprocity and asymmetry
	let reciprocalPairs = 0;
	let totalPairs = 0;
	let asymmetrySum = 0;

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				const ij = matrix[i][j];
				const ji = matrix[j][i];

				if (ij > 0 || ji > 0) {
					totalPairs++;
					if (ij > 0 && ji > 0) {
						reciprocalPairs++;
					}
					asymmetrySum += Math.abs(ij - ji);
				}
			}
		}
	}

	const reciprocity = totalPairs > 0 ? reciprocalPairs / totalPairs : 0;
	const asymmetry = totalPairs > 0 ? asymmetrySum / (2 * totalPairs) : 0;

	return {
		structure: {
			nodes: n,
			connections: totalConnections,
			density,
			directed,
			weighted,
		},
		flow: {
			totalFlow,
			averageFlow,
			maxFlow,
			minFlow,
		},
		nodes: {
			mostConnected,
			leastConnected,
			averageConnections,
		},
		balance: {
			reciprocity,
			asymmetry,
		},
	};
}

/**
 * Rotate 3D chord diagram
 */
export function rotateChord3D(
	chordData: Chord3DData,
	rotation: { x: number; y: number; z: number },
): Chord3DData {
	// Simplified rotation - apply to all points
	const cosX = Math.cos(rotation.x);
	const sinX = Math.sin(rotation.x);
	const cosY = Math.cos(rotation.y);
	const sinY = Math.sin(rotation.y);
	const cosZ = Math.cos(rotation.z);
	const sinZ = Math.sin(rotation.z);

	const rotatePoint = (point: { x: number; y: number; z: number }) => {
		// Translate to origin
		let x = point.x - chordData.center.x;
		let y = point.y - chordData.center.y;
		let z = point.z - chordData.center.z;

		// Rotate around X
		let temp = y;
		y = y * cosX - z * sinX;
		z = temp * sinX + z * cosX;

		// Rotate around Y
		temp = x;
		x = x * cosY + z * sinY;
		z = -temp * sinY + z * cosY;

		// Rotate around Z
		temp = x;
		x = x * cosZ - y * sinZ;
		y = temp * sinZ + y * cosZ;

		// Translate back
		return {
			x: x + chordData.center.x,
			y: y + chordData.center.y,
			z: z + chordData.center.z,
		};
	};

	const rotatedNodes = chordData.nodes.map((node) => ({
		...node,
		...rotatePoint(node),
	}));

	const rotatedRibbons = chordData.ribbons.map((ribbon) => ({
		...ribbon,
		sourceAngle: ribbon.sourceAngle + rotation.z,
		targetAngle: ribbon.targetAngle + rotation.z,
	}));

	return {
		...chordData,
		nodes: rotatedNodes,
		ribbons: rotatedRibbons,
	};
}

/**
 * Generate chord 3D with custom styling
 */
export function generateStyledChord3D(
	matrix: number[][],
	labels: string[],
	styleOptions: {
		title?: string;
		ribbonStyles?: Array<{
			color: string;
			opacity: number;
			height: number;
		}>;
		nodeStyles?: Array<{
			color: string;
			radius: number;
		}>;
	} = {},
): Chord3DData {
	const { title, ribbonStyles, nodeStyles } = styleOptions;

	const data = generateChord3DData(matrix, labels, { title });

	// Apply custom styles
	if (ribbonStyles) {
		data.ribbons = data.ribbons.map((ribbon, index) => ({
			...ribbon,
			...ribbonStyles[index % ribbonStyles.length],
		}));
	}

	if (nodeStyles) {
		data.nodes = data.nodes.map((node, index) => ({
			...node,
			...nodeStyles[index % nodeStyles.length],
		}));
	}

	return data;
}

/**
 * Filter 3D chord diagram by threshold
 */
export function filterChord3DByThreshold(
	chordData: Chord3DData,
	threshold: number,
): Chord3DData {
	const filteredRibbons = chordData.ribbons.filter(
		(ribbon) => ribbon.value >= threshold,
	);

	// Update node values based on remaining connections
	const nodeFlows = new Map<string, number>();
	filteredRibbons.forEach((ribbon) => {
		nodeFlows.set(
			ribbon.source,
			(nodeFlows.get(ribbon.source) || 0) + ribbon.value,
		);
		nodeFlows.set(
			ribbon.target,
			(nodeFlows.get(ribbon.target) || 0) + ribbon.value,
		);
	});

	const updatedNodes = chordData.nodes.map((node) => ({
		...node,
		value: nodeFlows.get(node.id) || 0,
		radius: Math.max(5, Math.sqrt(nodeFlows.get(node.id) || 0) * 2),
	}));

	return {
		...chordData,
		nodes: updatedNodes,
		ribbons: filteredRibbons,
	};
}

/**
 * Generate hierarchical 3D chord diagram
 */
export function generateHierarchicalChord3D(
	hierarchies: Array<{
		name: string;
		children: Array<{
			name: string;
			value: number;
		}>;
	}>,
	connections: Array<{
		fromHierarchy: number;
		fromItem: number;
		toHierarchy: number;
		toItem: number;
		value: number;
	}>,
	options: {
		title?: string;
	} = {},
): Chord3DData {
	const { title } = options;

	// Flatten hierarchies into nodes
	const nodes: Array<{ id: string; name: string }> = [];
	hierarchies.forEach((hierarchy, hIndex) => {
		hierarchy.children.forEach((item, iIndex) => {
			nodes.push({
				id: `h${hIndex}_i${iIndex}`,
				name: item.name,
			});
		});
	});

	// Create matrix from connections
	const matrix: number[][] = Array(nodes.length)
		.fill(0)
		.map(() => Array(nodes.length).fill(0));
	const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));

	connections.forEach((conn) => {
		const fromId = `h${conn.fromHierarchy}_i${conn.fromItem}`;
		const toId = `h${conn.toHierarchy}_i${conn.toItem}`;
		const fromIndex = nodeIndex.get(fromId);
		const toIndex = nodeIndex.get(toId);

		if (fromIndex !== undefined && toIndex !== undefined) {
			matrix[fromIndex][toIndex] = conn.value;
		}
	});

	const labels = nodes.map((node) => node.name);

	return generateChord3DData(matrix, labels, { title });
}

// Import generateChord3DData from chord3d
import { generateChord3DData } from './chord3d';


