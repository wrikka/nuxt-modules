import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Parallel Sets - Sankey-style flow with parallel coordinates
 */

/**
 * Generate parallel sets data
 */
export function generateParallelSetsData(
  dimensions: string[],
  data: Array<Record<string, string>>,
  options: {
    title?: string;
    colorScheme?: string[];
  } = {},
): ChartData {
  const { title, colorScheme } = options;

  // Calculate flows between dimensions
  const flows: Array<{
    source: { dim: string; val: string };
    target: { dim: string; val: string };
    count: number;
  }> = [];

  for (let i = 0; i < dimensions.length - 1; i++) {
    const sourceDim = dimensions[i] || '';
    const targetDim = dimensions[i + 1] || '';

    // Count flows
    const flowMap = new Map<string, number>();
    for (const row of data) {
      const sourceVal = row[sourceDim] || '';
      const targetVal = row[targetDim] || '';
      const key = `${sourceVal}|${targetVal}`;
      flowMap.set(key, (flowMap.get(key) || 0) + 1);
    }

    flowMap.forEach((count, key) => {
      const [sourceVal, targetVal] = key.split('|');
      flows.push({
        source: { dim: sourceDim, val: sourceVal || '' },
        target: { dim: targetDim, val: targetVal || '' },
        count,
      });
    });
  }

  // Calculate node positions
  const nodes = new Map<string, { dim: string; val: string; y: number; count: number }>();

  dimensions.forEach((dim, dimIndex) => {
    const values = [...new Set(data.map((row) => row[dim] || ''))].sort();

    let y = 0;
    values.forEach((val) => {
      const count = data.filter((row) => row[dim] === val).length;
      nodes.set(`${dim}|${val}`, { dim, val, y, count });
      y += count;
    });
  });

  // Create series
  const series: ChartSeries[] = flows.map((flow, index) => {
    const sourceNode = nodes.get(`${flow.source.dim}|${flow.source.val}`);
    const targetNode = nodes.get(`${flow.target.dim}|${flow.target.val}`);

    const dimIndex = dimensions.indexOf(flow.source.dim);

    return {
      name: `${flow.source.val} → ${flow.target.val}`,
      data: [
        {
          x: dimIndex,
          y: sourceNode?.y || 0,
          value: flow.count,
          dim: flow.source.dim,
          category: flow.source.val,
        },
        {
          x: dimIndex + 1,
          y: targetNode?.y || 0,
          value: flow.count,
          dim: flow.target.dim,
          category: flow.target.val,
        },
      ],
      type: 'parallelSets',
      color: colorScheme?.[index % (colorScheme.length || 10)] || getSeriesColor(index),
      layout: {
        flow: flow.count,
        source: flow.source.val,
        target: flow.target.val,
      },
    };
  });

  return {
    title: title || 'Parallel Sets',
    series,
  };
}

/**
 * Calculate dimension entropy
 */
export function calculateDimensionEntropy(
  data: Array<Record<string, string>>,
  dimension: string,
): number {
  const values = data.map((row) => row[dimension] || '');
  const counts = new Map<string, number>();

  values.forEach((val) => {
    counts.set(val, (counts.get(val) || 0) + 1);
  });

  const total = values.length;
  let entropy = 0;

  counts.forEach((count) => {
    const p = count / total;
    entropy -= p * Math.log2(p);
  });

  return entropy;
}

/**
 * Find strongest associations between dimensions
 */
export function findStrongAssociations(
  data: Array<Record<string, string>>,
  dim1: string,
  dim2: string,
): Array<{
  val1: string;
  val2: string;
  count: number;
  confidence: number;
  lift: number;
}> {
  // Calculate marginal and joint probabilities
  const total = data.length;
  const count1 = new Map<string, number>();
  const count2 = new Map<string, number>();
  const joint = new Map<string, number>();

  data.forEach((row) => {
    const v1 = row[dim1] || '';
    const v2 = row[dim2] || '';

    count1.set(v1, (count1.get(v1) || 0) + 1);
    count2.set(v2, (count2.get(v2) || 0) + 1);
    joint.set(`${v1}|${v2}`, (joint.get(`${v1}|${v2}`) || 0) + 1);
  });

  const associations: Array<{ val1: string; val2: string; count: number; confidence: number; lift: number }> = [];

  joint.forEach((count, key) => {
    const [v1, v2] = key.split('|');
    const p1 = (count1.get(v1) || 0) / total;
    const p2 = (count2.get(v2) || 0) / total;
    const pJoint = count / total;

    const confidence = pJoint / p1;
    const lift = pJoint / (p1 * p2);

    associations.push({
      val1: v1 || '',
      val2: v2 || '',
      count,
      confidence,
      lift,
    });
  });

  return associations.sort((a, b) => b.lift - a.lift);
}
