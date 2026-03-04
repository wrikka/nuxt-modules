import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Run Chart - Simple time-series with median line
 */

/**
 * Generate run chart data
 */
export function generateRunChart(
  values: number[],
  labels: string[],
  options: {
    title?: string;
    showMedian?: boolean;
    showTrend?: boolean;
    color?: string;
  } = {},
): ChartData {
  const { title, showMedian = true, showTrend = true, color = '#4e79a7' } = options;

  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? ((sorted[sorted.length / 2 - 1] ?? 0) + (sorted[sorted.length / 2] ?? 0)) / 2
    : sorted[Math.floor(sorted.length / 2)] ?? 0;

  const data: DataPoint[] = values.map((val, i) => ({
    x: labels[i] || i,
    y: val,
    aboveMedian: val > median,
  }));

  const series: ChartSeries[] = [
    {
      name: 'Values',
      data,
      type: 'line',
      color,
    },
  ];

  if (showMedian) {
    series.push({
      name: 'Median',
      data: values.map((_, i) => ({ x: labels[i] || i, y: median })),
      type: 'line',
      color: '#e15759',
      layout: { dashed: true },
    });
  }

  if (showTrend) {
    // Linear regression
    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = values.reduce((sum, v, i) => sum + i * v, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    series.push({
      name: 'Trend',
      data: values.map((_, i) => ({ x: labels[i] || i, y: slope * i + intercept })),
      type: 'line',
      color: '#59a14f',
      layout: { dashed: true },
    });
  }

  return {
    title: title || 'Run Chart',
    series,
  };
}

/**
 * Detect runs above/below median
 */
export function detectRuns(
  data: ChartData,
  minLength: number = 7,
): Array<{
  type: 'above' | 'below';
  start: number;
  length: number;
  values: number[];
}> {
  const series = data.series[0];
  if (!series) return [];

  const values = series.data.map((d) => ({
    value: d.y as number,
    above: d.aboveMedian as boolean,
  }));

  const runs: Array<{ type: 'above' | 'below'; start: number; length: number; values: number[] }> = [];

  let currentRun: { type: 'above' | 'below'; start: number; values: number[] } | null = null;

  values.forEach((v, i) => {
    if (!currentRun || currentRun.type !== (v.above ? 'above' : 'below')) {
      if (currentRun && currentRun.values.length >= minLength) {
        runs.push({
          type: currentRun.type,
          start: currentRun.start,
          length: currentRun.values.length,
          values: currentRun.values,
        });
      }
      currentRun = { type: v.above ? 'above' : 'below', start: i, values: [v.value] };
    } else {
      currentRun.values.push(v.value);
    }
  });

  // Check last run
  if (currentRun && currentRun.values.length >= minLength) {
    runs.push({
      type: currentRun.type,
      start: currentRun.start,
      length: currentRun.values.length,
      values: currentRun.values,
    });
  }

  return runs;
}

/**
 * Calculate run chart statistics
 */
export function calculateRunStats(
  values: number[],
): {
  crossings: number;
  longestRun: number;
  trend: 'up' | 'down' | 'none';
  autocorrelation: number;
} {
  // Count crossings of median
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;

  let crossings = 0;
  let above = (values[0] ?? 0) > median;
  for (const val of values.slice(1)) {
    const nowAbove = val > median;
    if (nowAbove !== above) {
      crossings++;
      above = nowAbove;
    }
  }

  // Longest run
  const runs = detectRuns(
    { series: [{ name: 'Values', data: values.map((v, i) => ({ x: i, y: v, aboveMedian: v > median })), type: 'line' }] },
    1,
  );
  const longestRun = Math.max(...runs.map((r) => r.length), 0);

  // Trend
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstMean = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondMean = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
  const trend = secondMean > firstMean * 1.05 ? 'up' : secondMean < firstMean * 0.95 ? 'down' : 'none';

  // Simple autocorrelation (lag-1)
  let autocorrelation = 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  if (variance > 0) {
    let sumProduct = 0;
    for (let i = 0; i < values.length - 1; i++) {
      sumProduct += ((values[i] ?? 0) - mean) * ((values[i + 1] ?? 0) - mean);
    }
    autocorrelation = sumProduct / ((values.length - 1) * variance);
  }

  return { crossings, longestRun, trend, autocorrelation };
}
