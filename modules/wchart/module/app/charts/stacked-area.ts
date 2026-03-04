import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate stacked area chart data
 */
export function generateStackedAreaData(
  categories: string[],
  seriesData: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    normalized?: boolean;
  } = {},
): ChartData {
  const { title, normalized = false } = options;

  const series: ChartSeries[] = seriesData.map((s, index) => {
    const data: DataPoint[] = categories.map((cat, i) => ({
      x: cat,
      y: s.values[i] || 0,
    }));

    return {
      name: s.name,
      data,
      type: 'area',
      color: s.color || getSeriesColor(index),
    };
  });

  // Normalize if requested (100% stacked)
  if (normalized) {
    for (let i = 0; i < categories.length; i++) {
      const total = series.reduce((sum, s) => sum + (s.data[i]?.y as number || 0), 0);
      if (total > 0) {
        series.forEach((s) => {
          s.data[i].y = ((s.data[i]?.y as number || 0) / total) * 100;
        });
      }
    }
  }

  return {
    title,
    series,
    stacked: true,
  };
}

/**
 * Calculate cumulative values for stacked area
 */
export function calculateStackedCumulative(
  series: ChartSeries[],
): Array<{ category: string; values: number[]; cumulative: number[] }> {
  if (series.length === 0) return [];

  const categories = series[0].data.map((d) => d.x as string);

  return categories.map((cat, i) => {
    const values = series.map((s) => s.data[i]?.y as number || 0);
    const cumulative: number[] = [];
    values.reduce((sum, val, idx) => {
      cumulative[idx] = sum + val;
      return cumulative[idx];
    }, 0);

    return { category: cat, values, cumulative };
  });
}

/**
 * Find peaks and valleys in stacked area
 */
export function findStackedAreaExtremes(
  data: ChartData,
): Array<{
  series: string;
  category: string;
  value: number;
  type: 'peak' | 'valley';
}> {
  const extremes: Array<{
    series: string;
    category: string;
    value: number;
    type: 'peak' | 'valley';
  }> = [];

  data.series.forEach((series) => {
    for (let i = 1; i < series.data.length - 1; i++) {
      const prev = series.data[i - 1].y as number;
      const curr = series.data[i].y as number;
      const next = series.data[i + 1].y as number;

      if (curr > prev && curr > next) {
        extremes.push({
          series: series.name,
          category: series.data[i].x as string,
          value: curr,
          type: 'peak',
        });
      } else if (curr < prev && curr < next) {
        extremes.push({
          series: series.name,
          category: series.data[i].x as string,
          value: curr,
          type: 'valley',
        });
      }
    }
  });

  return extremes;
}

/**
 * Sort series by total value
 */
export function sortSeriesByTotal(
  data: ChartData,
  ascending = false,
): ChartData {
  const sortedSeries = [...data.series].sort((a, b) => {
    const totalA = a.data.reduce((sum, d) => sum + (d.y as number || 0), 0);
    const totalB = b.data.reduce((sum, d) => sum + (d.y as number || 0), 0);
    return ascending ? totalA - totalB : totalB - totalA;
  });

  return {
    ...data,
    series: sortedSeries,
  };
}
