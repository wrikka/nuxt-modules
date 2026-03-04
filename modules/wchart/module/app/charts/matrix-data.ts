import type { MatrixData } from './matrix-types';

/**
 * Generate matrix chart data
 */
export function generateMatrixData(
	rows: string[],
	columns: string[],
	values: number[][],
	options: {
		title?: string;
		colorScheme?: string[];
		showValues?: boolean;
		cellSize?: number;
		thresholds?: {
			min?: number;
			max?: number;
			ranges?: Array<{
				min: number;
				max: number;
				color: string;
				label?: string;
			}>;
		};
		normalize?: boolean;
		symmetric?: boolean;
	} = {},
): MatrixData {
	const {
		title,
		colorScheme = ["#f7fbff", "#08306b"],
		showValues = false,
		cellSize = 20,
		thresholds,
		normalize = false,
		symmetric = false,
	} = options;

	// Validate matrix dimensions
	if (values.length !== rows.length || values[0]?.length !== columns.length) {
		throw new Error("Matrix dimensions do not match row/column labels");
	}

	// Normalize values if requested
	let processedValues = values;
	if (normalize) {
		const allValues = values.flat();
		const minVal = Math.min(...allValues);
		const maxVal = Math.max(...allValues);
		const range = maxVal - minVal;

		if (range > 0) {
			processedValues = values.map((row) =>
				row.map((val) => (val - minVal) / range),
			);
		}
	}

	// Generate cell colors
	const cellColors = processedValues.map((row, rowIndex) =>
		row.map((value, colIndex) => {
			let color = "#ffffff"; // default

			if (thresholds?.ranges) {
				// Use threshold ranges
				const range = thresholds.ranges.find(
					(r) => value >= r.min && value <= r.max,
				);
				if (range) {
					color = range.color;
				}
			} else {
				// Use color interpolation
				const minVal = thresholds?.min ?? Math.min(...processedValues.flat());
				const maxVal = thresholds?.max ?? Math.max(...processedValues.flat());

				if (maxVal > minVal) {
					const intensity = (value - minVal) / (maxVal - minVal);
					const colorIndex = Math.floor(intensity * (colorScheme.length - 1));
					color =
						colorScheme[
							Math.max(0, Math.min(colorScheme.length - 1, colorIndex))
						];
				}
			}

			return color;
		}),
	);

	const chartData = {
		title,
		series: [
			{
				name: "Matrix",
				data: processedValues.flatMap((row, rowIndex) =>
					row.map((value, colIndex) => ({
						x: colIndex,
						y: rowIndex,
						label: showValues ? value.toFixed(2) : undefined,
						color: cellColors[rowIndex][colIndex],
						value,
					})),
				),
				type: "matrix" as const,
			},
		],
	};

	return {
		...chartData,
		rows,
		columns,
		values: processedValues,
		cellColors,
		thresholds,
	};
}

/**
 * Generate correlation matrix
 */
export function generateCorrelationMatrix(
	variables: string[],
	data: Array<Record<string, number>>,
	options: {
		title?: string;
		method?: "pearson" | "spearman";
	} = {},
): MatrixData {
	const { title, method = "pearson" } = options;

	// Calculate correlation matrix
	const correlations: number[][] = [];
	for (let i = 0; i < variables.length; i++) {
		correlations[i] = [];
		for (let j = 0; j < variables.length; j++) {
			if (i === j) {
				correlations[i][j] = 1;
			} else {
				const values1 = data.map((record) => record[variables[i]]);
				const values2 = data.map((record) => record[variables[j]]);
				correlations[i][j] = calculateCorrelation(values1, values2, method);
			}
		}
	}

	return generateMatrixData(variables, variables, correlations, {
		title: title || "Correlation Matrix",
		thresholds: {
			min: -1,
			max: 1,
			ranges: [
				{ min: -1, max: -0.7, color: "#d73027", label: "Strong negative" },
				{ min: -0.7, max: -0.3, color: "#fc8d59", label: "Moderate negative" },
				{ min: -0.3, max: 0.3, color: "#ffffbf", label: "Weak" },
				{ min: 0.3, max: 0.7, color: "#91cf60", label: "Moderate positive" },
				{ min: 0.7, max: 1, color: "#1a9850", label: "Strong positive" },
			],
		},
	});
}

/**
 * Generate adjacency matrix
 */
export function generateAdjacencyMatrix(
	nodes: string[],
	edges: Array<{ source: string; target: string; weight?: number }>,
	options: {
		title?: string;
		directed?: boolean;
		normalizeWeights?: boolean;
	} = {},
): MatrixData {
	const { title, directed = false, normalizeWeights = false } = options;

	// Create adjacency matrix
	const nodeIndex = new Map(nodes.map((node, index) => [node, index]));
	const matrix: number[][] = Array(nodes.length)
		.fill(0)
		.map(() => Array(nodes.length).fill(0));

	// Populate matrix
	edges.forEach((edge) => {
		const sourceIdx = nodeIndex.get(edge.source);
		const targetIdx = nodeIndex.get(edge.target);

		if (sourceIdx !== undefined && targetIdx !== undefined) {
			const weight = edge.weight || 1;
			matrix[sourceIdx][targetIdx] =
				(matrix[sourceIdx][targetIdx] || 0) + weight;

			if (!directed) {
				matrix[targetIdx][sourceIdx] =
					(matrix[targetIdx][sourceIdx] || 0) + weight;
			}
		}
	});

	// Normalize if requested
	let processedMatrix = matrix;
	if (normalizeWeights) {
		const maxWeight = Math.max(...matrix.flat());
		if (maxWeight > 0) {
			processedMatrix = matrix.map((row) => row.map((val) => val / maxWeight));
		}
	}

	return generateMatrixData(nodes, nodes, processedMatrix, {
		title: title || "Adjacency Matrix",
		colorScheme: ["#ffffff", "#1f77b4"],
	});
}

/**
 * Generate distance matrix
 */
export function generateDistanceMatrix(
	points: Array<{ id: string; x: number; y: number; z?: number }>,
	options: {
		title?: string;
		distanceMetric?: "euclidean" | "manhattan" | "cosine";
	} = {},
): MatrixData {
	const { title, distanceMetric = "euclidean" } = options;

	const matrix: number[][] = [];

	for (let i = 0; i < points.length; i++) {
		matrix[i] = [];
		for (let j = 0; j < points.length; j++) {
			if (i === j) {
				matrix[i][j] = 0;
			} else {
				matrix[i][j] = calculateDistance(points[i], points[j], distanceMetric);
			}
		}
	}

	const labels = points.map((p) => p.id);

	return generateMatrixData(labels, labels, matrix, {
		title: title || "Distance Matrix",
		colorScheme: ["#ffffff", "#d62728"],
	});
}

// Import the functions from utils
import { calculateCorrelation, calculateDistance } from './matrix-utils';


