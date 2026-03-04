import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Violin Plot - Combines box plot with kernel density estimation
 */

export interface ViolinData {
  category: string;
  values: number[];
  bandwidth?: number;
}

/**
 * Generate violin plot data
 */
export function generateViolinData(
  datasets: ViolinData[],
  options: {
    title?: string;
    showBox?: boolean;
    showMedian?: boolean;
    showMean?: boolean;
    bandwidth?: number;
  } = {},
): ChartData {
  const { title, showBox = true, showMedian = true, showMean = true, bandwidth } = options;

  const series: ChartSeries[] = datasets.map((dataset, index) => {
    const sorted = [...dataset.values].sort((a, b) => a - b);
    const n = sorted.length;

    // Calculate statistics
    const min = sorted[0];
    const max = sorted[n - 1];
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const mean = sorted.reduce((sum, v) => sum + v, 0) / n;

    // Calculate quartiles
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    // Kernel density estimation
    const bw = bandwidth || calculateBandwidth(sorted);
    const density = calculateKDE(sorted, bw, 100);

    const data: DataPoint[] = density.map((point) => ({
      x: dataset.category,
      y: point.value,
      density: point.density,
      stats: { min, max, q1, q3, median, mean, iqr },
    }));

    return {
      name: dataset.category,
      data,
      type: 'violin',
      color: getSeriesColor(index),
      layout: {
        showBox,
        showMedian,
        showMean,
        bandwidth: bw,
      },
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Calculate optimal bandwidth for KDE using Silverman's rule
 */
function calculateBandwidth(values: number[]): number {
  const n = values.length;
  const std = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - values.reduce((s, x) => s + x, 0) / n, 2), 0) / n,
  );
  const iqr = values[Math.floor(n * 0.75)] - values[Math.floor(n * 0.25)];
  const sigma = Math.min(std, iqr / 1.34);
  return 0.9 * sigma * Math.pow(n, -0.2);
}

/**
 * Calculate Kernel Density Estimation
 */
function calculateKDE(
  values: number[],
  bandwidth: number,
  points: number,
): Array<{ value: number; density: number }> {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const step = range / points;

  const result: Array<{ value: number; density: number }> = [];

  for (let i = 0; i <= points; i++) {
    const x = min + step * i;
    let density = 0;

    for (const value of values) {
      const u = (x - value) / bandwidth;
      // Epanechnikov kernel
      density += Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0;
    }

    density /= values.length * bandwidth;
    result.push({ value: x, density });
  }

  return result;
}

/**
 * Compare two violin distributions
 */
export function compareViolinDistributions(
  violin1: ChartSeries,
  violin2: ChartSeries,
): {
  overlap: number;
  divergence: number;
  ksStatistic: number;
} {
  const data1 = violin1.data;
  const data2 = violin2.data;

  // Calculate overlap
  const min1 = Math.min(...data1.map((d) => d.y as number));
  const max1 = Math.max(...data1.map((d) => d.y as number));
  const min2 = Math.min(...data2.map((d) => d.y as number));
  const max2 = Math.max(...data2.map((d) => d.y as number));

  const overlap = Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
  const totalRange = Math.max(max1, max2) - Math.min(min1, min2);

  return {
    overlap: totalRange > 0 ? overlap / totalRange : 0,
    divergence: 1 - (overlap / totalRange || 0),
    ksStatistic: calculateKSStatistic(data1, data2),
  };
}

/**
 * Calculate Kolmogorov-Smirnov statistic
 */
function calculateKSStatistic(data1: DataPoint[], data2: DataPoint[]): number {
  const values1 = data1.map((d) => d.y as number).sort((a, b) => a - b);
  const values2 = data2.map((d) => d.y as number).sort((a, b) => a - b);

  let maxDiff = 0;
  const allValues = [...new Set([...values1, ...values2])].sort((a, b) => a - b);

  for (const value of allValues) {
    const cdf1 = values1.filter((v) => v <= value).length / values1.length;
    const cdf2 = values2.filter((v) => v <= value).length / values2.length;
    maxDiff = Math.max(maxDiff, Math.abs(cdf1 - cdf2));
  }

  return maxDiff;
}

/**
 * Split violin plot for comparison
 */
export function generateSplitViolinData(
  category: string,
  groupA: { name: string; values: number[]; color?: string },
  groupB: { name: string; values: number[]; color?: string },
  options: {
    title?: string;
  } = {},
): ChartData {
  const { title } = options;

  const violinA = generateViolinData([{ category: groupA.name, values: groupA.values }]);
  const violinB = generateViolinData([{ category: groupB.name, values: groupB.values }]);

  const seriesA = violinA.series[0];
  const seriesB = violinB.series[0];

  if (seriesA) {
    seriesA.name = `${category} - ${groupA.name}`;
    seriesA.color = groupA.color;
    seriesA.layout = { ...seriesA.layout, side: 'left' };
  }

  if (seriesB) {
    seriesB.name = `${category} - ${groupB.name}`;
    seriesB.color = groupB.color;
    seriesB.layout = { ...seriesB.layout, side: 'right' };
  }

  return {
    title,
    series: [seriesA, seriesB].filter(Boolean) as ChartSeries[],
  };
}
