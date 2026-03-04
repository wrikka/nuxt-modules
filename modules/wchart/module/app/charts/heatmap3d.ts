import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * 3D Heatmap - Heatmap with depth dimension
 */

/**
 * Generate 3D heatmap data
 */
export function generate3DHeatmapData(
  xLabels: string[],
  yLabels: string[],
  zLabels: string[],
  values: number[][][], // [z][y][x]
  options: {
    title?: string;
    colorScale?: string[];
    opacity?: number;
  } = {},
): ChartData {
  const { title, colorScale, opacity = 0.8 } = options;

  const allValues = values.flat(2);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const series: ChartSeries[] = [];

  zLabels.forEach((zLabel, zIndex) => {
    const zLayer = values[zIndex] || [];

    yLabels.forEach((yLabel, yIndex) => {
      const row = zLayer[yIndex] || [];

      xLabels.forEach((xLabel, xIndex) => {
        const value = row[xIndex] || 0;
        const t = (value - min) / range;
        const colorIndex = Math.floor(t * ((colorScale?.length || 10) - 1));
        const color = colorScale?.[colorIndex] || getHeatmap3DColor(t);

        series.push({
          name: `${zLabel}-${yLabel}-${xLabel}`,
          data: [
            {
              x: xIndex,
              y: yIndex,
              z: zIndex,
              value,
              color,
              opacity,
              xLabel,
              yLabel,
              zLabel,
            },
          ],
          type: 'heatmap3d',
          color,
        });
      });
    });
  });

  return {
    title,
    series,
  };
}

/**
 * Get 3D heatmap color
 */
function getHeatmap3DColor(t: number): string {
  // Heat color scale: black -> red -> yellow -> white
  if (t < 0.33) {
    const localT = t / 0.33;
    return `rgb(${Math.round(255 * localT)}, 0, 0)`;
  } else if (t < 0.66) {
    const localT = (t - 0.33) / 0.33;
    return `rgb(255, ${Math.round(255 * localT)}, 0)`;
  } else {
    const localT = (t - 0.66) / 0.34;
    return `rgb(255, 255, ${Math.round(255 * localT)})`;
  }
}

/**
 * Generate 3D heatmap from time series
 */
export function generate3DHeatmapTimeSeries(
  xCategories: string[],
  yCategories: string[],
  timePoints: Date[],
  getValue: (x: string, y: string, time: Date) => number,
  options: {
    title?: string;
  } = {},
): ChartData {
  const { title } = options;

  const values: number[][][] = [];

  timePoints.forEach((time) => {
    const zLayer: number[][] = [];
    yCategories.forEach((y) => {
      const row: number[] = [];
      xCategories.forEach((x) => {
        row.push(getValue(x, y, time));
      });
      zLayer.push(row);
    });
    values.push(zLayer);
  });

  return generate3DHeatmapData(
    xCategories,
    yCategories,
    timePoints.map((t) => t.toISOString()),
    values,
    { title },
  );
}

/**
 * Find hotspots in 3D heatmap
 */
export function find3DHeatmapHotspots(
  data: ChartData,
  threshold: number = 0.8,
): Array<{
  x: number;
  y: number;
  z: number;
  value: number;
  neighbors: number;
}> {
  const hotspots: Array<{ x: number; y: number; z: number; value: number; neighbors: number }> = [];

  const allValues = data.series.map((s) => (s.data[0]?.value as number) || 0);
  const max = Math.max(...allValues);
  const thresholdValue = max * threshold;

  data.series.forEach((series) => {
    const point = series.data[0];
    if (!point) return;

    const value = (point.value as number) || 0;
    if (value >= thresholdValue) {
      const x = (point.x as number) || 0;
      const y = (point.y as number) || 0;
      const z = (point.z as number) || 0;

      // Count neighbors above threshold
      let neighbors = 0;
      data.series.forEach((other) => {
        const op = other.data[0];
        if (!op) return;

        const ox = (op.x as number) || 0;
        const oy = (op.y as number) || 0;
        const oz = (op.z as number) || 0;
        const ov = (op.value as number) || 0;

        const dist = Math.sqrt(
          Math.pow(ox - x, 2) + Math.pow(oy - y, 2) + Math.pow(oz - z, 2),
        );

        if (dist <= 1.5 && ov >= thresholdValue) {
          neighbors++;
        }
      });

      hotspots.push({ x, y, z, value, neighbors });
    }
  });

  return hotspots.sort((a, b) => b.value - a.value);
}

/**
 * Slice 3D heatmap at specific Z level
 */
export function slice3DHeatmap(
  data: ChartData,
  zLevel: number,
): ChartData {
  const slicedSeries = data.series.filter((series) => {
    const point = series.data[0];
    return point && Math.abs((point.z as number) - zLevel) < 0.5;
  });

  return {
    ...data,
    series: slicedSeries,
  };
}

/**
 * Project 3D heatmap to 2D (sum along Z axis)
 */
export function project3DHeatmapTo2D(
  data: ChartData,
): ChartData {
  // Group by X and Y
  const grid = new Map<string, { x: number; y: number; sum: number; count: number }>();

  data.series.forEach((series) => {
    const point = series.data[0];
    if (!point) return;

    const x = point.x as number;
    const y = point.y as number;
    const value = (point.value as number) || 0;

    const key = `${x},${y}`;
    const existing = grid.get(key);

    if (existing) {
      existing.sum += value;
      existing.count++;
    } else {
      grid.set(key, { x, y, sum: value, count: 1 });
    }
  });

  const projectedSeries: ChartSeries[] = [];

  grid.forEach((cell) => {
    const avg = cell.sum / cell.count;
    const color = getHeatmap3DColor(avg / 100); // Normalize

    projectedSeries.push({
      name: `Cell ${cell.x}-${cell.y}`,
      data: [
        {
          x: cell.x,
          y: cell.y,
          value: avg,
          color,
        },
      ],
      type: 'heatmap',
      color,
    });
  });

  return {
    ...data,
    series: projectedSeries,
  };
}
