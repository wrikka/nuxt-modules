import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Isoline Map - Contour lines on a geographic or spatial grid
 */

/**
 * Generate isoline data for mapping
 */
export function generateIsolineData(
  grid: Array<{
    x: number;
    y: number;
    value: number;
  }>,
  width: number,
  height: number,
  options: {
    title?: string;
    levels?: number;
    colorScheme?: string[];
  } = {},
): ChartData {
  const { title, levels = 10, colorScheme } = options;

  const values = grid.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const levelStep = (max - min) / levels;

  // Convert to 2D array
  const grid2D: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const point = grid.find((p) => p.x === x && p.y === y);
      row.push(point?.value ?? min);
    }
    grid2D.push(row);
  }

  const isolines: Array<{
    level: number;
    lines: Array<Array<{ x: number; y: number }>>;
  }> = [];

  for (let l = 0; l <= levels; l++) {
    const level = min + l * levelStep;
    const lines = traceIsolines(grid2D, width, height, level);

    if (lines.length > 0) {
      isolines.push({ level, lines });
    }
  }

  // Create series
  const series: ChartSeries[] = isolines.map((iso, index) => {
    const data: DataPoint[] = iso.lines.flatMap((line) =>
      line.map((point) => ({
        x: point.x,
        y: point.y,
        isolineValue: iso.level,
        color: colorScheme?.[index] || getSeriesColor(index),
      })),
    );

    return {
      name: `Isoline ${iso.level.toFixed(2)}`,
      data,
      type: 'isoline',
      color: colorScheme?.[index] || getSeriesColor(index),
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Trace isolines using marching squares algorithm
 */
function traceIsolines(
  grid: number[][],
  width: number,
  height: number,
  level: number,
): Array<Array<{ x: number; y: number }>> {
  const lines: Array<Array<{ x: number; y: number }>> = [];
  const visited = new Set<string>();

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const key = `${x},${y}`;
      if (visited.has(key)) continue;

      const z00 = grid[y]?.[x] ?? 0;
      const z10 = grid[y]?.[x + 1] ?? 0;
      const z01 = grid[y + 1]?.[x] ?? 0;
      const z11 = grid[y + 1]?.[x + 1] ?? 0;

      const line = traceIsolineCell(x, y, z00, z10, z01, z11, level);

      if (line.length > 0) {
        lines.push(line);
        visited.add(key);
      }
    }
  }

  return lines;
}

function traceIsolineCell(
  x: number,
  y: number,
  z00: number,
  z10: number,
  z01: number,
  z11: number,
  level: number,
): Array<{ x: number; y: number }> {
  const line: Array<{ x: number; y: number }> = [];

  const above00 = z00 >= level;
  const above10 = z10 >= level;
  const above01 = z01 >= level;
  const above11 = z11 >= level;

  const caseIndex = (above00 ? 8 : 0) + (above10 ? 4 : 0) + (above01 ? 2 : 0) + (above11 ? 1 : 0);

  if (caseIndex === 0 || caseIndex === 15) return line;

  const interpolate = (zA: number, zB: number, posA: number, posB: number): number => {
    if (zA === zB) return (posA + posB) / 2;
    const t = (level - zA) / (zB - zA);
    return posA + t * (posB - posA);
  };

  // Add points based on marching squares case
  if (caseIndex === 1 || caseIndex === 14) {
    line.push(
      { x: interpolate(z01, z11, x, x + 1), y: y + 1 },
      { x: x + 1, y: interpolate(z10, z11, y, y + 1) },
    );
  } else if (caseIndex === 2 || caseIndex === 13) {
    line.push(
      { x: x, y: interpolate(z00, z01, y, y + 1) },
      { x: interpolate(z01, z11, x, x + 1), y: y + 1 },
    );
  } else if (caseIndex === 4 || caseIndex === 11) {
    line.push(
      { x: interpolate(z00, z10, x, x + 1), y: y },
      { x: x + 1, y: interpolate(z10, z11, y, y + 1) },
    );
  } else if (caseIndex === 8 || caseIndex === 7) {
    line.push(
      { x: x, y: interpolate(z00, z01, y, y + 1) },
      { x: interpolate(z00, z10, x, x + 1), y: y },
    );
  }

  return line;
}

/**
 * Calculate gradient from isoline data
 */
export function calculateIsolineGradient(
  grid: Array<{ x: number; y: number; value: number }>,
): Array<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  magnitude: number;
}> {
  const gradients: Array<{ x: number; y: number; dx: number; dy: number; magnitude: number }> = [];

  for (let i = 0; i < grid.length; i++) {
    const point = grid[i];
    const neighbors = grid.filter(
      (p) => Math.abs(p.x - point.x) <= 1 && Math.abs(p.y - point.y) <= 1 && p !== point,
    );

    if (neighbors.length < 2) continue;

    // Calculate gradient using central differences
    const xValues = neighbors.map((n) => n.x);
    const yValues = neighbors.map((n) => n.y);
    const vValues = neighbors.map((n) => n.value);

    const dx = xValues.length > 0
      ? vValues.reduce((sum, v, i) => sum + v * (xValues[i] - point.x), 0) / xValues.length
      : 0;
    const dy = yValues.length > 0
      ? vValues.reduce((sum, v, i) => sum + v * (yValues[i] - point.y), 0) / yValues.length
      : 0;

    gradients.push({
      x: point.x,
      y: point.y,
      dx,
      dy,
      magnitude: Math.sqrt(dx * dx + dy * dy),
    });
  }

  return gradients;
}

/**
 * Find peaks and valleys in isoline data
 */
export function findIsolineExtrema(
  grid: Array<{ x: number; y: number; value: number }>,
): Array<{
  type: 'peak' | 'valley' | 'saddle';
  x: number;
  y: number;
  value: number;
}> {
  const extrema: Array<{ type: 'peak' | 'valley' | 'saddle'; x: number; y: number; value: number }> = [];

  for (const point of grid) {
    const neighbors = grid.filter(
      (p) => Math.abs(p.x - point.x) <= 1 && Math.abs(p.y - point.y) <= 1 && p !== point,
    );

    if (neighbors.length === 0) continue;

    const neighborValues = neighbors.map((n) => n.value);
    const maxNeighbor = Math.max(...neighborValues);
    const minNeighbor = Math.min(...neighborValues);

    if (point.value > maxNeighbor) {
      extrema.push({ type: 'peak', x: point.x, y: point.y, value: point.value });
    } else if (point.value < minNeighbor) {
      extrema.push({ type: 'valley', x: point.x, y: point.y, value: point.value });
    }
  }

  return extrema;
}
