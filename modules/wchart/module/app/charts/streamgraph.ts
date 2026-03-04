import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate streamgraph data (smooth flowing area chart)
 */
export function generateStreamgraphData(
  categories: string[],
  layers: number,
  options: {
    title?: string;
    randomSeed?: number;
    smoothness?: number;
  } = {},
): ChartData {
  const { title, smoothness = 0.5 } = options;

  // Generate smooth random data using sine waves and noise
  const generateSmoothValue = (layer: number, index: number, total: number): number => {
    const phase = (layer / layers) * Math.PI * 2;
    const x = (index / total) * Math.PI * 4;
    const base = Math.sin(x + phase) * 50 + 50;
    const noise = (Math.sin(x * 3 + phase * 2) * 20 + Math.sin(x * 7) * 10) * smoothness;
    return Math.max(10, base + noise);
  };

  const series: ChartSeries[] = Array.from({ length: layers }, (_, layerIndex) => {
    const values = categories.map((_, i) => generateSmoothValue(layerIndex, i, categories.length));
    const data: DataPoint[] = categories.map((cat, i) => ({
      x: cat,
      y: values[i],
    }));

    return {
      name: `Layer ${layerIndex + 1}`,
      data,
      type: 'area',
      color: getSeriesColor(layerIndex),
    };
  });

  // Apply baseline centering for streamgraph effect
  const baseline = categories.map((_, i) =>
    series.reduce((sum, s) => sum + ((s.data[i]?.y as number) || 0), 0) / 2,
  );

  let currentY: number[] = baseline.map((b) => -b);
  series.forEach((s) => {
    s.data.forEach((d: DataPoint, i: number) => {
      const val = d.y as number;
      const current = currentY[i] ?? 0;
      d.y = [current, current + val];
      currentY[i] = current + val;
    });
  });

  return {
    title,
    series,
    stacked: true,
  };
}

/**
 * Generate streamgraph from time series data
 */
export function generateStreamgraphFromTimeSeries(
  dates: Date[],
  seriesValues: Array<{
    name: string;
    values: number[];
  }>,
  options: {
    title?: string;
    order?: 'top-down' | 'bottom-up' | 'inside-out';
  } = {},
): ChartData {
  const { title, order = 'inside-out' } = options;

  // Order layers based on strategy
  let orderedSeries = [...seriesValues];
  if (order === 'inside-out') {
    // Sort by variance and place high variance in middle
    orderedSeries = seriesValues
      .map((s) => ({
        ...s,
        variance: calculateVariance(s.values),
      }))
      .sort((a, b) => b.variance - a.variance);

    // Reorder to inside-out pattern
    const result: typeof orderedSeries = [];
    orderedSeries.forEach((s, i) => {
      if (i % 2 === 0) {
        result.push(s);
      } else {
        result.unshift(s);
      }
    });
    orderedSeries = result;
  }

  const series: ChartSeries[] = orderedSeries.map((s, index) => {
    const data: DataPoint[] = dates.map((date, i) => ({
      x: date.toISOString(),
      y: s.values[i] || 0,
    }));

    return {
      name: s.name,
      data,
      type: 'area',
      color: getSeriesColor(index),
    };
  });

  return {
    title,
    series,
    stacked: true,
  };
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate layer visibility at each point
 */
export function calculateStreamgraphVisibility(
  data: ChartData,
): Array<{
  layer: string;
  maxHeight: number;
  avgHeight: number;
  dominance: number;
}> {
  return data.series.map((series: ChartSeries) => {
    const heights = series.data.map((d: DataPoint) => {
      const y = d.y;
      if (Array.isArray(y)) {
        return Math.abs(y[1] - y[0]);
      }
      return y as number;
    });

    const maxHeight = Math.max(...heights);
    const avgHeight = heights.reduce((sum: number, h: number) => sum + h, 0) / heights.length;
    const dominance = maxHeight / (avgHeight || 1);

    return {
      layer: series.name,
      maxHeight,
      avgHeight,
      dominance,
    };
  });
}
