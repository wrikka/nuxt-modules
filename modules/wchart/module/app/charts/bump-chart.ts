import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Bump Chart - Ranking changes over time
 */

/**
 * Generate bump chart data
 */
export function generateBumpChart(
  categories: string[],
  timePoints: string[],
  rankings: number[][], // [category][timePoint] = rank
  options: {
    title?: string;
    smooth?: boolean;
    colorScheme?: string[];
  } = {},
): ChartData {
  const { title, smooth = true, colorScheme } = options;

  const series: ChartSeries[] = categories.map((category, catIndex) => {
    const ranks = rankings[catIndex] || [];

    const data: DataPoint[] = timePoints.map((time, timeIndex) => ({
      x: time,
      y: ranks[timeIndex] || 0,
      category,
      rank: ranks[timeIndex] || 0,
      color: colorScheme?.[catIndex] || getSeriesColor(catIndex),
    }));

    return {
      name: category,
      data,
      type: 'bump',
      color: colorScheme?.[catIndex] || getSeriesColor(catIndex),
      layout: { smooth },
    };
  });

  return {
    title: title || 'Bump Chart',
    series,
  };
}

/**
 * Generate bump chart from values (automatic ranking)
 */
export function generateBumpChartFromValues(
  categories: string[],
  timePoints: string[],
  values: number[][], // [category][timePoint] = value
  options: {
    title?: string;
    ascending?: boolean; // true = lower is better
  } = {},
): ChartData {
  const { title, ascending = false } = options;

  // Calculate rankings at each time point
  const rankings: number[][] = timePoints.map((_, timeIndex) => {
    const timeValues = values.map((catValues) => catValues[timeIndex] || 0);
    const sorted = [...timeValues].sort((a, b) => ascending ? a - b : b - a);
    return timeValues.map((v) => sorted.indexOf(v) + 1);
  });

  // Transpose to [category][timePoint]
  const transposed: number[][] = categories.map((_, catIndex) =>
    rankings.map((r) => r[catIndex] || 0),
  );

  return generateBumpChart(categories, timePoints, transposed, { title });
}

/**
 * Calculate rank changes
 */
export function calculateRankChanges(
  data: ChartData,
): Array<{
  category: string;
  startRank: number;
  endRank: number;
  change: number;
  maxRank: number;
  minRank: number;
}> {
  return data.series.map((series) => {
    const ranks = series.data.map((d) => d.rank as number);
    const startRank = ranks[0] || 0;
    const endRank = ranks[ranks.length - 1] || 0;

    return {
      category: series.name,
      startRank,
      endRank,
      change: startRank - endRank,
      maxRank: Math.max(...ranks),
      minRank: Math.min(...ranks),
    };
  });
}

/**
 * Find rank crossings
 */
export function findRankCrossings(
  data: ChartData,
): Array<{
  timeIndex: number;
  category1: string;
  category2: string;
  previousRanks: [number, number];
  newRanks: [number, number];
}> {
  const crossings: Array<{
    timeIndex: number;
    category1: string;
    category2: string;
    previousRanks: [number, number];
    newRanks: [number, number];
  }> = [];

  const numTimePoints = data.series[0]?.data.length || 0;

  for (let t = 1; t < numTimePoints; t++) {
    for (let i = 0; i < data.series.length; i++) {
      for (let j = i + 1; j < data.series.length; j++) {
        const series1 = data.series[i];
        const series2 = data.series[j];

        const prev1 = series1?.data[t - 1]?.rank as number;
        const prev2 = series2?.data[t - 1]?.rank as number;
        const curr1 = series1?.data[t]?.rank as number;
        const curr2 = series2?.data[t]?.rank as number;

        // Check if they crossed
        if ((prev1 < prev2 && curr1 > curr2) || (prev1 > prev2 && curr1 < curr2)) {
          crossings.push({
            timeIndex: t,
            category1: series1?.name || '',
            category2: series2?.name || '',
            previousRanks: [prev1, prev2],
            newRanks: [curr1, curr2],
          });
        }
      }
    }
  }

  return crossings;
}
