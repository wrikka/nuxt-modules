import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * X-bar R Chart - Average and range control chart
 */

/**
 * Generate X-bar R chart data
 */
export function generateXbarRChart(
  subgroups: number[][], // Array of subgroups
  options: {
    title?: string;
    subgroupSize?: number;
  } = {},
): ChartData {
  const { title, subgroupSize = 5 } = options;

  // Calculate subgroup statistics
  const stats = subgroups.map((subgroup, i) => {
    const n = subgroup.length;
    const mean = subgroup.reduce((sum, v) => sum + v, 0) / n;
    const range = Math.max(...subgroup) - Math.min(...subgroup);
    return { index: i, mean, range, n };
  });

  // Calculate grand average and average range
  const xBarBar = stats.reduce((sum, s) => sum + s.mean, 0) / stats.length;
  const rBar = stats.reduce((sum, s) => sum + s.range, 0) / stats.length;

  // Control chart constants for n=5
  const A2 = 0.577;
  const D3 = 0;
  const D4 = 2.114;

  // Control limits
  const lclX = xBarBar - A2 * rBar;
  const uclX = xBarBar + A2 * rBar;
  const lclR = D3 * rBar;
  const uclR = D4 * rBar;

  return {
    title: title || 'X-bar R Chart',
    series: [
      // X-bar chart
      {
        name: 'X-bar',
        data: stats.map((s) => ({ x: s.index, y: s.mean })),
        type: 'line',
        color: getSeriesColor(0),
      },
      {
        name: 'X Center',
        data: stats.map((s) => ({ x: s.index, y: xBarBar })),
        type: 'line',
        color: '#333',
        layout: { dashed: true },
      },
      {
        name: 'X UCL',
        data: stats.map((s) => ({ x: s.index, y: uclX })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      {
        name: 'X LCL',
        data: stats.map((s) => ({ x: s.index, y: lclX })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      // R chart
      {
        name: 'R',
        data: stats.map((s) => ({ x: s.index, y: s.range })),
        type: 'line',
        color: getSeriesColor(1),
      },
      {
        name: 'R Center',
        data: stats.map((s) => ({ x: s.index, y: rBar })),
        type: 'line',
        color: '#333',
        layout: { dashed: true },
      },
      {
        name: 'R UCL',
        data: stats.map((s) => ({ x: s.index, y: uclR })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      {
        name: 'R LCL',
        data: stats.map((s) => ({ x: s.index, y: lclR })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
    ],
  };
}

/**
 * Detect X-bar R patterns
 */
export function detectXbarRPatterns(
  data: ChartData,
): Array<{
  chart: 'X-bar' | 'R';
  type: string;
  indices: number[];
  description: string;
}> {
  const patterns: Array<{ chart: 'X-bar' | 'R'; type: string; indices: number[]; description: string }> = [];

  // Check X-bar chart (first 4 series)
  const xbarSeries = data.series[0];
  const xbarUCL = data.series[2]?.data[0]?.y as number;
  const xbarLCL = data.series[3]?.data[0]?.y as number;

  if (xbarSeries) {
    const beyondLimits = xbarSeries.data
      .map((d, i) => ({ val: d.y as number, idx: i }))
      .filter((d) => (xbarLCL !== undefined && d.val < xbarLCL) || (xbarUCL !== undefined && d.val > xbarUCL))
      .map((d) => d.idx);

    if (beyondLimits.length > 0) {
      patterns.push({
        chart: 'X-bar',
        type: 'beyond_limits',
        indices: beyondLimits,
        description: `X-bar points beyond control limits: ${beyondLimits.length}`,
      });
    }
  }

  // Check R chart (series 4-7)
  const rSeries = data.series[4];
  const rUCL = data.series[6]?.data[0]?.y as number;
  const rLCL = data.series[7]?.data[0]?.y as number;

  if (rSeries) {
    const beyondLimits = rSeries.data
      .map((d, i) => ({ val: d.y as number, idx: i }))
      .filter((d) => (rLCL !== undefined && d.val < rLCL) || (rUCL !== undefined && d.val > rUCL))
      .map((d) => d.idx);

    if (beyondLimits.length > 0) {
      patterns.push({
        chart: 'R',
        type: 'beyond_limits',
        indices: beyondLimits,
        description: `Range points beyond control limits: ${beyondLimits.length}`,
      });
    }
  }

  return patterns;
}

/**
 * Estimate process sigma from R chart
 */
export function estimateSigmaFromR(
  rBar: number,
  subgroupSize: number,
): number {
  // d2 constant varies with subgroup size
  const d2: Record<number, number> = {
    2: 1.128,
    3: 1.693,
    4: 2.059,
    5: 2.326,
    6: 2.534,
    7: 2.704,
    8: 2.847,
    9: 2.970,
    10: 3.078,
  };
  return rBar / (d2[subgroupSize] || 2.326);
}
