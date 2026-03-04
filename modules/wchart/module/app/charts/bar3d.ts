import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * 3D Bar Chart - Three-dimensional bar visualization
 */

/**
 * Generate 3D bar chart data
 */
export function generate3DBarData(
  categories: string[],
  series: Array<{
    name: string;
    values: number[];
    depths?: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    perspective?: number;
    depth?: number;
    barWidth?: number;
    barDepth?: number;
  } = {},
): ChartData {
  const { title, perspective = 0.5, depth = 50, barWidth = 0.8, barDepth = 0.8 } = options;

  const chartSeries: ChartSeries[] = series.map((s, seriesIndex) => {
    const data: DataPoint[] = categories.map((cat, catIndex) => {
      const value = s.values[catIndex] || 0;
      const barDepth = s.depths?.[catIndex] || depth;

      // Calculate 3D position
      const x = catIndex;
      const y = value;
      const z = seriesIndex;

      // Calculate 3D vertices
      const vertices = calculate3DBarVertices(x, 0, z, barWidth, y, barDepth, perspective);

      return {
        x: cat,
        y: value,
        depth: barDepth,
        z: seriesIndex,
        vertices,
        color: s.color || getSeriesColor(seriesIndex),
        category: cat,
        seriesName: s.name,
      };
    });

    return {
      name: s.name,
      data,
      type: 'bar3d',
      color: s.color || getSeriesColor(seriesIndex),
    };
  });

  return {
    title,
    series: chartSeries,
  };
}

/**
 * Calculate 3D bar vertices with perspective
 */
function calculate3DBarVertices(
  x: number,
  yBase: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  perspective: number,
): Array<{ x: number; y: number; z: number }> {
  const hw = width / 2;
  const hd = depth / 2;

  // 8 vertices of a cube
  const vertices = [
    // Bottom face
    { x: x - hw, y: yBase, z: z - hd },
    { x: x + hw, y: yBase, z: z - hd },
    { x: x + hw, y: yBase, z: z + hd },
    { x: x - hw, y: yBase, z: z + hd },
    // Top face
    { x: x - hw, y: yBase + height, z: z - hd },
    { x: x + hw, y: yBase + height, z: z - hd },
    { x: x + hw, y: yBase + height, z: z + hd },
    { x: x - hw, y: yBase + height, z: z + hd },
  ];

  // Apply perspective transformation
  return vertices.map((v) => ({
    x: v.x + v.z * perspective * 0.3,
    y: v.y - v.z * perspective * 0.3,
    z: v.z,
  }));
}

/**
 * Generate 3D grouped bar chart
 */
export function generate3DGroupedBarData(
  categories: string[],
  groups: string[],
  values: number[][][],
  options: {
    title?: string;
    spacing?: number;
  } = {},
): ChartData {
  const { title, spacing = 1.5 } = options;

  const series: ChartSeries[] = [];

  groups.forEach((group, groupIndex) => {
    categories.forEach((cat, catIndex) => {
      const groupValues = values[groupIndex]?.[catIndex] || [];
      
      const data: DataPoint[] = groupValues.map((val, i) => ({
        x: catIndex + (i - groupValues.length / 2) * 0.2,
        y: val,
        z: groupIndex,
        group,
        category: cat,
        index: i,
      }));

      series.push({
        name: `${group} - ${cat}`,
        data,
        type: 'bar3d',
        color: getSeriesColor(groupIndex * categories.length + catIndex),
      });
    });
  });

  return {
    title,
    series,
  };
}

/**
 * Calculate 3D bar occlusion (for proper z-sorting)
 */
export function calculate3DBarOcclusion(
  bars: Array<{
    x: number;
    y: number;
    z: number;
    vertices: Array<{ x: number; y: number; z: number }>;
  }>,
): Array<{ bar: number; occluding: number[] }> {
  return bars.map((bar, i) => {
    const occluding: number[] = [];

    bars.forEach((other, j) => {
      if (i === j) return;

      // Simple bounding box overlap test
      const barMinZ = Math.min(...bar.vertices.map((v) => v.z));
      const barMaxZ = Math.max(...bar.vertices.map((v) => v.z));
      const otherMinZ = Math.min(...other.vertices.map((v) => v.z));
      const otherMaxZ = Math.max(...other.vertices.map((v) => v.z));

      if (otherMinZ < barMaxZ && otherMaxZ > barMinZ) {
        occluding.push(j);
      }
    });

    return { bar: i, occluding };
  });
}

/**
 * Rotate 3D bars around Y axis
 */
export function rotate3DBars(
  data: ChartData,
  angle: number,
): ChartData {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotatedSeries = data.series.map((series) => {
    const rotatedData = series.data.map((point) => {
      const vertices = (point.vertices || []) as Array<{ x: number; y: number; z: number }>;

      const rotatedVertices = vertices.map((v) => ({
        x: v.x * cos - v.z * sin,
        y: v.y,
        z: v.x * sin + v.z * cos,
      }));

      return {
        ...point,
        vertices: rotatedVertices,
      };
    });

    return {
      ...series,
      data: rotatedData,
    };
  });

  return {
    ...data,
    series: rotatedSeries,
  };
}
