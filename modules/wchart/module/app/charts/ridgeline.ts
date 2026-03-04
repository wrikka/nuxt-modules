import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Ridgeline Plot (Joy Plot) - Overlapping density plots
 */

/**
 * Generate ridgeline plot data
 */
export function generateRidgelineData(
  categories: string[],
  datasets: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    overlap?: number;
    bandwidth?: number;
    resolution?: number;
  } = {},
): ChartData {
  const { title, overlap = 0.7, bandwidth, resolution = 100 } = options;

  const series: ChartSeries[] = datasets.map((dataset, index) => {
    const sorted = [...dataset.values].sort((a, b) => a - b);
    const bw = bandwidth || calculateRidgelineBandwidth(sorted);

    // Calculate KDE
    const density = calculateRidgelineKDE(sorted, bw, resolution);

    // Normalize and offset for overlap effect
    const maxDensity = Math.max(...density.map((d) => d.density));
    const offset = index * (1 - overlap);

    const data: DataPoint[] = density.map((point) => ({
      x: point.value,
      y: offset + (point.density / maxDensity) * overlap,
      baseY: offset,
      category: dataset.name,
    }));

    return {
      name: dataset.name,
      data,
      type: 'ridgeline',
      color: dataset.color || getSeriesColor(index),
      layout: {
        overlap,
        offset,
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
 * Calculate bandwidth for ridgeline plot
 */
function calculateRidgelineBandwidth(values: number[]): number {
  const n = values.length;
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  return 1.06 * std * Math.pow(n, -0.2);
}

/**
 * Calculate KDE for ridgeline
 */
function calculateRidgelineKDE(
  values: number[],
  bandwidth: number,
  points: number,
): Array<{ value: number; density: number }> {
  const min = Math.min(...values) - bandwidth * 3;
  const max = Math.max(...values) + bandwidth * 3;
  const step = (max - min) / points;

  const result: Array<{ value: number; density: number }> = [];

  for (let i = 0; i <= points; i++) {
    const x = min + step * i;
    let density = 0;

    for (const value of values) {
      const u = (x - value) / bandwidth;
      // Gaussian kernel
      density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    }

    density /= values.length * bandwidth;
    result.push({ value: x, density });
  }

  return result;
}

/**
 * Calculate ridgeline statistics
 */
export function calculateRidgelineStats(
  data: ChartData,
): Array<{
  category: string;
  peak: number;
  peakValue: number;
  mean: number;
  median: number;
  spread: number;
}> {
  return data.series.map((series) => {
    const values = series.data.map((d) => d.x as number);
    const densities = series.data.map((d) => d.y as number);

    const maxDensityIndex = densities.indexOf(Math.max(...densities));
    const peak = densities[maxDensityIndex];
    const peakValue = values[maxDensityIndex];

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    const spread = Math.max(...values) - Math.min(...values);

    return {
      category: series.name,
      peak,
      peakValue,
      mean,
      median,
      spread,
    };
  });
}

/**
 * Find peaks in ridgeline
 */
export function findRidgelinePeaks(
  series: ChartSeries,
  threshold: number = 0.1,
): Array<{
  value: number;
  density: number;
  prominence: number;
}> {
  const data = series.data;
  const peaks: Array<{ value: number; density: number; prominence: number }> = [];

  for (let i = 1; i < data.length - 1; i++) {
    const prev = (data[i - 1]?.y as number) ?? 0;
    const curr = (data[i]?.y as number) ?? 0;
    const next = (data[i + 1]?.y as number) ?? 0;

    if (curr > prev && curr > next && curr > threshold) {
      // Calculate prominence
      const leftMin = Math.min(...data.slice(0, i).map((d) => (d.y as number) ?? 0));
      const rightMin = Math.min(...data.slice(i + 1).map((d) => (d.y as number) ?? 0));
      const prominence = curr - Math.max(leftMin, rightMin);

      peaks.push({
        value: data[i]?.x as number,
        density: curr,
        prominence,
      });
    }
  }

  return peaks.sort((a, b) => b.prominence - a.prominence);
}
