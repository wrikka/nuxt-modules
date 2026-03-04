import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/wchart/app/utils/chart-utils';

/**
 * Contour Plot - 2D contour lines for 3D data
 */

/**
 * Generate contour plot data from 2D grid
 */
export function generateContourData(
  xValues: number[],
  yValues: number[],
  zValues: number[][], // 2D array z[y][x]
  options: {
    title?: string;
    levels?: number;
    colorScheme?: string[];
    smooth?: boolean;
  } = {},
): ChartData {
  const { title, levels = 10, colorScheme, smooth = true } = options;

  const zMin = Math.min(...zValues.flat());
  const zMax = Math.max(...zValues.flat());
  const levelStep = (zMax - zMin) / levels;

  const contourLevels: Array<{
    value: number;
    paths: Array<Array<{ x: number; y: number }>>;
  }> = [];

  for (let l = 0; l <= levels; l++) {
    const levelValue = zMin + l * levelStep;
    const paths = traceContour(xValues, yValues, zValues, levelValue, smooth);

    if (paths.length > 0) {
      contourLevels.push({
        value: levelValue,
        paths,
      });
    }
  }

  // Flatten into series
  const series: ChartSeries[] = contourLevels.map((level, index) => {
    const data: DataPoint[] = level.paths.flatMap((path, pathIndex) =>
      path.map((point) => ({
        x: point.x,
        y: point.y,
        contourValue: level.value,
        pathIndex,
        color: colorScheme?.[index] || getSeriesColor(index),
      })),
    );

    return {
      name: `Level ${level.value.toFixed(2)}`,
      data,
      type: 'contour',
      color: colorScheme?.[index] || getSeriesColor(index),
      layout: {
        level: level.value,
        paths: level.paths.length,
      },
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Trace contour lines using marching squares
 */
function traceContour(
  xValues: number[],
  yValues: number[],
  zValues: number[][],
  level: number,
  smooth: boolean,
): Array<Array<{ x: number; y: number }>> {
  const paths: Array<Array<{ x: number; y: number }>> = [];
  const visited = new Set<string>();

  for (let yi = 0; yi < yValues.length - 1; yi++) {
    for (let xi = 0; xi < xValues.length - 1; xi++) {
      const key = `${xi},${yi}`;
      if (visited.has(key)) continue;

      const z00 = zValues[yi]?.[xi] ?? 0;
      const z10 = zValues[yi]?.[xi + 1] ?? 0;
      const z01 = zValues[yi + 1]?.[xi] ?? 0;
      const z11 = zValues[yi + 1]?.[xi + 1] ?? 0;

      const path = traceCell(xValues, yValues, xi, yi, z00, z10, z01, z11, level, smooth);

      if (path.length > 0) {
        paths.push(path);
        visited.add(key);
      }
    }
  }

  return paths;
}

function traceCell(
  xValues: number[],
  yValues: number[],
  xi: number,
  yi: number,
  z00: number,
  z10: number,
  z01: number,
  z11: number,
  level: number,
  smooth: boolean,
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = [];

  // Determine which corners are above the level
  const above00 = z00 >= level;
  const above10 = z10 >= level;
  const above01 = z01 >= level;
  const above11 = z11 >= level;

  const caseIndex = (above00 ? 8 : 0) + (above10 ? 4 : 0) + (above01 ? 2 : 0) + (above11 ? 1 : 0);

  if (caseIndex === 0 || caseIndex === 15) return path; // All above or all below

  const x0 = xValues[xi];
  const x1 = xValues[xi + 1];
  const y0 = yValues[yi];
  const y1 = yValues[yi + 1];

  // Interpolate points on edges
  const interpolate = (zA: number, zB: number, posA: number, posB: number): number => {
    if (!smooth || zA === zB) return (posA + posB) / 2;
    const t = (level - zA) / (zB - zA);
    return posA + t * (posB - posA);
  };

  // Add points based on case
  if (caseIndex === 1 || caseIndex === 14) {
    path.push(
      { x: interpolate(z01, z11, x0, x1), y: y1 },
      { x: x1, y: interpolate(z10, z11, y0, y1) },
    );
  } else if (caseIndex === 2 || caseIndex === 13) {
    path.push(
      { x: x0, y: interpolate(z00, z01, y0, y1) },
      { x: interpolate(z01, z11, x0, x1), y: y1 },
    );
  } else if (caseIndex === 4 || caseIndex === 11) {
    path.push(
      { x: interpolate(z00, z10, x0, x1), y: y0 },
      { x: x1, y: interpolate(z10, z11, y0, y1) },
    );
  } else if (caseIndex === 8 || caseIndex === 7) {
    path.push(
      { x: x0, y: interpolate(z00, z01, y0, y1) },
      { x: interpolate(z00, z10, x0, x1), y: y0 },
    );
  }

  return path;
}

/**
 * Calculate contour statistics
 */
export function calculateContourStats(
  data: ChartData,
): {
  totalArea: number;
  levelRanges: Array<{ level: number; area: number; perimeter: number }>;
  gradient: Array<{ x: number; y: number; magnitude: number; direction: number }>;
} {
  const levelRanges: Array<{ level: number; area: number; perimeter: number }> = [];

  data.series.forEach((series) => {
    const level = series.layout?.level as number;
    const paths = series.layout?.paths as number;

    // Approximate area and perimeter
    let area = 0;
    let perimeter = 0;

    series.data.forEach((point: DataPoint, i, arr) => {
      if (i < arr.length - 1) {
        const next = arr[i + 1];
        if ((point as DataPoint & { pathIndex: number }).pathIndex === (next as DataPoint & { pathIndex: number }).pathIndex) {
          const dx = ((next as DataPoint).x as number) - ((point as DataPoint).x as number);
          const dy = ((next as DataPoint).y as number) - ((point as DataPoint).y as number);
          perimeter += Math.sqrt(dx * dx + dy * dy);
        }
      }
    });

    area = perimeter * perimeter / (4 * Math.PI); // Rough circle approximation

    levelRanges.push({ level, area, perimeter });
  });

  const totalArea = levelRanges.reduce((sum, r) => sum + r.area, 0);

  return {
    totalArea,
    levelRanges,
    gradient: [],
  };
}
