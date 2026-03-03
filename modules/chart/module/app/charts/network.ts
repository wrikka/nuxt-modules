import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';

export interface NetworkNode {
	id: string;
	label: string;
	x?: number;
	y?: number;
	size?: number;
	color?: string;
	group?: string;
}

export interface NetworkLink {
	source: string;
	target: string;
	value?: number;
	color?: string;
}

/**
 * Generate network visualization data
 */
export function generateNetworkData(
	nodes: NetworkNode[],
	links: NetworkLink[],
	options: {
		title?: string;
		layout?: "force" | "circular" | "random";
		nodeSize?: number;
		linkWidth?: number;
	} = {},
): ChartData {
	const { title, layout = "force", nodeSize = 10, linkWidth = 2 } = options;

	// Process nodes
	const processedNodes = nodes.map((node) => ({
		...node,
		size: node.size || nodeSize,
		x: node.x || Math.random() * 100,
		y: node.y || Math.random() * 100,
	}));

	// Process links
	const processedLinks = links.map((link) => ({
		source: link.source,
		target: link.target,
		value: link.value || 1,
		color: link.color || "#999",
	}));

	return {
		title: title || "Network Visualization",
		series: [
			{
				name: "Network",
				data: processedNodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.label,
					size: node.size,
					color: node.color,
					group: node.group,
				})),
				type: "network",
				links: processedLinks,
				layout,
			},
		],
	};
}

/**
 * Generate hierarchical network data
 */
export function generateHierarchicalNetworkData(
	hierarchy: Array<{
		id: string;
		parent?: string;
		label: string;
		size?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		layout?: "tree" | "cluster";
	} = {},
): ChartData {
	const { title, layout = "tree" } = options;

	// Convert hierarchy to nodes and links
	const nodes: NetworkNode[] = [];
	const links: NetworkLink[] = [];

	hierarchy.forEach((item) => {
		nodes.push({
			id: item.id,
			label: item.label,
			size: item.size || 10,
			color: item.color,
		});

		if (item.parent) {
			links.push({
				source: item.parent,
				target: item.id,
				value: 1,
			});
		}
	});

	return generateNetworkData(nodes, links, { title, layout: layout as any });
}

/**
 * Generate social network data
 */
export function generateSocialNetworkData(
	connections: Array<{
		from: string;
		to: string;
		strength?: number;
	}>,
	userData?: Array<{
		id: string;
		name: string;
		group?: string;
	}>,
	options: {
		title?: string;
	} = {},
): ChartData {
	const { title } = options;

	// Extract unique nodes
	const nodeIds = new Set<string>();
	connections.forEach((conn) => {
		nodeIds.add(conn.from);
		nodeIds.add(conn.to);
	});

	const nodes: NetworkNode[] = Array.from(nodeIds).map((id) => {
		const user = userData?.find((u) => u.id === id);
		return {
			id,
			label: user?.name || id,
			group: user?.group,
			size: 10,
		};
	});

	const links: NetworkLink[] = connections.map((conn) => ({
		source: conn.from,
		target: conn.to,
		value: conn.strength || 1,
	}));

	return generateNetworkData(nodes, links, {
		title: title || "Social Network",
	});
}

/**
 * Network layout algorithms
 */
export const networkLayouts = {
	// Force-directed layout
	force: (nodes: NetworkNode[], links: NetworkLink[], iterations = 100) => {
		// Simple force-directed layout implementation
		const forces: { x: number; y: number }[] = nodes.map(() => ({
			x: 0,
			y: 0,
		}));

		for (let iter = 0; iter < iterations; iter++) {
			// Reset forces
			forces.forEach((f) => {
				f.x = 0;
				f.y = 0;
			});

			// Repulsion between nodes
			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const dx = nodes[i].x! - nodes[j].x!;
					const dy = nodes[i].y! - nodes[j].y!;
					const distance = Math.sqrt(dx * dx + dy * dy) || 1;
					const force = 100 / (distance * distance);

					forces[i].x += (dx / distance) * force;
					forces[i].y += (dy / distance) * force;
					forces[j].x -= (dx / distance) * force;
					forces[j].y -= (dy / distance) * force;
				}
			}

			// Attraction along links
			links.forEach((link) => {
				const sourceIndex = nodes.findIndex((n) => n.id === link.source);
				const targetIndex = nodes.findIndex((n) => n.id === link.target);

				if (sourceIndex !== -1 && targetIndex !== -1) {
					const dx = nodes[sourceIndex].x! - nodes[targetIndex].x!;
					const dy = nodes[sourceIndex].y! - nodes[targetIndex].y!;
					const distance = Math.sqrt(dx * dx + dy * dy) || 1;
					const force = distance * 0.1;

					forces[sourceIndex].x -= (dx / distance) * force;
					forces[sourceIndex].y -= (dy / distance) * force;
					forces[targetIndex].x += (dx / distance) * force;
					forces[targetIndex].y += (dy / distance) * force;
				}
			});

			// Apply forces
			nodes.forEach((node, i) => {
				node.x = (node.x || 0) + forces[i].x * 0.1;
				node.y = (node.y || 0) + forces[i].y * 0.1;
			});
		}

		return nodes;
	},

	// Circular layout
	circular: (nodes: NetworkNode[]) => {
		const centerX = 50;
		const centerY = 50;
		const radius = 40;

		nodes.forEach((node, i) => {
			const angle = (i / nodes.length) * 2 * Math.PI;
			node.x = centerX + Math.cos(angle) * radius;
			node.y = centerY + Math.sin(angle) * radius;
		});

		return nodes;
	},

	// Random layout
	random: (nodes: NetworkNode[]) => {
		nodes.forEach((node) => {
			node.x = Math.random() * 100;
			node.y = Math.random() * 100;
		});

		return nodes;
	},
};


