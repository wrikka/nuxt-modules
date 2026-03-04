import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate Nightingale Rose chart data (polar area chart with varying radius)
 */
export function generateNightingaleData(
  categories: string[],
  values: number[],
  options: {
    title?: string;
    maxRadius?: number;
    colorScheme?: string[];
    clockwise?: boolean;
  } = {},
): ChartData {
  const { title, maxRadius = 100, colorScheme, clockwise = true } = options;

  const maxValue = Math.max(...values);

  const data: DataPoint[] = categories.map((cat, i) => ({
    x: cat,
    y: values[i] || 0,
    label: cat,
    color: colorScheme?.[i] || getSeriesColor(i),
  }));

  // Calculate polar coordinates
  const angleStep = (Math.PI * 2) / categories.length;
  const series: ChartSeries = {
    name: 'Nightingale Rose',
    data: data.map((d, i) => ({
      ...d,
      // Store polar coordinates for rendering
      radius: ((d.y as number) / maxValue) * maxRadius,
      angle: clockwise ? angleStep * i : -angleStep * i,
      startAngle: clockwise ? angleStep * i : -angleStep * i,
      endAngle: clockwise ? angleStep * (i + 1) : -angleStep * (i + 1),
    })),
    type: 'nightingale',
  };

  return {
    title,
    series: [series],
  };
}

/**
 * Generate Nightingale Rose with multiple layers
 */
export function generateMultiLayerNightingale(
  categories: string[],
  layers: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    maxRadius?: number;
  } = {},
): ChartData {
  const { title, maxRadius = 100 } = options;

  const maxValue = Math.max(...layers.flatMap((l) => l.values));
  const angleStep = (Math.PI * 2) / categories.length;

  const series: ChartSeries[] = layers.map((layer, layerIndex) => {
    const data: DataPoint[] = layer.values.map((value, i) => ({
      x: categories[i],
      y: value,
      label: categories[i],
      radius: (value / maxValue) * maxRadius,
      angle: angleStep * i,
      startAngle: angleStep * i,
      endAngle: angleStep * (i + 1),
      layerIndex,
    }));

    return {
      name: layer.name,
      data,
      type: 'nightingale',
      color: layer.color || getSeriesColor(layerIndex),
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Calculate petal statistics for Nightingale Rose
 */
export function calculateNightingaleStats(
  data: ChartData,
): {
  total: number;
  average: number;
  maxPetal: { category: string; value: number };
  minPetal: { category: string; value: number };
  balanceScore: number;
} {
  const series = data.series[0];
  if (!series || series.data.length === 0) {
    return {
      total: 0,
      average: 0,
      maxPetal: { category: '', value: 0 },
      minPetal: { category: '', value: 0 },
      balanceScore: 0,
    };
  }

  const values = series.data.map((d) => d.y as number);
  const total = values.reduce((sum, v) => sum + v, 0);
  const average = total / values.length;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const maxIndex = values.indexOf(maxValue);
  const minIndex = values.indexOf(minValue);

  // Balance score: 1 = perfectly balanced, 0 = completely unbalanced
  const variance = values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length;
  const balanceScore = 1 - Math.min(1, variance / (average * average || 1));

  return {
    total,
    average,
    maxPetal: { category: series.data[maxIndex]?.x as string, value: maxValue },
    minPetal: { category: series.data[minIndex]?.x as string, value: minValue },
    balanceScore,
  };
}

/**
 * Sort petals by value for better visualization
 */
export function sortNightingalePetals(
  data: ChartData,
  order: 'descending' | 'ascending' | 'original' = 'descending',
): ChartData {
  if (order === 'original') return data;

  const sortedSeries = data.series.map((series) => {
    const sortedData = [...series.data].sort((a, b) => {
      const diff = (b.y as number) - (a.y as number);
      return order === 'descending' ? diff : -diff;
    });

    // Recalculate angles after sorting
    const angleStep = (Math.PI * 2) / sortedData.length;
    const updatedData = sortedData.map((d, i) => ({
      ...d,
      angle: angleStep * i,
      startAngle: angleStep * i,
      endAngle: angleStep * (i + 1),
    }));

    return { ...series, data: updatedData };
  });

  return { ...data, series: sortedSeries };
}
