import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Choropleth Map - Color-coded geographic regions
 */

/**
 * Generate choropleth data from geographic regions
 */
export function generateChoroplethData(
  regions: Array<{
    id: string;
    name: string;
    value: number;
    geometry?: Array<{ x: number; y: number }>;
  }>,
  options: {
    title?: string;
    colorScheme?: string[];
    numClasses?: number;
    method?: 'equal-interval' | 'quantile' | 'jenks';
  } = {},
): ChartData {
  const { title, colorScheme, numClasses = 5, method = 'quantile' } = options;

  const values = regions.map((r) => r.value);
  const breaks = calculateBreaks(values, numClasses, method);

  const series: ChartSeries[] = regions.map((region, index) => {
    const classIndex = getClassIndex(region.value, breaks);
    const color = colorScheme?.[classIndex] || getChoroplethColor(classIndex, numClasses);

    const data: DataPoint[] = region.geometry?.map((point) => ({
      x: point.x,
      y: point.y,
      regionId: region.id,
      regionName: region.name,
      value: region.value,
      classIndex,
      color,
    })) || [
      {
        x: region.id,
        y: region.value,
        regionId: region.id,
        regionName: region.name,
        value: region.value,
        classIndex,
        color,
      },
    ];

    return {
      name: region.name,
      data,
      type: 'choropleth',
      color,
      layout: {
        regionId: region.id,
        value: region.value,
        class: classIndex,
      },
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Calculate classification breaks
 */
function calculateBreaks(
  values: number[],
  numClasses: number,
  method: 'equal-interval' | 'quantile' | 'jenks',
): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;

  switch (method) {
    case 'equal-interval': {
      const step = (max - min) / numClasses;
      return Array.from({ length: numClasses + 1 }, (_, i) => min + i * step);
    }
    case 'quantile': {
      const breaks: number[] = [min];
      for (let i = 1; i < numClasses; i++) {
        const index = Math.floor((sorted.length * i) / numClasses);
        breaks.push(sorted[index] ?? 0);
      }
      breaks.push(max);
      return breaks;
    }
    case 'jenks':
      // Simplified Jenks natural breaks
      return calculateJenksBreaks(sorted, numClasses);
    default:
      return [min, max];
  }
}

/**
 * Simplified Jenks natural breaks algorithm
 */
function calculateJenksBreaks(sorted: number[], numClasses: number): number[] {
  if (sorted.length <= numClasses) {
    return [...sorted, sorted[sorted.length - 1] ?? 0];
  }

  // Use k-means clustering for natural breaks
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const initialCenters = Array.from({ length: numClasses }, (_, i) =>
    min + ((max - min) * (i + 0.5)) / numClasses,
  );

  // Assign to nearest center
  const classes: number[][] = Array.from({ length: numClasses }, () => []);
  for (const value of sorted) {
    const distances = initialCenters.map((c) => Math.abs(value - c));
    const nearest = distances.indexOf(Math.min(...distances));
    classes[nearest]?.push(value);
  }

  // Calculate breaks
  const breaks: number[] = [min];
  for (let i = 0; i < numClasses - 1; i++) {
    const classMax = classes[i]?.[classes[i].length - 1];
    const nextClassMin = classes[i + 1]?.[0];
    if (classMax !== undefined && nextClassMin !== undefined) {
      breaks.push((classMax + nextClassMin) / 2);
    }
  }
  breaks.push(max);

  return breaks;
}

/**
 * Get color based on class index
 */
function getChoroplethColor(classIndex: number, numClasses: number): string {
  // Red-yellow-green diverging scheme
  const t = classIndex / (numClasses - 1 || 1);
  if (t < 0.5) {
    // Red to yellow
    const localT = t * 2;
    return `rgb(255, ${Math.round(255 * localT)}, 0)`;
  } else {
    // Yellow to green
    const localT = (t - 0.5) * 2;
    return `rgb(${Math.round(255 * (1 - localT))}, 255, 0)`;
  }
}

/**
 * Get class index for a value
 */
function getClassIndex(value: number, breaks: number[]): number {
  for (let i = 0; i < breaks.length - 1; i++) {
    if (value >= (breaks[i] ?? 0) && value <= (breaks[i + 1] ?? 0)) {
      return i;
    }
  }
  return breaks.length - 2;
}

/**
 * Calculate choropleth statistics
 */
export function calculateChoroplethStats(
  data: ChartData,
): {
  total: number;
  average: number;
  median: number;
  range: { min: number; max: number };
  distribution: number[];
} {
  const values = data.series.map((s) => (s.layout?.value as number) || 0);

  const sorted = [...values].sort((a, b) => a - b);
  const total = values.reduce((sum, v) => sum + v, 0);
  const average = total / values.length;
  const median = sorted.length % 2 === 0
    ? ((sorted[sorted.length / 2 - 1] ?? 0) + (sorted[sorted.length / 2] ?? 0)) / 2
    : sorted[Math.floor(sorted.length / 2)] ?? 0;

  // Count by class
  const numClasses = Math.max(...data.series.map((s) => (s.layout?.class as number) || 0)) + 1;
  const distribution = Array(numClasses).fill(0);
  data.series.forEach((s) => {
    const classIdx = (s.layout?.class as number) || 0;
    distribution[classIdx] = (distribution[classIdx] || 0) + 1;
  });

  return {
    total,
    average,
    median,
    range: { min: sorted[0] ?? 0, max: sorted[sorted.length - 1] ?? 0 },
    distribution,
  };
}

/**
 * Find outliers using IQR method
 */
export function findChoroplethOutliers(
  data: ChartData,
): Array<{ region: string; value: number; type: 'high' | 'low' }> {
  const values = data.series.map((s) => ({
    region: s.name,
    value: (s.layout?.value as number) || 0,
  }));

  const sorted = [...values].sort((a, b) => a.value - b.value);
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)]?.value ?? 0;
  const q3 = sorted[Math.floor(n * 0.75)]?.value ?? 0;
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return values
    .filter((v) => v.value < lowerBound || v.value > upperBound)
    .map((v) => ({
      region: v.region,
      value: v.value,
      type: v.value > upperBound ? 'high' : 'low',
    }));
}
