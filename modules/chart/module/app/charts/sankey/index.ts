import type { ChartData, ChartSeries, DataPoint } from '../../types/chart-basic';
import { getSeriesColor } from '../../utils/chart-utils';

/**
 * Sankey diagram utilities and data generation
 */

/**
 * Generate Sankey diagram data from nodes and links
 */
export function generateSankeyData(
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
	}>,
	links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}>,
	options: {
		title?: string;
		nodeWidth?: number;
		nodePadding?: number;
		align?: "left" | "right" | "center" | "justify";
	} = {},
): SankeyData {
	const {
		title,
	} = options;

	// Assign default colors to nodes if not provided
	const coloredNodes = nodes.map((node, index) => ({
		...node,
		color: node.color || getSeriesColor(index),
	}));

	// Assign default colors to links if not provided
	const coloredLinks = links.map((link, index) => ({
		...link,
		color: link.color || getSeriesColor(index % 10),
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Sankey",
				data: [], // Sankey data is handled differently
				type: "sankey",
			},
		],
	};

	return {
		...chartData,
		nodes: coloredNodes,
		links: coloredLinks,
	};
}

/**
 * Generate Sankey diagram from flow matrix
 */
export function generateSankeyFromMatrix(
	matrix: number[][],
	nodeLabels: string[],
	options: {
		title?: string;
		nodeColors?: string[];
		linkColors?: string[];
	} = {},
): SankeyData {
	const { title, nodeColors, linkColors } = options;

	const nodes = nodeLabels.map((label, index) => ({
		id: `node-${index}`,
		name: label,
		color: nodeColors?.[index],
	}));

	const links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}> = [];

	matrix.forEach((row, sourceIndex) => {
		row.forEach((value, targetIndex) => {
			if (value > 0) {
				links.push({
					source: `node-${sourceIndex}`,
					target: `node-${targetIndex}`,
					value,
					color: linkColors?.[sourceIndex * matrix.length + targetIndex],
				});
			}
		});
	});

	return generateSankeyData(nodes, links, { title });
}

/**
 * Generate energy flow Sankey diagram
 */
export function generateEnergyFlowSankey(
	energySources: Array<{
		name: string;
		output: number;
		color?: string;
	}>,
	energyUses: Array<{
		name: string;
		input: number;
		color?: string;
	}>,
	transformationLinks: Array<{
		source: string;
		target: string;
		value: number;
		efficiency?: number;
	}>,
	options: {
		title?: string;
		showLosses?: boolean;
	} = {},
): SankeyData {
	const { title, showLosses = false } = options;

	// Create nodes for sources, transformations, and uses
	const nodes = [
		...energySources.map((source) => ({
			id: `source-${source.name}`,
			name: source.name,
			color: source.color,
		})),
		...energyUses.map((use) => ({
			id: `use-${use.name}`,
			name: use.name,
			color: use.color,
		})),
	];

	// Create links
	const links = transformationLinks.map((link) => ({
		source: link.source,
		target: link.target,
		value: link.value,
	}));

	// Add loss nodes if requested
	if (showLosses) {
		transformationLinks.forEach((link) => {
			if (link.efficiency && link.efficiency < 1) {
				const lossValue = link.value * (1 - link.efficiency);
				const lossId = `loss-${link.source}-${link.target}`;

				nodes.push({
					id: lossId,
					name: "Loss",
					color: "#FF5722",
				});

				links.push({
					source: link.source,
					target: lossId,
					value: lossValue,
				});
			}
		});
	}

	return generateSankeyData(nodes, links, { title });
}

/**
 * Generate budget flow Sankey diagram
 */
