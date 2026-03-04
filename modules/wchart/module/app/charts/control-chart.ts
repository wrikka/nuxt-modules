import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Control Chart - Statistical process control
 */

/**
 * Generate control chart data (X-bar and R chart)
 */
export function generateControlChart(
  samples: number[][], // Array of subgroups
  options: {
    title?: string;
    type?: 'xbar' | 'r' | 's' | 'i' | 'mr';
    lcl?: number;
    ucl?: number;
    target?: number;
  } = {},
): ChartData {
  const { title, type = 'xbar', lcl, ucl, target } = options;

  const subgroups = samples.map((subgroup, i) => {
    const n = subgroup.length;
    const mean = subgroup.reduce((sum, v) => sum + v, 0) / n;
    const range = Math.max(...subgroup) - Math.min(...subgroup);

    return { index: i, mean, range, n };
  });

  // Calculate control limits
  const grandMean = subgroups.reduce((sum, s) => sum + s.mean, 0) / subgroups.length;
  const avgRange = subgroups.reduce((sum, s) => sum + s.range, 0) / subgroups.length;

  let centerLine = grandMean;
  let lowerControlLimit = lcl;
  let upperControlLimit = ucl;

  if (type === 'xbar') {
    const A2 = 0.577; // For n=5, would vary with n
    const sigma = avgRange / 1.128; // d2 for n=5
    centerLine = target ?? grandMean;
    lowerControlLimit = lcl ?? centerLine - A2 * avgRange;
    upperControlLimit = ucl ?? centerLine + A2 * avgRange;
  } else if (type === 'r') {
    centerLine = avgRange;
    const D3 = 0; // For n=5
    const D4 = 2.114; // For n=5
    lowerControlLimit = lcl ?? D3 * avgRange;
    upperControlLimit = ucl ?? D4 * avgRange;
  }

  const data: DataPoint[] = subgroups.map((s) => ({
    x: s.index,
    y: type === 'xbar' ? s.mean : type === 'r' ? s.range : s.mean,
    subgroup: s.n,
    outOfControl:
      (lowerControlLimit !== undefined && (type === 'xbar' ? s.mean : s.range) < lowerControlLimit) ||
      (upperControlLimit !== undefined && (type === 'xbar' ? s.mean : s.range) > upperControlLimit),
  }));

  return {
    title: title || `${type.toUpperCase()} Control Chart`,
    series: [
      // Data series
      {
        name: 'Values',
        data,
        type: 'line',
        color: getSeriesColor(0),
      },
      // Center line
      {
        name: 'Center Line',
        data: subgroups.map((s) => ({ x: s.index, y: centerLine })),
        type: 'line',
        color: '#333',
        layout: { dashed: true },
      },
      // UCL
      {
        name: 'UCL',
        data: subgroups.map((s) => ({ x: s.index, y: upperControlLimit })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
      // LCL
      {
        name: 'LCL',
        data: subgroups.map((s) => ({ x: s.index, y: lowerControlLimit })),
        type: 'line',
        color: '#e15759',
        layout: { dashed: true },
      },
    ],
  };
}

/**
 * Detect control chart patterns
 */
export function detectControlPatterns(
  data: ChartData,
): Array<{
  type: 'out_of_control' | 'trend' | 'shift' | 'cycle' | 'stratification';
  indices: number[];
  description: string;
}> {
  const patterns: Array<{ type: 'out_of_control' | 'trend' | 'shift' | 'cycle' | 'stratification'; indices: number[]; description: string }> = [];

  const series = data.series[0];
  if (!series) return patterns;

  const values = series.data.map((d) => d.y as number);
  const ucl = data.series[2]?.data[0]?.y as number;
  const lcl = data.series[3]?.data[0]?.y as number;
  const center = data.series[1]?.data[0]?.y as number;

  // Out of control
  const outOfControl: number[] = [];
  series.data.forEach((d, i) => {
    const val = d.y as number;
    if ((ucl !== undefined && val > ucl) || (lcl !== undefined && val < lcl)) {
      outOfControl.push(i);
    }
  });
  if (outOfControl.length > 0) {
    patterns.push({
      type: 'out_of_control',
      indices: outOfControl,
      description: `Points outside control limits: ${outOfControl.length}`,
    });
  }

  // Trend (7+ consecutive increasing/decreasing)
  for (let i = 6; i < values.length; i++) {
    let increasing = true;
    let decreasing = true;
    for (let j = i - 6; j < i; j++) {
      if ((values[j + 1] ?? 0) <= (values[j] ?? 0)) increasing = false;
      if ((values[j + 1] ?? 0) >= (values[j] ?? 0)) decreasing = false;
    }
    if (increasing || decreasing) {
      patterns.push({
        type: 'trend',
        indices: Array.from({ length: 7 }, (_, k) => i - 6 + k),
        description: `7 point trend ${increasing ? 'up' : 'down'} at index ${i - 3}`,
      });
    }
  }

  return patterns;
}

/**
 * Calculate process capability
 */
export function calculateProcessCapability(
  samples: number[][],
  lsl: number, // Lower specification limit
  usl: number, // Upper specification limit
): {
  cp: number;
  cpk: number;
  ppm: number;
} {
  const allValues = samples.flat();
  const mean = allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
  const variance = allValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / allValues.length;
  const std = Math.sqrt(variance);

  const cp = (usl - lsl) / (6 * std);
  const cpu = (usl - mean) / (3 * std);
  const cpl = (mean - lsl) / (3 * std);
  const cpk = Math.min(cpu, cpl);

  // Estimate PPM (parts per million) out of spec
  const z1 = (mean - lsl) / std;
  const z2 = (usl - mean) / std;
  const ppm = (1 - normalCDF(z1) + 1 - normalCDF(z2)) * 1000000;

  return { cp, cpk, ppm };
}

function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}
