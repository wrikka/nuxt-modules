import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * I-MR Chart - Individual and Moving Range chart
 */

/**
 * Generate I-MR chart data
 */
export function generateIMRChart(
  values: number[],
  options: {
    title?: string;
    lsl?: number; // Lower spec limit
    usl?: number; // Upper spec limit
  } = {},
): ChartData {
  const { title, lsl, usl } = options;

  // Calculate moving ranges
  const movingRanges: number[] = [];
  for (let i = 1; i < values.length; i++) {
    movingRanges.push(Math.abs((values[i] ?? 0) - (values[i - 1] ?? 0)));
  }

  // Calculate averages
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const mrBar = movingRanges.reduce((sum, v) => sum + v, 0) / movingRanges.length;

  // Control limits for I chart
  const E2 = 2.66; // Constant for n=2
  const lclI = mean - E2 * mrBar;
  const uclI = mean + E2 * mrBar;

  // Control limits for MR chart
  const D3 = 0;
  const D4 = 3.267;
  const lclMR = D3 * mrBar;
  const uclMR = D4 * mrBar;

  // I chart data
  const iData: DataPoint[] = values.map((val, i) => ({
    x: i,
    y: val,
    outOfControl: val < lclI || val > uclI,
  }));

  // MR chart data
  const mrData: DataPoint[] = movingRanges.map((mr, i) => ({
    x: i + 1,
    y: mr,
    outOfControl: mr > uclMR,
  }));

  return {
    title: title || 'I-MR Chart',
    series: [
      // I chart
      {
        name: 'Individual',
        data: iData,
        type: 'line',
        color: getSeriesColor(0),
      },
      {
        name: 'I Center',
        data: values.map((_, i) => ({ x: i, y: mean })),
        type: 'line',
        color: '#333',
        layout: { dashed: true },
      },
      {
        name: 'I UCL',
        data: values.map((_, i) => ({ x: i, y: uclI })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      {
        name: 'I LCL',
        data: values.map((_, i) => ({ x: i, y: lclI })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      ...(lsl !== undefined ? [{
        name: 'LSL',
        data: values.map((_, i) => ({ x: i, y: lsl })),
        type: 'line' as const,
        color: '#59a14f',
        layout: { dashed: true },
      }] : []),
      ...(usl !== undefined ? [{
        name: 'USL',
        data: values.map((_, i) => ({ x: i, y: usl })),
        type: 'line' as const,
        color: '#59a14f',
        layout: { dashed: true },
      }] : []),
      // MR chart
      {
        name: 'Moving Range',
        data: mrData,
        type: 'line',
        color: getSeriesColor(1),
      },
      {
        name: 'MR Center',
        data: movingRanges.map((_, i) => ({ x: i + 1, y: mrBar })),
        type: 'line',
        color: '#333',
        layout: { dashed: true },
      },
      {
        name: 'MR UCL',
        data: movingRanges.map((_, i) => ({ x: i + 1, y: uclMR })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
    ],
  };
}

/**
 * Detect I-MR patterns
 */
export function detectIMRPatterns(
  data: ChartData,
): Array<{
  chart: 'I' | 'MR';
  type: string;
  indices: number[];
  description: string;
}> {
  const patterns: Array<{ chart: 'I' | 'MR'; type: string; indices: number[]; description: string }> = [];

  // Check I chart
  const iSeries = data.series[0];
  if (iSeries) {
    const iValues = iSeries.data;
    const ucl = (data.series[2]?.data[0]?.y as number);
    const lcl = (data.series[3]?.data[0]?.y as number);

    // Points beyond limits
    const beyondLimits = iValues
      .map((d, i) => ({ val: d.y as number, idx: i }))
      .filter((d) => (lcl !== undefined && d.val < lcl) || (ucl !== undefined && d.val > ucl))
      .map((d) => d.idx);

    if (beyondLimits.length > 0) {
      patterns.push({
        chart: 'I',
        type: 'beyond_limits',
        indices: beyondLimits,
        description: `Individual values beyond control limits: ${beyondLimits.length}`,
      });
    }
  }

  // Check MR chart
  const mrSeries = data.series[data.series.length - 3];
  if (mrSeries) {
    const mrValues = mrSeries.data;
    const uclMR = (data.series[data.series.length - 1]?.data[0]?.y as number);

    const highMR = mrValues
      .map((d, i) => ({ val: d.y as number, idx: i }))
      .filter((d) => uclMR !== undefined && d.val > uclMR)
      .map((d) => d.idx);

    if (highMR.length > 0) {
      patterns.push({
        chart: 'MR',
        type: 'high_variability',
        indices: highMR,
        description: `High moving range values: ${highMR.length}`,
      });
    }
  }

  return patterns;
}

/**
 * Calculate process capability for I-MR
 */
export function calculateIMRCapability(
  values: number[],
  lsl: number,
  usl: number,
): {
  cp: number;
  cpk: number;
  pp: number;
  ppk: number;
} {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

  // Calculate MR and estimate sigma
  const movingRanges: number[] = [];
  for (let i = 1; i < values.length; i++) {
    movingRanges.push(Math.abs((values[i] ?? 0) - (values[i - 1] ?? 0)));
  }
  const mrBar = movingRanges.reduce((sum, v) => sum + v, 0) / movingRanges.length;
  const sigmaWithin = mrBar / 1.128;

  // Overall sigma
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const sigmaOverall = Math.sqrt(variance);

  // Capability indices
  const cp = (usl - lsl) / (6 * sigmaWithin);
  const cpk = Math.min((usl - mean) / (3 * sigmaWithin), (mean - lsl) / (3 * sigmaWithin));
  const pp = (usl - lsl) / (6 * sigmaOverall);
  const ppk = Math.min((usl - mean) / (3 * sigmaOverall), (mean - lsl) / (3 * sigmaOverall));

  return { cp, cpk, pp, ppk };
}
