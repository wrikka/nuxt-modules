import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Horizon Chart - Multiple bands for dense time series
 */

/**
 * Generate horizon chart data
 */
export function generateHorizonChart(
  timePoints: number[],
  values: number[],
  options: {
    title?: string;
    bands?: number;
    positiveColor?: string;
    negativeColor?: string;
  } = {},
): ChartData {
  const { title, bands = 4, positiveColor = '#2166ac', negativeColor = '#b2182b' } = options;

  // Normalize values to bands
  const maxValue = Math.max(...values.map(Math.abs));
  const bandSize = maxValue / bands;

  const series: ChartSeries[] = [];

  // Create bands for positive values
  for (let b = 0; b < bands; b++) {
    const bandMin = b * bandSize;
    const bandMax = (b + 1) * bandSize;

    const data: DataPoint[] = timePoints.map((time, i) => {
      const val = values[i] || 0;
      let bandValue = 0;

      if (val > 0) {
        if (val > bandMin) {
          bandValue = Math.min(val - bandMin, bandSize);
        }
      }

      return {
        x: time,
        y: bandValue,
        originalValue: val,
        band: b,
        opacity: 1 - b * 0.2,
      };
    });

    // Only add series if it has non-zero values
    if (data.some((d) => (d.y as number) > 0)) {
      series.push({
        name: `Positive Band ${b + 1}`,
        data,
        type: 'area',
        color: positiveColor,
        layout: { band, positive: true },
      });
    }
  }

  // Create bands for negative values
  for (let b = 0; b < bands; b++) {
    const bandMin = -(b + 1) * bandSize;
    const bandMax = -b * bandSize;

    const data: DataPoint[] = timePoints.map((time, i) => {
      const val = values[i] || 0;
      let bandValue = 0;

      if (val < 0) {
        if (val < bandMax) {
          bandValue = Math.abs(Math.max(val - bandMax, -bandSize));
        }
      }

      return {
        x: time,
        y: -bandValue, // Negative for plotting below axis
        originalValue: val,
        band: b,
        opacity: 1 - b * 0.2,
      };
    });

    // Only add series if it has non-zero values
    if (data.some((d) => (d.y as number) < 0)) {
      series.push({
        name: `Negative Band ${b + 1}`,
        data,
        type: 'area',
        color: negativeColor,
        layout: { band, positive: false },
      });
    }
  }

  return {
    title: title || 'Horizon Chart',
    series,
  };
}

/**
 * Generate multi-series horizon chart
 */
export function generateMultiHorizonChart(
  timePoints: number[],
  seriesData: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    bands?: number;
  } = {},
): ChartData {
  const { title, bands = 3 } = options;

  const allSeries: ChartSeries[] = [];

  seriesData.forEach((s, index) => {
    const chart = generateHorizonChart(timePoints, s.values, {
      bands,
      positiveColor: s.color || getSeriesColor(index * 2),
      negativeColor: s.color ? adjustColor(s.color, -30) : getSeriesColor(index * 2 + 1),
    });

    // Offset y positions for layering
    const offset = index * (bands + 1);
    const offsetSeries = chart.series.map((series) => ({
      ...series,
      data: series.data.map((d) => ({
        ...d,
        y: (d.y as number) + offset,
      })),
    }));

    allSeries.push(...offsetSeries);
  });

  return {
    title: title || 'Multi-Series Horizon Chart',
    series: allSeries,
  };
}

/**
 * Adjust color brightness
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Calculate horizon chart density
 */
export function calculateHorizonDensity(
  data: ChartData,
): {
  positiveArea: number;
  negativeArea: number;
  peakDensity: number;
  coverage: number;
} {
  let positiveArea = 0;
  let negativeArea = 0;
  let maxDensity = 0;

  data.series.forEach((series) => {
    const isPositive = series.layout?.positive as boolean;
    const band = (series.layout?.band as number) || 0;
    const opacity = 1 - band * 0.2;

    series.data.forEach((d) => {
      const val = Math.abs(d.y as number);
      const contribution = val * opacity;

      if (isPositive) {
        positiveArea += contribution;
      } else {
        negativeArea += contribution;
      }

      maxDensity = Math.max(maxDensity, contribution);
    });
  });

  const totalPoints = data.series[0]?.data.length || 1;
  const coverage = (positiveArea + negativeArea) / totalPoints;

  return {
    positiveArea,
    negativeArea,
    peakDensity: maxDensity,
    coverage,
  };
}

/**
 * Find peaks in horizon data
 */
export function findHorizonPeaks(
  data: ChartData,
  threshold: number = 0.8,
): Array<{
  time: number;
  value: number;
  band: number;
  sign: 'positive' | 'negative';
}> {
  const peaks: Array<{ time: number; value: number; band: number; sign: 'positive' | 'negative' }> = [];

  data.series.forEach((series) => {
    const isPositive = series.layout?.positive as boolean;
    const band = (series.layout?.band as number) || 0;
    const maxBandValue = Math.max(...series.data.map((d) => Math.abs(d.y as number)));

    series.data.forEach((d) => {
      const val = Math.abs(d.y as number);
      const normalized = maxBandValue > 0 ? val / maxBandValue : 0;

      if (normalized > threshold) {
        peaks.push({
          time: d.x as number,
          value: d.originalValue as number,
          band,
          sign: isPositive ? 'positive' : 'negative',
        });
      }
    });
  });

  return peaks.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}
