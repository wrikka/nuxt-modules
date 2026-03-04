import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Edge Bundling - Reduces visual clutter in network graphs
 */

export interface BundleNode {
  id: string;
  x: number;
  y: number;
  group?: string;
}

export interface BundleEdge {
  source: string;
  target: string;
  weight?: number;
}

/**
 * Generate edge bundling layout
 */
export function generateEdgeBundling(
  nodes: BundleNode[],
  edges: BundleEdge[],
  options: {
    title?: string;
    bundlingStrength?: number;
    compatibilityThreshold?: number;
    iterations?: number;
  } = {},
): ChartData {
  const { title, bundlingStrength = 0.5, compatibilityThreshold = 0.6, iterations = 60 } = options;

  // Calculate edge compatibility
  const bundledEdges = edges.map((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    // Find compatible edges for bundling
    const compatibleEdges = edges
      .filter((e) => e !== edge)
      .map((e) => {
        const s = nodes.find((n) => n.id === e.source);
        const t = nodes.find((n) => n.id === e.target);
        if (!s || !t) return null;

        const compatibility = calculateEdgeCompatibility(
          sourceNode, targetNode, s, t,
        );
        return { edge: e, compatibility, s, t };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null && e.compatibility > compatibilityThreshold)
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 5); // Top 5 compatible edges

    // Create bundled path
    const controlPoints = generateBundledPath(
      sourceNode, targetNode, compatibleEdges, bundlingStrength,
    );

    return {
      ...edge,
      path: controlPoints,
      bundledWith: compatibleEdges.map((e) => e.edge),
    };
  }).filter(Boolean);

  // Create series for nodes
  const nodeSeries: ChartSeries = {
    name: 'Nodes',
    data: nodes.map((node, index) => ({
      x: node.x,
      y: node.y,
      id: node.id,
      group: node.group,
      color: getSeriesColor(index),
    })),
    type: 'scatter',
  };

  // Create series for bundled edges
  const edgeSeries: ChartSeries[] = bundledEdges.map((edge, index) => {
    if (!edge) return null as unknown as ChartSeries;

    const data: DataPoint[] = edge.path.map((point: { x: number; y: number }, i: number) => ({
      x: point.x,
      y: point.y,
      edgeIndex: index,
      pointIndex: i,
      weight: edge.weight,
    }));

    return {
      name: `Edge ${edge.source}-${edge.target}`,
      data,
      type: 'line',
      color: getSeriesColor(index % 10),
      layout: {
        bundled: true,
        compatibility: edge.bundledWith.length,
      },
    };
  }).filter(Boolean);

  return {
    title,
    series: [nodeSeries, ...edgeSeries],
  };
}

/**
 * Calculate edge compatibility based on angle and position
 */
function calculateEdgeCompatibility(
  s1: BundleNode,
  t1: BundleNode,
  s2: BundleNode,
  t2: BundleNode,
): number {
  // Vector for first edge
  const v1x = t1.x - s1.x;
  const v1y = t1.y - s1.y;

  // Vector for second edge
  const v2x = t2.x - s2.x;
  const v2y = t2.y - s2.y;

  // Normalize
  const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const len2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (len1 === 0 || len2 === 0) return 0;

  const nx1 = v1x / len1;
  const ny1 = v1y / len1;
  const nx2 = v2x / len2;
  const ny2 = v2y / len2;

  // Angle compatibility
  const angleSim = Math.abs(nx1 * nx2 + ny1 * ny2);

  // Scale compatibility
  const scaleSim = 1 - Math.abs(len1 - len2) / Math.max(len1, len2);

  // Position compatibility
  const mid1 = { x: (s1.x + t1.x) / 2, y: (s1.y + t1.y) / 2 };
  const mid2 = { x: (s2.x + t2.x) / 2, y: (s2.y + t2.y) / 2 };
  const dist = Math.sqrt(Math.pow(mid1.x - mid2.x, 2) + Math.pow(mid1.y - mid2.y, 2));
  const maxDist = Math.max(len1, len2);
  const posSim = Math.max(0, 1 - dist / maxDist);

  return (angleSim * 0.5 + scaleSim * 0.25 + posSim * 0.25);
}

/**
 * Generate bundled path with control points
 */
function generateBundledPath(
  source: BundleNode,
  target: BundleNode,
  compatibleEdges: Array<{ s: BundleNode; t: BundleNode; compatibility: number }>,
  strength: number,
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = [source];

  // Calculate attraction point based on compatible edges
  if (compatibleEdges.length > 0 && strength > 0) {
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    // Average direction of compatible edges
    let avgDx = 0;
    let avgDy = 0;
    let totalWeight = 0;

    for (const edge of compatibleEdges) {
      const ex = (edge.s.x + edge.t.x) / 2;
      const ey = (edge.s.y + edge.t.y) / 2;
      const weight = edge.compatibility;

      avgDx += (ex - midX) * weight;
      avgDy += (ey - midY) * weight;
      totalWeight += weight;
    }

    if (totalWeight > 0) {
      avgDx /= totalWeight;
      avgDy /= totalWeight;

      // Control point pulled toward bundle direction
      const controlX = midX + avgDx * strength * 50;
      const controlY = midY + avgDy * strength * 50;

      path.push({ x: controlX, y: controlY });
    }
  }

  path.push(target);
  return path;
}

/**
 * Calculate bundling metrics
 */
export function calculateBundlingMetrics(
  originalEdges: BundleEdge[],
  bundledEdges: Array<{ path: Array<{ x: number; y: number }>; bundledWith: BundleEdge[] }>,
): {
  totalPathLength: number;
  averageCompatibility: number;
  crossings: number;
  clutterReduction: number;
} {
  const totalPathLength = bundledEdges.reduce((sum, edge) => {
    let length = 0;
    for (let i = 1; i < edge.path.length; i++) {
      const dx = edge.path[i].x - edge.path[i - 1].x;
      const dy = edge.path[i].y - edge.path[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return sum + length;
  }, 0);

  const avgCompatibility = bundledEdges.reduce((sum, edge) =>
    sum + edge.bundledWith.length, 0) / bundledEdges.length || 0;

  return {
    totalPathLength,
    averageCompatibility: avgCompatibility,
    crossings: 0, // Would need complex line intersection detection
    clutterReduction: avgCompatibility / originalEdges.length,
  };
}
