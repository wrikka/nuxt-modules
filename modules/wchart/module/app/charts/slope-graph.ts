import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Slope Graph - Shows changes between two points
 */

/**
 * Generate slope graph data
 */
export function generateSlopeGraph(
  categories: string[],
  startValues: number[],
  endValues: number[],
  options: {
    title?: string;
    startLabel?: string;
    endLabel?: string;
    colorScheme?: string[];
    showArrows?: boolean;
  } = {},
): ChartData {
  const { title, startLabel = 'Start', endLabel = 'End', colorScheme, showArrows = true } = options;

  const series: ChartSeries[] = categories.map((category, index) => {
    const start = startValues[index] || 0;
    const end = endValues[index] || 0;
    const change = end - start;
    const percentChange = start !== 0 ? ((end - start) / Math.abs(start)) * 100 : 0;

    const color = colorScheme?.[index] || getSeriesColor(index);

    return {
      name: category,
      data: [
        {
          x: 0,
          y: start,
          label: startLabel,
          value: start,
          position: 'start',
        },
        {
          x: 1,
          y: end,
          label: endLabel,
          value: end,
          position: 'end',
          change,
          percentChange,
        },
      ],
      type: 'slope',
      color,
      layout: {
        change,
        percentChange,
        increasing: change > 0,
        showArrows,
      },
    };
  });

  return {
    title: title || 'Slope Graph',
    series,
  };
}

/**
 * Generate multi-point slope graph
 */
export function generateMultiSlopeGraph(
  categories: string[],
  points: string[],
  values: number[][], // [category][point]
  options: {
    title?: string;
    colorScheme?: string[];
  } = {},
): ChartData {
  const { title, colorScheme } = options;

  const series: ChartSeries[] = categories.map((category, catIndex) => {
    const catValues = values[catIndex] || [];

    const data: DataPoint[] = points.map((point, pointIndex) => ({
      x: pointIndex,
      y: catValues[pointIndex] || 0,
      label: point,
      value: catValues[pointIndex] || 0,
    }));

    return {
      name: category,
      data,
      type: 'slope',
      color: colorScheme?.[catIndex] || getSeriesColor(catIndex),
    };
  });

  return {
    title: title || 'Multi-Point Slope Graph',
    series,
  };
}

/**
 * Calculate slope statistics
 */
export function calculateSlopeStats(
  data: ChartData,
): {
  totalIncrease: number;
  totalDecrease: number;
  netChange: number;
  avgChange: number;
  maxIncrease: { category: string; change: number };
  maxDecrease: { category: string; change: number };
} {
  let totalIncrease = 0;
  let totalDecrease = 0;
  let maxIncrease = { category: '', change: -Infinity };
  let maxDecrease = { category: '', change: Infinity };

  data.series.forEach((series) => {
    const values = series.data.map((d) => d.value as number);
    const change = (values[values.length - 1] ?? 0) - (values[0] ?? 0);

    if (change > 0) {
      totalIncrease += change;
      if (change > maxIncrease.change) {
        maxIncrease = { category: series.name, change };
      }
    } else {
      totalDecrease += change;
      if (change < maxDecrease.change) {
        maxDecrease = { category: series.name, change };
      }
    }
  });

  const netChange = totalIncrease + totalDecrease;
  const avgChange = netChange / data.series.length;

  return {
    totalIncrease,
    totalDecrease,
    netChange,
    avgChange,
    maxIncrease,
    maxDecrease,
  };
}

/**
 * Rank categories by change
 */
export function rankBySlopeChange(
  data: ChartData,
): Array<{
  rank: number;
  category: string;
  change: number;
  percentChange: number;
}> {
  const changes = data.series.map((series) => {
    const values = series.data.map((d) => d.value as number);
    const start = values[0] || 0;
    const end = values[values.length - 1] || 0;
    const change = end - start;
    const percentChange = start !== 0 ? (change / Math.abs(start)) * 100 : 0;

    return {
      category: series.name,
      change,
      percentChange,
    };
  });

  return changes
    .sort((a, b) => b.change - a.change)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