export function generateBudgetFlowSankey(
	revenueSources: Array<{
		name: string;
		amount: number;
		color?: string;
	}>,
	expenseCategories: Array<{
		name: string;
		amount: number;
		color?: string;
	}>,
	allocations: Array<{
		from: string;
		to: string;
		amount: number;
	}>,
	options: {
		title?: string;
		showSurplus?: boolean;
	} = {},
): SankeyData {
	const { title, showSurplus = false } = options;

	const nodes = [
		...revenueSources.map((source) => ({
			id: `revenue-${source.name}`,
			name: source.name,
			color: source.color,
		})),
		...expenseCategories.map((expense) => ({
			id: `expense-${expense.name}`,
			name: expense.name,
			color: expense.color,
		})),
	];

	const links = allocations.map((allocation) => ({
		source: allocation.from,
		target: allocation.to,
		value: allocation.amount,
	}));

	// Calculate surplus/deficit
	if (showSurplus) {
		const totalRevenue = revenueSources.reduce(
			(sum, source) => sum + source.amount,
			0,
		);
		const totalExpenses = expenseCategories.reduce(
			(sum, expense) => sum + expense.amount,
			0,
		);
		const surplus = totalRevenue - totalExpenses;

		if (surplus > 0) {
			nodes.push({
				id: "surplus",
				name: "Surplus",
				color: "#4CAF50",
			});

			// Add surplus links from revenue sources
			revenueSources.forEach((source) => {
				const surplusPortion = (source.amount / totalRevenue) * surplus;
				links.push({
					source: `revenue-${source.name}`,
					target: "surplus",
					value: surplusPortion,
				});
			});
		} else if (surplus < 0) {
			nodes.push({
				id: "deficit",
				name: "Deficit",
				color: "#F44336",
			});

			// Add deficit links to expense categories
			expenseCategories.forEach((expense) => {
				const deficitPortion =
					(expense.amount / totalExpenses) * Math.abs(surplus);
				links.push({
					source: `expense-${expense.name}`,
					target: "deficit",
					value: deficitPortion,
				});
			});
		}
	}

	return generateSankeyData(nodes, links, { title });
}

/**
 * Calculate Sankey diagram statistics
 */
export function calculateSankeyStats(
	nodes: Array<{ id: string }>,
	links: Array<{ source: string; target: string; value: number }>,
): {
	totalNodes: number;
	totalLinks: number;
	totalFlow: number;
	nodeDegrees: Record<string, { in: number; out: number }>;
	maxFlow: number;
	minFlow: number;
	averageFlow: number;
} {
	const totalNodes = nodes.length;
	const totalLinks = links.length;
	const totalFlow = links.reduce((sum, link) => sum + link.value, 0);

	const nodeDegrees: Record<string, { in: number; out: number }> = {};

	// Initialize degrees
	nodes.forEach((node) => {
		nodeDegrees[node.id] = { in: 0, out: 0 };
	});

	// Calculate degrees
	links.forEach((link) => {
		if (nodeDegrees[link.source]) nodeDegrees[link.source]!.out++;
		if (nodeDegrees[link.target]) nodeDegrees[link.target]!.in++;
	});

	const flows = links.map((l) => l.value);
	const maxFlow = Math.max(...flows);
	const minFlow = Math.min(...flows);
	const averageFlow = flows.length > 0 ? totalFlow / flows.length : 0;

	return {
		totalNodes,
		totalLinks,
		totalFlow,
		nodeDegrees,
		maxFlow,
		minFlow,
		averageFlow,
	};
}

/**
 * Validate Sankey diagram data
 */
export function validateSankeyData(
	nodes: Array<{ id: string }>,
	links: Array<{ source: string; target: string; value: number }>,
): {
	valid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	const nodeIds = new Set(nodes.map((n) => n.id));

	// Check for missing nodes
	links.forEach((link, index) => {
		if (!nodeIds.has(link.source)) {
			errors.push(`Link ${index}: source node "${link.source}" not found`);
		}
		if (!nodeIds.has(link.target)) {
			errors.push(`Link ${index}: target node "${link.target}" not found`);
		}
	});

	// Check for self-links
	links.forEach((link, index) => {
		if (link.source === link.target) {
			warnings.push(`Link ${index}: self-link detected (${link.source})`);
		}
	});

	// Check for zero or negative values
	links.forEach((link, index) => {
		if (link.value <= 0) {
			errors.push(
				`Link ${index}: invalid value ${link.value} (must be positive)`,
			);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Generate simplified Sankey from process steps
 */
export function generateProcessFlowSankey(
	processSteps: Array<{
		name: string;
		input: number;
		output: number;
		efficiency?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		showLosses?: boolean;
	} = {},
): SankeyData {
	const { title, showLosses = true } = options;

	const nodes = processSteps.map((step) => ({
		id: step.name,
		name: step.name,
		color: step.color,
	}));

	const links: Array<{
		source: string;
		target: string;
		value: number;
	}> = [];

	processSteps.forEach((step, index) => {
		if (index < processSteps.length - 1) {
			links.push({
				source: step.name,
				target: processSteps[index + 1].name,
				value: step.output,
			});
		}

		if (showLosses && step.input > step.output) {
			const lossId = `loss-${step.name}`;
			nodes.push({
				id: lossId,
				name: "Loss",
				color: "#FF5722",
			});

			links.push({
				source: step.name,
				target: lossId,
				value: step.input - step.output,
			});
		}
	});

	return generateSankeyData(nodes, links, { title });
}


