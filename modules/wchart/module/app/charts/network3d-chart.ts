import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * 3D Network Graph - Network visualization in 3D space
 */

export interface Network3DNode {
  id: string;
  x?: number;
  y?: number;
  z?: number;
  size?: number;
  color?: string;
  group?: string;
}

export interface Network3DEdge {
  source: string;
  target: string;
  weight?: number;
  color?: string;
}

/**
 * Generate 3D network graph with force-directed layout
 */
export function generate3DNetworkData(
  nodes: Network3DNode[],
  edges: Network3DEdge[],
  options: {
    title?: string;
    iterations?: number;
    repulsion?: number;
    springLength?: number;
    gravity?: number;
  } = {},
): ChartData {
  const { title, iterations = 100, repulsion = 100, springLength = 50, gravity = 0.1 } = options;

  // Initialize positions randomly if not set
  const positionedNodes = nodes.map((node) => ({
    ...node,
    x: node.x ?? (Math.random() - 0.5) * 200,
    y: node.y ?? (Math.random() - 0.5) * 200,
    z: node.z ?? (Math.random() - 0.5) * 200,
    vx: 0,
    vy: 0,
    vz: 0,
  }));

  // Force-directed layout
  for (let i = 0; i < iterations; i++) {
    // Repulsion between all nodes
    for (let j = 0; j < positionedNodes.length; j++) {
      for (let k = j + 1; k < positionedNodes.length; k++) {
        const n1 = positionedNodes[j];
        const n2 = positionedNodes[k];

        if (!n1 || !n2) continue;

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dz = n1.z - n2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        n1.vx = (n1.vx || 0) + fx;
        n1.vy = (n1.vy || 0) + fy;
        n1.vz = (n1.vz || 0) + fz;
        n2.vx = (n2.vx || 0) - fx;
        n2.vy = (n2.vy || 0) - fy;
        n2.vz = (n2.vz || 0) - fz;
      }
    }

    // Spring force for edges
    for (const edge of edges) {
      const source = positionedNodes.find((n) => n.id === edge.source);
      const target = positionedNodes.find((n) => n.id === edge.target);

      if (!source || !target) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dz = target.z - source.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

      const force = (dist - springLength) * 0.01;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      source.vx = (source.vx || 0) + fx;
      source.vy = (source.vy || 0) + fy;
      source.vz = (source.vz || 0) + fz;
      target.vx = (target.vx || 0) - fx;
      target.vy = (target.vy || 0) - fy;
      target.vz = (target.vz || 0) - fz;
    }

    // Gravity toward center
    for (const node of positionedNodes) {
      node.vx = (node.vx || 0) - node.x * gravity * 0.1;
      node.vy = (node.vy || 0) - node.y * gravity * 0.1;
      node.vz = (node.vz || 0) - node.z * gravity * 0.1;

      // Apply velocity with damping
      node.x += (node.vx || 0) * 0.5;
      node.y += (node.vy || 0) * 0.5;
      node.z += (node.vz || 0) * 0.5;

      node.vx = (node.vx || 0) * 0.9;
      node.vy = (node.vy || 0) * 0.9;
      node.vz = (node.vz || 0) * 0.9;
    }
  }

  // Create node series
  const nodeSeries: ChartSeries = {
    name: 'Nodes',
    data: positionedNodes.map((node, index) => ({
      x: node.x,
      y: node.y,
      z: node.z,
      id: node.id,
      size: node.size || 5,
      color: node.color || getSeriesColor(index),
      group: node.group,
    })),
    type: 'network3d',
  };

  // Create edge series
  const edgeSeries: ChartSeries[] = edges.map((edge, index) => {
    const source = positionedNodes.find((n) => n.id === edge.source);
    const target = positionedNodes.find((n) => n.id === edge.target);

    if (!source || !target) return null as unknown as ChartSeries;

    return {
      name: `Edge ${index}`,
      data: [
        { x: source.x, y: source.y, z: source.z, id: source.id },
        { x: target.x, y: target.y, z: target.z, id: target.id },
      ],
      type: 'edge3d',
      color: edge.color || '#999',
      layout: {
        weight: edge.weight || 1,
        source: edge.source,
        target: edge.target,
      },
    };
  }).filter(Boolean);

  return {
    title,
    series: [nodeSeries, ...edgeSeries],
  };
}

/**
 * Calculate network metrics for 3D graph
 */
export function calculate3DNetworkMetrics(
  nodes: Network3DNode[],
  edges: Network3DEdge[],
): {
  density: number;
  avgDegree: number;
  clustering: number;
  diameter: number;
} {
  const n = nodes.length;
  const m = edges.length;

  // Density
  const maxEdges = (n * (n - 1)) / 2;
  const density = maxEdges > 0 ? m / maxEdges : 0;

  // Average degree
  const degrees = new Map<string, number>();
  for (const edge of edges) {
    degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
    degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
  }
  const avgDegree = n > 0 ? (degrees.size > 0 ? Array.from(degrees.values()).reduce((a, b) => a + b, 0) / degrees.size : 0) : 0;

  // Clustering coefficient (simplified)
  let triangles = 0;
  const nodeIds = nodes.map((n) => n.id);
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      for (let k = j + 1; k < nodeIds.length; k++) {
        const hasIJ = edges.some((e) =>
          (e.source === nodeIds[i] && e.target === nodeIds[j]) ||
          (e.source === nodeIds[j] && e.target === nodeIds[i]),
        );
        const hasJK = edges.some((e) =>
          (e.source === nodeIds[j] && e.target === nodeIds[k]) ||
          (e.source === nodeIds[k] && e.target === nodeIds[j]),
        );
        const hasKI = edges.some((e) =>
          (e.source === nodeIds[k] && e.target === nodeIds[i]) ||
          (e.source === nodeIds[i] && e.target === nodeIds[k]),
        );
        if (hasIJ && hasJK && hasKI) triangles++;
      }
    }
  }
  const possibleTriangles = (n * (n - 1) * (n - 2)) / 6;
  const clustering = possibleTriangles > 0 ? triangles / possibleTriangles : 0;

  // Diameter approximation (longest shortest path)
  let diameter = 0;

  return { density, avgDegree, clustering, diameter };
}

/**
 * Find communities using simple label propagation
 */
export function find3DNetworkCommunities(
  nodes: Network3DNode[],
  edges: Network3DEdge[],
): Array<{ id: string; community: number }> {
  // Initialize each node with unique label
  const labels = new Map<string, number>();
  nodes.forEach((node, i) => labels.set(node.id, i));

  // Propagate labels
  for (let iter = 0; iter < 10; iter++) {
    const newLabels = new Map(labels);

    for (const node of nodes) {
      const neighborLabels: number[] = [];

      for (const edge of edges) {
        if (edge.source === node.id) {
          const label = labels.get(edge.target);
          if (label !== undefined) neighborLabels.push(label);
        } else if (edge.target === node.id) {
          const label = labels.get(edge.source);
          if (label !== undefined) neighborLabels.push(label);
        }
      }

      if (neighborLabels.length > 0) {
        // Most common label
        const counts = new Map<number, number>();
        for (const label of neighborLabels) {
          counts.set(label, (counts.get(label) || 0) + 1);
        }
        const maxLabel = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
        if (maxLabel) {
          newLabels.set(node.id, maxLabel[0]);
        }
      }
    }

    labels.clear();
    newLabels.forEach((v, k) => labels.set(k, v));
  }

  return nodes.map((node) => ({
    id: node.id,
    community: labels.get(node.id) || 0,
  }));
}
